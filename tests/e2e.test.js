const AWS = require('aws-sdk');
const { handler } = require('../handlers/schedule');

jest.mock('aws-sdk', () => {
    // your fake DocumentClient instance
    const mDocClient = {
        put: jest.fn().mockReturnThis(),
        promise: jest.fn()
    };
    return {
        DynamoDB: {
            DocumentClient: jest.fn(() => mDocClient)
        }
    };
});

describe('E2E: scheduleAppointment', () => {
    const OLD_ENV = process.env;
    beforeAll(() => {
        process.env.API_KEY = 'mysecretkey';
        process.env.APPOINTMENTS_TABLE = 'appointments';
    });
    afterAll(() => {
        process.env = OLD_ENV;
    });
    const makeEvent = (body, key = 'mysecretkey') => ({
        headers: { 'x-api-key': key },
        body: JSON.stringify(body),
    });

    it('creates appointment - 200', async () => {
        // mDocClient.promise.mockResolvedValue({});
        const AWS = require('aws-sdk');
        const mockClient = AWS.DynamoDB.DocumentClient.mock.results[0].value;
        const evt = makeEvent({
            fullName: 'Jane',
            location: 'Farrish Subaru',
            appointmentTime: '2025-04-20T15:30:00Z',
            car: 'Subaru Outback',
            services: ['Oil Change']
        });
        const res = await handler(evt);
        expect(res.statusCode).toBe(200);
        expect(JSON.parse(res.body).id).toBe('2025-04-20T15:30:00Z');
    });

    it('conflict on same slot- 409', async () => {
        const AWS = require('aws-sdk');
        const mockClient = AWS.DynamoDB.DocumentClient.mock.results[0].value;
        mockClient.promise.mockRejectedValue({ code: 'ConditionalCheckFailedException' });
        const evt = makeEvent({
            fullName: 'Jane',
            location: 'Farrish Subaru',
            appointmentTime: '2025-04-20T15:30:00Z',
            car: 'Subaru',
            services: ['Oil Change']
        });
        const res = await handler(evt);
        expect(res.statusCode).toBe(409);
        expect(JSON.parse(res.body)).toEqual({
            message: 'Appointment conflict at this time slot',
        });
    });
});
