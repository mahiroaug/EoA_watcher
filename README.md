# lambda deploy

```
cd lambda_layer

zip -r nodejs_layer.zip nodejs
aws lambda publish-layer-version --layer-name web3-eoacheacker-nodejs-layer  --description "1st publish" --zip-file fileb://nodejs_layer.zip --compatible-runtimes nodejs18.x --compatible-architectures "x86_64"

zip -r lambda.zip index.js lib
aws lambda update-function-code --function-name web3-eoa_watcher --zip-file fileb://lambda.zip
```