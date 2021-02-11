
/*
Copyright 2021 Gravitational, Inc.
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Modified version of https://github.com/jbesw/aws-serverless-form-handler
*/

'use strict'

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 */

const { saveFormDataPG } = require('./postgres')
const { sendEmail } = require('./ses')
const parser = require('lambda-multipart-parser');

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': "Content-Type",
  "Access-Control-Allow-Methods": "OPTIONS,POST"
}

// Main Lambda entry point
exports.handler = async (event) => {
    if (event.body === null) {
      return{
         statusCode: 500,
         body: 'Error: Missing Survey Data\n',
         headers}
    }else{

    const result = await parser.parse(event)
    const formData = (result)

    try {
      // Send email and save to Postgres in parallel using Promise.all
      await Promise.all([sendEmail(formData), saveFormDataPG(formData)])

      return {
          // Returns error message back to user.
          statusCode: 200,
          body: "Thank you for submitting Teleport usage data.\nWe will send you a meaningful newsletter and reach out to send some swag.\n",
          headers
      }
    } catch(err) {
      console.error('handler error: ', err)

      return {
          statusCode: 500,
          body: 'Error \n',
          headers
      }
    }
  }
}
