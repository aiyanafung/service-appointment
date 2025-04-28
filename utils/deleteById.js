const AWS = require('aws-sdk');

// Configure this exactly as your local DynamoDB-Local client
const dynamo = new AWS.DynamoDB.DocumentClient({
    region: 'us-east-1',
});

const TABLE = process.env.APPOINTMENTS_TABLE || 'appointments';

/**
 * Delete a single appointment item by id.
 * @param {string} id - The composite key (e.g. "Farrish Subaru#2025-04-20T15:30:00Z")
 */
async function deleteAppointmentById(id) {
    await dynamo
        .delete({
            TableName: TABLE,
            Key: { id },
        })
        .promise();
}

module.exports = { deleteAppointmentById };
