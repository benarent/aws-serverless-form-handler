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

Helpful Intro - https://www.jeremydaly.com/\aurora-serverless-data-api-a-first-look/
*/

'use strict'

const AWS = require('aws-sdk')
const RDS = new AWS.RDSDataService()
const time = new Date().toISOString();


const saveFormDataPG = async (formData) => {

    var sqlStatement = "INSERT INTO survey_data (email, os, version, submitted)\
    VALUES('"+formData.email+"','"+formData.OS+"','"+formData.version+"', '"+time+"')"

    // The Lambda environment variables for the Aurora Cluster Arn, Database Name, and the AWS Secrets Arn hosting the master credentials of the serverless db
    var DBSecretsStoreArn = process.env.DBSecretsStoreArn;
    var DBAuroraClusterArn = process.env.DBAuroraClusterArn;
    var DatabaseName = process.env.DatabaseName;

    const params = {
      secretArn: DBSecretsStoreArn,
      resourceArn: DBAuroraClusterArn,
      sql: sqlStatement,
      parameters: [
        {
          name: 'email',
          value: {
            "stringValue": formData.email
          }
        },
        {
          name: 'os',
          value: {
            "stringValue": formData.OS
          }
        },
        {
          name: 'version',
          value: {
            "stringValue": formData.version
          }
        }
      ],
      database: DatabaseName
    }


    try {
      //console.log(JSON.stringify(dbResponse, null, 2))
      // https://docs.aws.amazon.com/rdsdataservice/latest/APIReference/API_ExecuteStatement.html
      let dbResponse = await RDS.executeStatement(params).promise()

      console.log(JSON.stringify(dbResponse, null, 2))
      //console.log(JSON.stringify(data, null, 2))

      return 'done'
      //return JSON.stringify(dbResponse)

    } catch (error) {
        console.log(error)
      return error
    }
}

module.exports = { saveFormDataPG }