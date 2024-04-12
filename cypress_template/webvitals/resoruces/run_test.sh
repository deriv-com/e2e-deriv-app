#!/bin/sh

# #     Inputs expected from GH workflow.   # #

STAGING_AUTH_TOKEN=`python3 login.py $1 $2 $3`
node stage_wpt.js $STAGING_AUTH_TOKEN $4