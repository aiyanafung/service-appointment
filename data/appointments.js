'use strict';

const AWS = require('aws-sdk');
const logger = require('../utils/logger');
//const dynamo = new AWS.DynamoDB.DocumentClient({ region: 'us-east-2' });
const dynamo = new AWS.DynamoDB.DocumentClient();
const { APPOINTMENTS_TABLE } = require('../config');

function putAppointment(item) {
    logger.log('Putting to DDB: ', APPOINTMENTS_TABLE);
    return dynamo
        .put({
            TableName: APPOINTMENTS_TABLE,
            Item: item,
            ConditionExpression: 'attribute_not_exists(id)',
        })
        .promise();
}

module.exports = { putAppointment };
