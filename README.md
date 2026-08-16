# Real-Time Chat Application

![ChatApp Demo](https://img.shields.io/badge/status-development-blue)
![License](https://img.shields.io/badge/license-MIT-green)

A full-stack, real-time chat application built with the MERN stack (MongoDB, Express, React, Node.js) and Socket.IO. Features user authentication, live chat, online presence indicators, and typing notifications.

### ➡️ Live Demo
*[Talkie](https://ttalkie.netlify.app)*

---

## ✨ Features

* User Authentication Secure signup and login with JWT (JSON Web Tokens) and bcrypt password hashing.
* Real-Time Chat Instantly send and receive messages with Socket.IO.
* Online Presence See which users are currently online with a green status dot.
* Typing Indicators See when a user is actively typing a message.
* User Search Find other users in the contact list.
* Responsive Design A clean, mobile-first UI that works on all screen sizes, featuring a side drawer for mobile navigation.
* Error Handling Robust error handling with `react-hot-toast` notifications.
* Persistent Avatars User avatars are assigned based on a consistent hash of their user ID.

---

## 🔧 Tech Stack

A quick look at the major technologies used in this project.

| Frontend | Backend |
| :--- | :--- |
| React.js | Node.js |
| React Router | Express.js |
| Zustand (State Management) | MongoDB (with Mongoose) |
| Socket.IO Client | Socket.IO |
| TailwindCSS | JWT (JSON Web Token) |
| DaisyUI | bcrypt.js |
| Axios | Cookie-parser |

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

* Node.js (v18 or later)
* MongoDB A local MongoDB instance or a connection string from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
* npm or yarn

### 1. Backend Setup

First, let's get the server running.

```bash
# 1. Clone the repository
git clone [https://your-repo-url.com/chatapp.git](https://your-repo-url.com/chatapp.git)
cd chatapp

# 2. Navigate to the backend folder
cd backend

# 3. Install dependencies
npm install

# 4. Create an environment file
touch .env
