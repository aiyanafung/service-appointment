'use strict';
// require('dotenv').config();

const { validateAppointment, ValidationError } = require('../utils/validator');
const { ConflictError } = require('../Error/service_errors');
const logger = require('../utils/logger');
const { createAppointment } = require('../services/appointment');
const { API_KEY } = require('../config');

module.exports.handler = async (event) => {
    try {
        // simple API key check
        const apiKey = event.headers['x-api-key'];
        if (!apiKey || apiKey !== API_KEY) {
            return { statusCode: 401, body: JSON.stringify({ message: 'Unauthorized' }) };
        }

        const body = JSON.parse(event.body);
        console.log('Parsed Body:', body);
        validateAppointment(body);
        console.log('Validation passed.');

        const appointment = await createAppointment(body);
        //logger.log('Created appointment', appointment.id);
        console.log('Appointment created:', appointment);

        return { statusCode: 200, body: JSON.stringify({ id: appointment.id }) };
    } catch (err) {
        if (err instanceof ValidationError) {
            return { statusCode: 400, body: JSON.stringify({ message: err.message }) };
        }
        if (err instanceof ConflictError) {
            return { statusCode: 409, body: JSON.stringify({ message: err.message }) };
        }
        console.error(err);
        return { statusCode: 500, body: JSON.stringify({ message: 'Internal Server Error' }) };
    }
};
