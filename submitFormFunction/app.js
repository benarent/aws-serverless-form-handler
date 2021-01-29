/*
  Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
  Permission is hereby granted, free of charge, to any person obtaining a copy of this
  software and associated documentation files (the "Software"), to deal in the Software
  without restriction, including without limitation the rights to use, copy, modify,
  merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
  permit persons to whom the Software is furnished to do so.
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
  INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
  PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
  HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
  OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

'use strict'

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 */

const { saveFormData } = require('./dynamodb')
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

    const result = await parser.parse(event);
    console.log(result.OS);
    console.log(result.version);
    console.log(result.email)
    console.log(`what's the result:` + result)

    console.log(`Started with: ${event.body}`)
    const formData = (result)

    try {
      // Send email and save to DynamoDB in parallel using Promise.all
      await Promise.all([sendEmail(formData), saveFormData(formData)])

      return {
          statusCode: 200,
          body: "Thank you for submitting Teleport usage data \n",
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
