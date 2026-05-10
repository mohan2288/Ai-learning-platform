# AI Learning Platform

An AI-powered learning platform for students and trainers.

## Features

- Authentication
- Protected Routes
- AI Chat Assistant
- AI MCQ Generator
- Progress Tracking
- Course Management
- Responsive UI

## Tech Stack

### Frontend
- React
- React Router
- Tailwind CSS

### Backend
- Node.js
- Express.js

### Database
- MongoDB Atlas

### AI
- Gemini API

## Installation

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm run dev
```

## Environment Variables

Create `.env` inside backend:

```env
PORT=5000
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret
GEMINI_API_KEY=your_key
```

## API Endpoints

### Auth

- POST `/api/auth/register`
- POST `/api/auth/login`

### AI

- GET `/api/ai/test`

## Folder Structure

### Frontend

```bash
src/
 ├── components/
 ├── pages/
 ├── services/
 ├── hooks/
 ├── layouts/
 ├── context/
 ├── routes/
 └── utils/
```

### Backend

```bash
server/
 ├── routes/
 ├── controllers/
 ├── middleware/
 ├── services/
 ├── models/
 └── utils/
```

## Author

Mohan