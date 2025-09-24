# Z-Code

# MERN Application

This is a MERN (MongoDB, Express.js, React, Node.js) stack application.

## Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js and npm are installed. You can download them from [here](https://nodejs.org/).
- MongoDB is installed and running. You can download it from [here](https://www.mongodb.com/try/download/community).

## Installation

1. Clone the repository:
    ```bash
    https://github.com/CodeCraftITSolutions/Z-Code.git
    cd z-code
    ```

2. Install server dependencies:
    ```bash
    cd server
    npm install
    ```

3. Install client dependencies:
    ```bash
    cd ../client
    npm install
    ```

## Configuration

1. Create a `.env` file in the `server` directory and complete the following:
    ```env
    PORT=4000
    MONGO_URI=""
    ACCESS_TOKEN=""
    OAUTH_REFRESH_TOKEN=""
    OAUTH_CLIENT_SECRET=""
    OAUTH_CLIENTID=""
    MAIL_PASSWORD=""
    MAIL_USERNAME=""
    CLOUD_NAME=""
    CLOUD_KEY=""
    CLOUD_KEY_SECRET=""
    ```

2. Create a cludinary api key and complete above .env for last three variables 

## Running the Application

1. Start the backend server:
    ```bash
    cd server
    npm run dev
    ```

2. Start the frontend server:
    ```bash
    cd ../client
    npm run dev
    ```

3. Open your browser and go to `http://localhost:5173` to see the application running.

## Folder Structure

```plaintext
z-code/
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── sections/
│   │   ├── store/
│   │   ├── assets/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── index.js
│   ├── firebase.js
│   ├── .env
│   └── package.json
│
├── .gitignore
├── README.md
└── package.json
```
## Features

### Lecturer

- **Dashboard**: Overview of all activities.
- **Contest Management**:
  - View active and upcoming contests.
  - Create new contests.
- **Question Bank**:
  - Add, edit, view, and delete personal questions.
  - View other lecturers' questions (without edit permissions).
- **Profile Management**:
  - Edit name, email, and avatar.

### Student

- **Dashboard**: Overview of all activities.
- **Contests**:
  - **Available Contests**: View upcoming contests.
  - **Completed Contests**: View completed contests with grades and leaderboard.
- **Practice**:
  - Practice coding problems filtered by difficulty, category, and grade.
- **Profile Management**:
  - Edit name, email, and avatar.

### Admin

- **Dashboard**: Overview of all activities.
- **Lecturer Management**:
  - Change lecturer status (active/inactive).
  - View and remove lecturer details.
- **Student Management**:
  - View and remove student details.
- **Profile Management**:
  - Edit name, email, and avatar.

### Additional Features

- **Automated Grading**: Automatically grade programming assignments based on predefined test cases.
- **Real-Time Notifications**: Receive instant notifications for important events.
- **Google Signup/Login**: Seamless authentication with Google.
- **Email Notifications**: Automatic email notifications for important events.
- **Cloudinary Integration**: Store and manage user-submitted files using Cloudinary.