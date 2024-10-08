# [Glove Track - Travel Blog Platform](https://globe-trek-server.vercel.app)

- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup and Installation](#setup-and-installation)
- [API Endpoints](#api-endpoints)

## Project Overview

The Glove Track platform allows users to share travel stories, tips, and destination guides while enabling social engagement through upvoting, following, and commenting features. Admins can manage users, posts, and handle payment integrations for premium content. Built using Next.js, TypeScript, Tailwind CSS, and MongoDB, the platform is designed for scalability and user interaction.

## Features
* User Authentication (JWT-based)
* User Profile Management
* Create, Edit, and Delete Travel Posts
* Upvoting/Downvoting System
* Commenting System
* Payment Integration for Premium Content
* Admin Panel for User and Content Management

## Technologies Used

- **Node.js**: JavaScript runtime for server-side scripting.
- **Express.js**: Lightweight web framework for building APIs.
- **MongoDB**: NoSQL database used for storing user and post data.
- **Mongoose**: MongoDB object modeling tool for Node.js.
- **TypeScript**: Superset of JavaScript for strong typing and better developer experience.
- **JWT (JSON Web Tokens)**: Secure authentication and authorization method.
- ** Aamarpay**: Payment gateways for premium features.

## Setup and Installation

Follow these steps to set up and run the project locally:

### Installation and Running the Application

1. **Clone the Repository:**
```bash
https://github.com/binshahed/Globe-Trek-server.git
```

```
cd Globe-Trek-client
```

```
yarn add
```

.env
```
NODE_END = development
PORT= 5000
CLIENT_URL = http://localhost:3000
DATABASE_URL = ''
SALT_ROUND = 10
JWT_SECRET_KEY = ''
JWT_REFRESH_KEY = ''
JWT_ACCESS_EXPIRES_IN= 1D
JWT_REFRESH_EXPIRES_IN= 365D
CLOUDINARY_CLOUD_NAME = ''
CLOUDINARY_API_KEY = ''
CLOUDINARY_API_SECRET = ''
PAYMENT_SIGNATURE_KEY = ''
```

```
yarn start:dev
```

```
http://localhost:5000/
```