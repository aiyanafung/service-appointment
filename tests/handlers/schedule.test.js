const { ConflictError } = require('../../Error/service_errors');
const { handler } = require('../../handlers/schedule');
const appointmentService = require('../../services/appointment');

jest.mock('../../services/appointment');


describe('schedule handler', () => {
    const OLD_ENV = process.env;
    beforeEach(() => {
        jest.resetModules();
        process.env.API_KEY = 'mysecretkey';
    });
    afterEach(() => {
        process.env = OLD_ENV;
    });

    const baseEvent = {
        headers: { 'x-api-key': 'mysecretkey' },
        body: JSON.stringify({
            fullName: 'Jane Doe',
            location: 'Farrish Subaru',
            appointmentTime: '2025-04-20T15:30:00Z',
            car: 'Subaru Outback',
            services: ['Oil Change', 'Tire Rotation'],
        }),
    };

    const invalidEvent = {
        headers: { 'x-api-key': 'mysecretkey' },
        body: JSON.stringify({
            location: 'Farrish Subaru',
            appointmentTime: '2025-04-20T15:30:00Z',
            car: 'Subaru Outback',
            services: ['Oil Change', 'Tire Rotation'],
        }),
    };

    it('200 OK on success', async () => {
        appointmentService.createAppointment.mockResolvedValue({ id: '2025-04-20T15:30:00Z' });
        const res = await handler(baseEvent);
        expect(res.statusCode).toBe(200);
        expect(JSON.parse(res.body)).toEqual({ id: '2025-04-20T15:30:00Z' });
    });

    it('400 Bad Request on validation error', async () => {

        const res = await handler(invalidEvent);
        expect(res.statusCode).toBe(400);
        expect(JSON.parse(res.body)).toEqual({ message: 'Missing or invalid appointment data' });
    });

    it('401 Unauthorized on missing/wrong API key', async () => {
        const res = await handler({ ...baseEvent, headers: {} });
        expect(res.statusCode).toBe(401);
    });

    it('409 Conflict on time-slot clash', async () => {
        const conflict = new ConflictError('Conflict');
        appointmentService.createAppointment.mockRejectedValue(conflict);
        const res = await handler(baseEvent);
        expect(res.statusCode).toBe(409);
        expect(JSON.parse(res.body)).toEqual({ message: 'Conflict' });
    });
});
