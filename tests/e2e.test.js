// e2e.test.js
const axios = require('axios');
const { deleteAppointmentById } = require('../utils/deleteById');

const BASE_URL = process.env.E2E_TEST_URL;
const API_KEY = 'mysecretkey';
const ID = '2025-05-04T15:30:00Z';

describe('E2E: /appointments', () => {
    beforeAll(async () => {
        await deleteAppointmentById(ID);
    });

    const payload = {
        fullName: 'Jane Doe',
        location: 'Farrish Subaru',
        appointmentTime: ID,
        car: 'Subaru Outback',
        services: ['Oil Change', 'Tire Rotation']
    };

    it('200 OK: appointment created', async () => {
        const res = await axios.post(
            `${BASE_URL}/appointments`,
            payload,
            { headers: { 'x-api-key': API_KEY } }
        );

        expect(res.status).toBe(200);
        expect(res.data.id).toBe(payload.appointmentTime);
    });

    it('400 Bad Request: missing fields', async () => {
        await expect(
            axios.post(
                `${BASE_URL}/appointments`,
                { location: 'Missing everything else' },
                { headers: { 'x-api-key': API_KEY } }
            )
        ).rejects.toMatchObject({ response: { status: 400 } });
    });

    it('401 Unauthorized: wrong API key', async () => {
        await expect(
            axios.post(
                `${BASE_URL}/appointments`,
                payload,
                { headers: { 'x-api-key': 'API_KEY' } }
            )
        ).rejects.toMatchObject({ response: { status: 401 } });
    });

    it('409 Conflict: duplicate slot', async () => {
        // re-POST the same payload/time
        await expect(
            axios.post(
                `${BASE_URL}/appointments`,
                payload,
                { headers: { 'x-api-key': API_KEY } }
            )
        ).rejects.toMatchObject({ response: { status: 409 } });
    });
});

