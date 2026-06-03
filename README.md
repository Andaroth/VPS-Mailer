# VPS Mail Server

A Node.js Express server for handling email form submissions.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` file in the root directory to `.env` and edit variables

## Running the Server

```bash
node mail.js
```

## API Endpoints

### Health Check
- **GET** `/api/v1/status`
- Returns server status

### Send Email
- **POST** `/api/v1/sendMail`
- body:
```json
{
  "subject": "Title"
  "message": "Example message",
  "mailto": "destination@email.com",
}
```
