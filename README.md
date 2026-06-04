# AI Resume Analyzer (CVAI) - Full Stack MERN Platform

CVAI is a modern, production-ready SaaS application designed to help job seekers optimize their resumes using AI. Users upload their resume PDFs, paste an optional target job description, and receive detailed recruitment auditing metrics: an Overall ATS Score, dynamic strengths/weaknesses assessment, keyword gaps, and actionable improvement recommendations, powered by **Claude AI (Sonnet 3.5)**.

---

## 🎯 Features

1. **Secure JWT Authentication**: Register and login with secure password hashing via `bcryptjs`.
2. **PDF Resume Parser**: Extract and clean raw text from PDF files using `pdf-parse`.
3. **Cloud Storage**: PDF resumes are uploaded and hosted securely as CDN assets via **Cloudinary**.
4. **Claude AI Evaluation**: Comprehensive prompt analysis using `claude-sonnet-4-20250514`.
5. **Interactive Dashboard**: Track average scoring histories, view matching statistics, and examine past reports.
6. **Premium Glassmorphic UI**: High-fidelity Tailwind CSS layout featuring responsive styling, animated score circular gauges, and elegant transitions.

---

## 📁 Repository Structure

```
AI resume analyser/
├── client/                  # React + Vite + Tailwind CSS Frontend
│   ├── src/
│   │   ├── components/      # Reusable UI modules (Navbar, UploadForm, result panels)
│   │   ├── pages/           # Pages (Home, Login, Register, Dashboard, Report detail)
│   │   ├── context/         # React AuthContext Provider
│   │   └── utils/           # Axios global client instance
│   ├── package.json
│   └── vite.config.js
│
├── server/                  # Node.js + Express.js MVC Backend
│   ├── config/              # Services configurations (Mongoose MongoDB, Cloudinary API)
│   ├── controllers/         # Request handlers (Authentication, Resume analysis)
│   ├── middleware/          # Express Middlewares (JWT verification, Multer parser, Errors)
│   ├── models/              # Mongoose DB Schemas (User, Analysis log)
│   ├── routes/              # Express Endpoints mapping
│   ├── utils/               # AI prompts, PDF parsing, token signers
│   ├── package.json
│   └── server.js
│
└── README.md                # Project documentation and API manuals
```

---

## ⚙️ Environment Configurations

Create a `.env` file in both directories according to these templates:

### Backend Configuration (`server/.env`)

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/resume_analyzer?retryWrites=true&w=majority
JWT_SECRET=supersecretjwtsecretkeychangeinproduction
CLAUDE_API_KEY=your_anthropic_claude_api_key_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLIENT_URL=http://localhost:5173
```

### Frontend Configuration (`client/.env`)

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Local Run Instructions

Follow these commands to boot CVAI on your local machine:

### 1. Launch the Backend Server

```bash
cd server
npm install
npm run start
```
*The API will start listening at `http://localhost:5000`.*

### 2. Launch the Frontend React Client

```bash
cd client
npm install
npm run dev
```
*The Vite development server will open at `http://localhost:5173`.*

---

## 🧪 Postman & API Testing Guide

Use the following endpoints and sample payloads to validate CVAI's operations:

### 🔐 1. Authentication APIs

#### 📥 A. User Registration
* **Method**: `POST`
* **URL**: `http://localhost:5000/api/auth/register`
* **Headers**: `Content-Type: application/json`
* **Request Body**:
```json
{
  "name": "Alex Mercer",
  "email": "alex.mercer@gmail.com",
  "password": "securepassword123"
}
```
* **Sample Response (201 Created)**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "664fa4c88b...",
    "name": "Alex Mercer",
    "email": "alex.mercer@gmail.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 🔑 B. User Login
* **Method**: `POST`
* **URL**: `http://localhost:5000/api/auth/login`
* **Headers**: `Content-Type: application/json`
* **Request Body**:
```json
{
  "email": "alex.mercer@gmail.com",
  "password": "securepassword123"
}
```
* **Sample Response (200 OK)**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "_id": "664fa4c88b...",
    "name": "Alex Mercer",
    "email": "alex.mercer@gmail.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 👤 C. Fetch Logged-in Profile (Protected Route)
* **Method**: `GET`
* **URL**: `http://localhost:5000/api/auth/me`
* **Headers**: 
  * `Authorization: Bearer <your_jwt_token_here>`
* **Sample Response (200 OK)**:
```json
{
  "success": true,
  "message": "User profile retrieved",
  "data": {
    "_id": "664fa4c88b...",
    "name": "Alex Mercer",
    "email": "alex.mercer@gmail.com"
  }
}
```

---

### 📄 2. Resume Assessment APIs

*Note: All Resume endpoints are protected and require the `Authorization: Bearer <your_jwt_token_here>` header.*

#### 📤 A. Upload and Analyze Resume
* **Method**: `POST`
* **URL**: `http://localhost:5000/api/resume/upload`
* **Headers**: 
  * `Authorization: Bearer <your_jwt_token_here>`
  * `Content-Type: multipart/form-data`
* **Request Body (form-data)**:
  * `resume`: [Select PDF file]
  * `jobDescription`: [Optional string, e.g., "Looking for a React developer with TypeScript and Docker experience..."]
* **Sample Response (201 Created)**:
```json
{
  "success": true,
  "message": "Resume analyzed successfully",
  "data": {
    "_id": "664fac09e3...",
    "user": "664fa4c88b...",
    "resumeUrl": "https://res.cloudinary.com/yourcloud/raw/upload/v1/ai_resumes/resume_1716480009.pdf",
    "score": 85,
    "strengths": [
      "Excellent React architecture knowledge",
      "Clean semantic state management experience"
    ],
    "weaknesses": [
      "Lack of backend database projects mentioned on the CV"
    ],
    "skillGaps": [
      "Docker",
      "TypeScript"
    ],
    "suggestions": [
      "Add measurable achievements with quantifiable metrics",
      "Include a project incorporating TypeScript and containers"
    ],
    "jobMatchPercentage": 72,
    "jobDescription": "Looking for a React developer with TypeScript and Docker experience...",
    "createdAt": "2026-05-23T14:40:09Z",
    "updatedAt": "2026-05-23T14:40:09Z"
  }
}
```

#### 📜 B. Get User Analysis History
* **Method**: `GET`
* **URL**: `http://localhost:5000/api/resume/history`
* **Headers**:
  * `Authorization: Bearer <your_jwt_token_here>`
* **Sample Response (200 OK)**:
```json
{
  "success": true,
  "message": "Analysis history retrieved successfully",
  "data": [
    {
      "_id": "664fac09e3...",
      "score": 85,
      "jobMatchPercentage": 72,
      "jobDescription": "Looking for a React developer with TypeScript and Docker experience...",
      "createdAt": "2026-05-23T14:40:09Z"
    }
  ]
}
```

#### 🔍 C. Get Specific Analysis details
* **Method**: `GET`
* **URL**: `http://localhost:5000/api/resume/664fac09e3...`
* **Headers**:
  * `Authorization: Bearer <your_jwt_token_here>`
* **Sample Response (200 OK)**:
```json
{
  "success": true,
  "message": "Analysis report retrieved successfully",
  "data": {
    "_id": "664fac09e3...",
    "score": 85,
    "strengths": [...],
    "weaknesses": [...],
    "skillGaps": [...],
    "suggestions": [...],
    "jobMatchPercentage": 72,
    "jobDescription": "Looking for a React developer...",
    "resumeUrl": "https://res.cloudinary.com/..."
  }
}
```

---

## ☁️ Production Deployment Guide

Deploy CVAI to secure hosting providers in a few steps:

### 1. MongoDB Atlas Setup
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database).
2. Go to **Network Access** and whitelist `0.0.0.0/32` (or allow access from anywhere for cloud servers).
3. Under **Database Access**, create a user with read/write privileges.
4. Copy the connection string (Mongoose connection URI) for your environment configurations.

### 2. Cloudinary Setup
1. Register on [Cloudinary](https://cloudinary.com/) for free.
2. In your Cloudinary console dashboard, retrieve your:
   * **Cloud Name**
   * **API Key**
   * **API Secret**
3. Configure these inside your environment parameters to ensure PDF uploads are processed correctly.

### 3. Backend Deployment (Render)
1. Register or sign in to [Render](https://render.com/).
2. Create a new **Web Service** and link it to your GitHub Repository.
3. Configure the following parameters:
   * **Root Directory**: `server`
   * **Build Command**: `npm install`
   * **Start Command**: `node server.js`
4. Under **Advanced -> Environment Variables**, add your backend `.env` keys.
5. Launch the service. Render will provide you with a backend URL (e.g. `https://cvai-api.onrender.com`).

### 4. Frontend Deployment (Vercel)
1. Sign in to [Vercel](https://vercel.com/).
2. Click **Add New -> Project** and link your CVAI repository.
3. Configure the following settings:
   * **Root Directory**: `client`
   * **Framework Preset**: `Vite`
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
4. Under **Environment Variables**, add:
   * `VITE_API_URL`: Set this to your newly deployed Render API URL (e.g., `https://cvai-api.onrender.com`).
5. Click **Deploy**. Vercel will build and serve your static asset pipeline globally.
