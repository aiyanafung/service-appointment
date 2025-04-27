# Appointment Service

A Serverless AWS Lambda + DynamoDB backend for scheduling service appointments.

## Setup
npm install

## Start Server Local 
npx osls offline start

# Deploy to AWS
npx osls deploy

## Sample curl commands to hit the endpoint
 curl -X POST \
  https://wepfj00fx5.execute-api.us-east-1.amazonaws.com/appointments \
  -H "Content-Type: application/json" \
  -H "x-api-key: mysecretkey" \
  -d '{
    "fullName": "Yazhe Feng",
    "location": "Honda Downtown",
    "appointmentTime": "2025-04-027T10:00:00Z",
    "car": "Honda Civic",
    "services": ["Brake Inspection", "Battery Check"]
  }'


# Run all tests
npm test
