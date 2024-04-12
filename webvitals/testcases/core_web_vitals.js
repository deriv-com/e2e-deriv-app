const fs = require('fs');
const WebPageTest = require('webpagetest');
const xlsx = require('xlsx');

var api_key = process.argv[3];
var version = process.argv[4].replace(/\s/g, '-');

var test_data_file = '../resources/testdata.xlsx';

const wptServer = "www.webpagetest.org";
const wpt = new WebPageTest(wptServer, api_key);
var failedTests = [];

const location = 'ec2-af-south-1:Chrome';
const connectivity = '3GFast';
let stage_auth_url = process.argv[2] + '&lang=EN';

const workbook = xlsx.readFile(test_data_file);
const worksheet = workbook.Sheets['urls'];
const xl_data = xlsx.utils.sheet_to_json(worksheet);

async function getTestURLs() {
    for (const row of xl_data) {
        const url = row.url;
        const device = row.device;
        const uniq_string = Math.random().toString(36).substring(2, 6);
        const label = uniq_string+version;

        const prodStagingScores = {
            FCP: row.FCP,
            LCP: row.LCP,
            CLS: row.CLS
        };

        if (url === 'https://staging-app.deriv.com') {
            session_url = url;
        } else if (url.startsWith('https://staging-app.deriv.com/') && url.length > 'https://staging-app.deriv.com/'.length) {
            session_url = url + stage_auth_url;
        }

        const tagStagingScores = await getPerformanceMetrics(session_url, device, label);
        await new Promise(resolve => setTimeout(resolve, 30000));

        compareScores(prodStagingScores, tagStagingScores, device, url);
    }
    testReport();
}

async function getPerformanceMetrics(session_url, device, label) {
    try {
        console.log(`Test initiated --------> on URL: ${session_url.split('?')[0]}`);
        const testResult = await new Promise((resolve, reject) => {
            wpt.runTest(session_url, {
                location: location,
                connectivity: connectivity,
                firstViewOnly: true,
                label: label,
                device: device,
                runs: 2,
            }, (err, result) => {
                if (err) {
                    console.error('Error:', err);
                    reject(err);
                    return;
                }
                resolve(result);
            });
        });

        const testId = testResult.data.testId;
        console.log('Test ID:', testId);

        let testStatus;
        do {
            testStatus = await new Promise((resolve, reject) => {
                wpt.getTestStatus(testId, (err, statusData) => {
                    if (err) {
                        console.error('Error fetching test status:', err);
                        reject(err);
                        return;
                    }
                    resolve(statusData.data.statusCode);
                });
            });

            console.log('Test status:', testStatus);

            if (testStatus !== 200) {
                await new Promise(resolve => setTimeout(resolve, 10000));
            }
        } while (testStatus !== 200);

        console.log('Test completed. Fetching test results...');

        const testData = await new Promise((resolve, reject) => {
            wpt.getTestResults(testId, (err, data) => {
                if (err) {
                    console.error('Error fetching test results:', err);
                    reject(err);
                    return;
                }
                resolve(data);
            });
        });

        output_file = `../report_outputs/${testId}_${device}_${session_url.replace(/^https?:\/\//, '').split('?')[0].replace(/[^\w\s]/gi, '_')}.json`

        fs.writeFile(output_file, JSON.stringify(testData), (err) => {
            if (err) {
                console.error('Error writing test result to file:', err);
            } else {
                console.log('WebPageTest report written to', output_file);
            }
        });

        const scores = {
            FCP: testData.data.average.firstView.firstPaint,
            LCP: testData.data.average.firstView['chromeUserTiming.LargestContentfulPaint'],
            CLS: testData.data.average.firstView["chromeUserTiming.CumulativeLayoutShift"],
            PAGE_FULLY_LOADED: testData.data.average.firstView.fullyLoaded,
            FULL_REPORT: testData.data.summary,
        };

        if (scores.FCP === null || scores.LCP === null || scores.CLS === null || scores.PAGE_FULLY_LOADED === null || scores.FULL_REPORT === null) {
            throw new Error('One or more metrics are null in TAG staging run');
        }

        return scores;
    } catch (error) {
        console.error('Error in getPerformanceMetrics:', error);
        throw error;
    }
}


function compareScores(prodStagingScores, tagStagingScores, device, url) {
    console.log('Production Scores (ms):', prodStagingScores);
    console.log('Staging Scores (ms):', tagStagingScores);

    const FCPThreshold = prodStagingScores.FCP * 1.03;
    const LCPThreshold = prodStagingScores.LCP * 1.03;
    const CLSThreshold = prodStagingScores.CLS * 1.03;

    validateMetric('FCP', prodStagingScores.FCP, tagStagingScores.FCP, FCPThreshold, tagStagingScores.FULL_REPORT, url, device);
    validateMetric('LCP', prodStagingScores.LCP, tagStagingScores.LCP, LCPThreshold, tagStagingScores.FULL_REPORT, url, device);
    validateMetric('CLS', prodStagingScores.CLS, tagStagingScores.CLS, CLSThreshold, tagStagingScores.FULL_REPORT, url, device);

    console.log('Test completed for', device, 'on', url);
}


function validateMetric(metricName, productionValue, stagingValue, threshold, stageFinalReport, url, device) {
    if (stagingValue <= productionValue) {
        console.log(`Staging ${metricName} score is better than or same as production score.`);
        if (stagingValue < productionValue) {
            console.log(`Updating production ${metricName} score in Excel.`);
            updateExcelMetric(metricName, stagingValue, url, device, xl_data, workbook);
        }
    }
    else {
        if (stagingValue <= threshold) {
            console.log(`Staging has higher ${metricName} score compared to production but within 3% threshold.`);
        }
        else {
            console.error(`Staging has higher ${metricName} score exceeding 3% threshold.`);
            failedTests.push(`Staging test: ${stageFinalReport} failed for ${metricName} against prod`);
        }
    }
}

function updateExcelMetric(metricName, value, url, device, jsonData, workbook) {
    const row = jsonData.find(row => row.url === url && row.device === device);
    if (row) {
        row[metricName] = value;
        console.log(`Updated ${metricName} value in JSON for URL: ${url}`);
        const updatedWorksheet = xlsx.utils.json_to_sheet(jsonData);
        workbook.Sheets['urls'] = updatedWorksheet;
        xlsx.writeFile(workbook, test_data_file);
    } else {
        console.error(`Row not found in JSON for URL: ${url} and Device: ${device}`);
    }
}

module.exports = updateExcelMetric;

function testReport() {
    if (failedTests.length > 0) {
        console.error("Some test/s failed:", failedTests);
        process.exit(1);
    } else {
        console.log("All tests passed!");
    }
}

getTestURLs();
