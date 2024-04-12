#!/bin/sh

# #     Inputs expected from GH workflow.   # #

STAGING_AUTH_TOKEN=`python3 login.py $1 $2 $3`
if [[ $STAGING_AUTH_TOKEN =~ '?acct1=CR' ]]; then
    echo "Token generation completed at: `date`"
    echo "Executing test scripts..."
else
    echo "$0 - Error \$STAGING_AUTH_TOKEN are NULL, please check environement|app_id is valid and account exists. "
    exit 1;
fi
node core_web_vitals.js $STAGING_AUTH_TOKEN $4