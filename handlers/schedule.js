'use strict';
// require('dotenv').config();

const { validateAppointment, ValidationError } = require('../utils/validator');
const { ConflictError } = require('../Error/service_errors');
const logger = require('../utils/logger');
const { createAppointment } = require('../services/appointment');
const { API_KEY } = require('../config');

module.exports.handler = async (event) => {
    try {
        const apiKey = event.headers['x-api-key'];
        if (!apiKey || apiKey !== API_KEY) {
            return { statusCode: 401, body: JSON.stringify({ message: 'Unauthorized' }) };
        }
        const body = JSON.parse(event.body);

        validateAppointment(body);

        const appointment = await createAppointment(body);

        return { statusCode: 200, body: JSON.stringify({ id: appointment.id }) };
    } catch (err) {
        if (err instanceof ValidationError) {
            return { statusCode: 400, body: JSON.stringify({ message: err.message }) };
        }
        if (err instanceof ConflictError) {
            return { statusCode: 409, body: JSON.stringify({ message: err.message }) };
        }
        return { statusCode: 500, body: JSON.stringify({ message: 'Internal Server Error' }) };
    }
};
