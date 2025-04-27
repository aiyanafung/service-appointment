'use strict';

class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}

function validateAppointment(data) {
    if (
        !data.fullName ||
        !data.location ||
        !data.appointmentTime ||
        !data.car ||
        !Array.isArray(data.services) ||
        data.services.length === 0
    ) {
        throw new ValidationError('Missing or invalid appointment data');
    }
    if (isNaN(Date.parse(data.appointmentTime))) {
        throw new ValidationError('Invalid appointmentTime format');
    }
}

module.exports = { validateAppointment, ValidationError };