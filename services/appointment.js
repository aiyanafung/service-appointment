'use strict';

const data = require('../data/appointments');
const { ConflictError } = require('../Error/service_errors')

async function createAppointment(input) {
    // Use appointmentTime as ID to enforce one-per-slot
    const id = input.appointmentTime;
    const item = { id, ...input };
    try {
        await data.putAppointment(item);
        return item;
    } catch (err) {
        if (err.code === 'ConditionalCheckFailedException') {
            throw new ConflictError('Appointment conflict at this time slot');
        }
        throw err;
    }
}

module.exports = { createAppointment };
