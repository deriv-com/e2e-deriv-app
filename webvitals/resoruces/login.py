from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
import subprocess
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
import sys
import time
import re


if re.match('green', sys.argv[2]) or re.match('red', sys.argv[2]) or re.match('blue', sys.argv[2]) or re.match('canary', sys.argv[2]):
    sys.argv[2] = 'oauth.deriv.com'
elif re.match('dev', sys.argv[2]):
    sys.argv[2] = sys.argv[2]

PASSWORD =  sys.argv[1]
auth_url = 'https://'+sys.argv[2]+'/oauth2/authorize?app_id='+sys.argv[3]+''

def get_auth_tokens():
    capabilities = DesiredCapabilities.CHROME
    capabilities["goog:loggingPrefs"] = {"performance": "ALL"}
    chrome_options = Options()
    chrome_options.add_argument('--headless')
    # #    specify chrome driver path when testing locally     # #
    #chrome_options.binary_location = "/Users/luqmaan/Desktop/chrome-mac-x64/"
    driver = webdriver.Chrome(options=chrome_options)

    try:
        token_list = ''
        DERIV_EMAIL = 'webvitals@deriv.com'
        driver.get(auth_url)
        email_field = driver.find_element('id', 'txtEmail')
        email_field.send_keys(DERIV_EMAIL)
        pass_field = driver.find_element('id', 'txtPass')
        pass_field.send_keys(PASSWORD)
        login_button = driver.find_element('name', 'login')
        login_button.click()
        time.sleep(3)
        try:
            authorise_this_app = driver.find_element('id', 'btnGrant')
            authorise_this_app.click()
        except:
            pass
        logs = driver.get_log("performance")
        log_file = open('./pyout.txt', 'w')
        log_file.write(str(logs))
        cmd = ["""grep -o '"location":"https://[^"]*state=' pyout.txt | tail -n1 | sed -e 's/"location":"https:\\/\\/app.deriv.com//' -e 's/"location":"https:\\/\\/staging-app.deriv.com//'"""]
        token = subprocess.run(cmd, shell=True, stdout=subprocess.PIPE, text=True)
        token_list = (token.stdout)
        log_file = open('./pyout.txt', 'w')     #This is to tuncate the file content for next run
    finally:
        driver.quit()
        print(token_list)
        return(token_list)

get_auth_tokens()
