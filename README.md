# CollabSpace

A collaborative platform built with a modern full-stack JavaScript architecture. This project features a Node.js Express backend with MongoDB integration and a React frontend powered by Vite.

## 🚀 Project Structure

```
CollabSpace/
├── backend/          # Node.js Express server
├── frontend/         # React + Vite application
└── README.md
```

## 📋 Prerequisites

Before running this project, ensure you have installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB** - [Install locally](https://docs.mongodb.com/manual/installation/) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

## 🔧 Environment Variables

Create `.env` files in both `backend` and `frontend` directories with the required configuration:

### Backend `.env`
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret
GROQ_API_KEY=your_groq_api_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_password
```

### Frontend `.env`
```
VITE_BACKEND_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_STREAM_API_KEY=your_stream_api_key
```

## 📦 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/NiteshKumavat/CollabSpace.git
cd CollabSpace
```

### Step 2: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 3: Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

## 🏃 Running the Project

### Option 1: Run Backend and Frontend Separately

#### Terminal 1 - Start Backend Server

```bash
cd backend
npm run dev
```

The backend will start on `http://localhost:5000` (or the port specified in your `.env`)

#### Terminal 2 - Start Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will typically start on `http://localhost:5173`


## 🛠️ Available Scripts

### Backend

```bash
npm run dev      # Start backend with nodemon (auto-reload on file changes)
```

### Frontend

```bash
npm run dev      # Start development server with Vite

```

## 📚 Technology Stack

### Backend
- **Framework**: Express.js 5.1
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT, Google OAuth, bcryptjs
- **Real-time**: Socket.io
- **Video**: Stream.io SDK
- **AI**: Groq SDK
- **File Upload**: Cloudinary
- **Email**: Nodemailer

### Frontend
- **Library**: React 19
- **Build Tool**: Vite
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query
- **UI Components**: DaisyUI
- **Styling**: Tailwind CSS
- **Icons**: Lucide React, React Icons
- **Real-time**: Socket.io Client
- **Video**: Stream.io Video React SDK
- **Notifications**: React Hot Toast

## 🔐 Authentication

The project supports:
- Email/Password authentication with bcryptjs hashing
- Google OAuth integration
- JWT token-based session management

## 🎬 Video Features

- Real-time video conferencing powered by Stream.io
- Screen sharing capabilities
- Video call management

## 📧 Email Configuration

To enable email features (notifications, password reset, etc.), configure your email provider in the backend `.env` file. The project uses Nodemailer.


## 🐛 Troubleshooting

**Backend won't start:**
- Ensure MongoDB is running
- Check if port 5000 is available
- Verify all environment variables are set

**Frontend won't load:**
- Clear browser cache
- Delete `node_modules` and reinstall: `npm install`
- Ensure backend is running

**WebSocket connection issues:**
- Check CORS configuration in backend
- Verify Socket.io URL in frontend matches backend

## 📝 Additional Notes

- Use `nodemon` in the backend for automatic server restarts during development
- The frontend uses Vite for faster development experience
- Ensure all API endpoints in the frontend point to the correct backend URL


## 👤 Author

Nitesh Kumavat
