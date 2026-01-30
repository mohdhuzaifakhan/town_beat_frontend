# Town Beat

**Town Beat** is a hyper-local social networking platform designed to connect citizens based on their city and region. It empowers communities to share local news, organize events, participate in civic discussions, and stay informed about what's happening in their immediate surroundings.

Built with a modern tech stack, Town Beat offers a seamless and responsive experience for users to engage with their local community.

![Home Dashboard](town%20beat%20assets/home.png)

## Features

*   **City-Centric Feed**: A personalized feed showcasing the latest posts, news, and updates from your specific city.
*   **Community Groups**: Create and join groups tailored to local interests, hobbies, or civic causes.
*   **Interactive Polls**: Participate in local polls to voice your opinion on community matters and see real-time results.
*   **Campaigns**: Organize and manage local campaigns to drive initiatives and bring about positive change.
*   **Secure Authentication**: Robust user registration and login system ensuring data privacy and security.
*   **User Profiles**: Manage your digital identity, track your activities, and connect with neighbors.
*   **Admin Dashboard**: specialized tools for administrators to manage ads and oversee platform content.

## Application Screenshots

### Authentication
Secure and user-friendly login and registration process.

| Login | Register |
| :---: | :---: |
| ![Login Page](town%20beat%20assets/login.png) | ![Register Page](town%20beat%20assets/register.png) |

### Community Engagement
Connect with your peers through various interactive modules.

| Groups | Polls |
| :---: | :---: |
| ![Groups Page](town%20beat%20assets/groups.png) | ![Polls Page](town%20beat%20assets/polls.png) |

### Initiatives & Identity
Drive change with campaigns and manage your personal profile.

| Campaigns | User Profile |
| :---: | :---: |
| ![Campaigns Page](town%20beat%20assets/compaing.png) | ![Profile Page](town%20beat%20assets/profile.png) |

## Tech Stack

### Frontend
*   **React 19**: The core library for building the user interface.
*   **Vite**: Next-generation frontend tooling for ultra-fast development.
*   **Tailwind CSS**: A utility-first CSS framework for rapid and modern UI design.
*   **Framer Motion**: Powering smooth animations and transitions.
*   **React Router DOM**: Handling client-side routing and navigation.
*   **React Query**: Managing server state and data fetching.
*   **Lucide React**: Providing a clean and consistent icon set.

### Backend
*   **NestJS**: A progressive Node.js framework for building efficient and scalable server-side applications.
*   **MongoDB & Mongoose**: NoSQL database for flexible data modeling.
*   **Passport.js**: Robust authentication middleware (JWT strategy).
*   **AWS S3**: Integration for reliable cloud storage of user uploads.
*   **Node.js**: The Javascript runtime environment.

## Getting Started

Follow these steps to set up the project locally.

### Prerequisites
*   **Node.js** (v18+ recommended)
*   **npm** or **yarn**
*   **MongoDB** (Local instance or Atlas URI)

### 1. Backend Setup

Navigate to the `backend` directory, install dependencies, and start the server.

```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
# Create a .env file based on .env.example (if available) or configure:
# MONGODB_URI=mongodb://localhost:27017/townbeat
# JWT_SECRET=your_jwt_secret
# AWS_ACCESS_KEY_ID=...
# AWS_SECRET_ACCESS_KEY=...
# AWS_REGION=...
# AWS_BUCKET_NAME=...

# Start the development server
npm run start:dev
```
The backend server will typically start on `http://localhost:3000`.

### 2. Frontend Setup

Navigate to the `frontend` directory, install dependencies, and start the development server.

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```
The application will be available at `http://localhost:5173`.

### 3. Usage
-   Open your browser and navigate to `http://localhost:5173`.
-   Register a new account or login to explore the features.
-   Navigate through the specialized tabs like **Groups**, **Polls**, and **Campaigns** to see the variety of interactions available.