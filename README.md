# Teleport serverless adoption metrics.

The Serverless Form Handler accepts a form submission from a webpage, saving the data to a DynamoDB table and sending an email via SES.

Important: this application uses various AWS services and there are costs associated with these services after the Free Tier usage - please see the [AWS  pricing page](https://aws.amazon.com/pricing/) for details.

```bash
.
├── README.MD                   <-- This instructions file
├── submitFormFunction          <-- Source code for the main lambda function
│   └── app.js                  <-- Main Lambda handler
│   └── dynamodb.js             <-- DynamoDB helper function
│   └── ses.js                  <-- Wrapper for Amazon SES
│   └── testHarness.js          <-- For testing code locally
│   └── package.json            <-- NodeJS dependencies and scripts
├── template.yaml               <-- SAM template
```

## Requirements

* AWS CLI already configured with Administrator permission
* [NodeJS 12.x installed](https://nodejs.org/en/download/)

## Installation Instructions

1. [Create an AWS account](https://portal.aws.amazon.com/gp/aws/developer/registration/index.html) if you do not already have one and login.
1. Go to the app's page on the [Serverless Application Repository](https://serverlessrepo.aws.amazon.com/applications/) and click "Deploy"
1. Provide the required app parameters (see parameter details below) and click "Deploy"

## Parameter Details

* Validated email: provided an email address that has been validated in the Amazon SES service in the same region when you are deploying this application. For instructions on how to validate an email in SES, see [this page](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/verify-email-addresses-procedure.html).

## Using this Application

* This application creates an API Gateway endpoint where browser-based forms can send text-based form data. The application will store the response in a DynamoDB table and email the form data to the Validated Email.
* This application is for educational purposes and does not provide any throttling on the API Gateway endpoint. For production usage, you should [apply throttling to your API resources](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-request-throttling.html).

## How it works

* Deploy this serverless application and take a note of the API endpoint.

## Deploy


`sam deploy`

## Test

`curl -X POST https://9sjnq1g1j9.execute-api.us-west-2.amazonaws.com/Prod/usage -F  OS=darwin -F version=5.1 -F email=alice@example.com `


## TODO

- [ ] Create permission for Lambda to execute RDS Data API
- [ ] SAM to create the serverless database and create the correct table


### Postgres Table

Currently AWS SAM doesn't have a best pratice for creating a table.

```
CREATE TABLE survey_data (
	survey_id serial PRIMARY KEY,
	email VARCHAR ( 255 ) NOT NULL,
	os VARCHAR ( 20 ) NOT NULL,
version VARCHAR ( 20 ) NOT NULL,
	submitted TIMESTAMP NOT NULL
)
```

==============================================

This project was based on https://github.com/jbesw/aws-serverless-form-handler
SPDX-License-Identifier: MIT-0