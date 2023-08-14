# provisioning

```
cd lambda_layer/nodejs
npm install
```


# lambda deploy

```
cd lambda_layer

zip -r nodejs_layer.zip nodejs
aws lambda publish-layer-version --layer-name web3-eoacheacker-nodejs-layer  --description "1st publish" --zip-file fileb://nodejs_layer.zip --compatible-runtimes nodejs18.x --compatible-architectures "x86_64"

zip -r lambda.zip index.js
aws lambda update-function-code --function-name web3-eoa_watcher --zip-file fileb://lambda.zip
aws lambda update-function-code --function-name web3-eoa_watcher_prod --zip-file fileb://lambda.zip
```

# setup environment

```
INFURA_PROJECT_ID=***********

# goerli
INFURA_URL=https://goerli.infura.io/v3/

# mainnet
INFURA_URL=https://mainnet.infura.io/v3/

### Incoming Webhooks for slack-app (NOT the custom-integration)
##SLACK_WEBHOOK_URL=https://hooks.slack.com/services/*****

### OAUTH TOKEN
SLACK_OAUTH_TOKEN=********
SLACK_POST_CHANNEL=*******

WATCH_ADDRESS01=0x***********
WATCH_ADDRESS01_INFO=<ADDRESS INFORMATION>
```