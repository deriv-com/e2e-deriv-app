const fs = require('fs');
const WebPageTest = require('webpagetest');
const xlsx = require('xlsx');

var api_key = process.argv[3];
var tag_version = process.argv[4].replace(/[\s_]/g, '-');

var test_data_file = '../resources/testdata.xlsx';

const wptServer = "www.webpagetest.org";
const wpt = new WebPageTest(wptServer, api_key);
var failedTests = [];
var failedImages = [];

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

        const stagingScores = await getPerformanceMetrics(session_url, device);
        await new Promise(resolve => setTimeout(resolve, 30000));

        const tagStagingScores = {
            FCP: stagingScores.data.average.firstView.firstPaint,
            LCP: stagingScores.data.average.firstView['chromeUserTiming.LargestContentfulPaint'],
            CLS: stagingScores.data.average.firstView["chromeUserTiming.CumulativeLayoutShift"],
            PAGE_FULLY_LOADED: stagingScores.data.average.firstView.fullyLoaded,
            FULL_REPORT: stagingScores.data.summary,
        };

        if (tagStagingScores.FCP === null || tagStagingScores.LCP === null || tagStagingScores.CLS === null || tagStagingScores.PAGE_FULLY_LOADED === null || tagStagingScores.FULL_REPORT === null) {
            throw new Error('One or more metrics are null in TAG staging run');
        }
        
        const stagingImages = {
            IMAGES_DATA: stagingScores.data.median.firstView,
        }

        compareScores(prodStagingScores, tagStagingScores, device, url);

        validateImagesSize(stagingImages.IMAGES_DATA);

        console.log('Test completed for', device, 'on', url);

    }
    testReport();
}

async function getPerformanceMetrics(session_url, device) {
    try {
        console.log(`Test initiated --------> on URL: ${session_url.split('?')[0]}`);
        const testResult = await new Promise((resolve, reject) => {
            wpt.runTest(session_url, {
                location: location,
                connectivity: connectivity,
                firstViewOnly: true,
                label: tag_version,
                device: device,
                runs: 3,
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

        return testData
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
        console.log(`Updated ${metricName} value in excel for URL: ${url}`);
        const updatedWorksheet = xlsx.utils.json_to_sheet(jsonData);
        workbook.Sheets['urls'] = updatedWorksheet;
        xlsx.writeFile(workbook, test_data_file);
    } else {
        console.error(`Row not found in excel for URL: ${url} and Device: ${device}`);
    }
}

module.exports = updateExcelMetric;

function validateImagesSize(images_data) {
    console.log("Validating images size");
    var first_view_requests = images_data.requests;
    for (var i = 0; i < first_view_requests.length; i++) {
        var request = first_view_requests[i];
        if (request.contentType === "image/svg+xml") {
            var objectSize = request.objectSize;
            if (objectSize > 700000) {
                var failed_image = {
                    url: request.full_url,
                    size: objectSize
                };
                failedImages.push(failed_image);
            }
        }
    }
    
    // Print the details of SVG images that failed validation
    for (var j = 0; j < failedImages.length; j++) {
        var failed_image = failedImages[j];
        console.error("Image size validation failed!!!")
        console.log("SVG Image URL: " + failed_image.url);
        console.log("Object Size: " + failed_image.size + " bytes");
    }
}


function testReport() {
    if (failedTests.length > 0) {
        console.error("Some test/s score validation failed:", failedTests);
        process.exit(1);
    } else {
        console.log("Scores tests passed!");
    }
    if (failedImages.length > 0) {
        console.error("Some test/s image validation failed:", failedImages);
        process.exit(1);
    } else {
        console.log("Images tests passed!");
    }
}

getTestURLs();
