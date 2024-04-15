#!/bin/sh

# #     Inputs expected from GH workflow.   # #
# #     $1:acc email $2:acc password; $3:environemnt; $4:app_id; $5:wpt_key $6:run version for tagging      # #

STAGING_AUTH_TOKEN=`python3 login.py $1 $2 $3 $4`
if [[ $STAGING_AUTH_TOKEN =~ '?acct1=CR' ]]; then
    echo "Token generation completed at: `date`"
    echo "Executing test scripts..."
else
    echo "$0 - Error \$STAGING_AUTH_TOKEN are NULL, please check environement|app_id is valid and account exists. "
    exit 1;
fi
node ../testcases/core_web_vitals.js $STAGING_AUTH_TOKEN $5 $6