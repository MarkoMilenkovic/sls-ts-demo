Demo project with serverless framework and nodejs.
After installing and configuring serverless: 

serverless config credentials \
  --provider aws \
  --key ACCESS_KEY \
  --secret SECRET_KEY

Use serverless-plugin-typescript:
1. npm install -D serverless-plugin-typescript typescript
2. Register plugin in serverless.yml

To test locally use serverless-ofline plugin:
1. Install serverless-offline plugin: npm install serverless-offline --save-dev
2. Register plugin in serverless.yml
3. Configure start script in package.json
4. Run project locally: npm run dev (=> this will invoke sls offline start --httpPort 3000)
Use endpoints with localhost:3000.
Note: requires re-runing previous command only if serverless.yml has been modified.

To use local dynamo-db, serverless-dynamodb-local plugin is available:
1. Install serverless-dynamodb-local plugin: npm install --save serverless-dynamodb-local 
2. Register plugin in serverless.yml
3. Install dynamodb using sls: sls dynamodb install
4. Add Local DynamoDb configuration in serverless.yml
5. Make sure to instantiate and use dynamo db client with local configuration.
6. Run project locally (it will run local dynamo)

To deploy changes to AWS:
1. Run: sls deploy

From output use HTTP endpoints.