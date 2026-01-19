# Jewellery E-Commerce Backend

This project is a backend API for a jewellery e-commerce application.  
It focuses on authentication, clean architecture, secure configuration handling, and scalable backend practices.

---

## Features Implemented

- User authentication module
  - User signup with OTP verification
  - Secure login flow
- Session / token-based authentication
- Modular folder structure
- Environment-based configuration

---

## Tech Stack

- Backend: Node.js, Express.js
- Database: MongoDB (Mongoose)
- Validation: Zod
- Authentication: OTP-based verification
- Cloud Storage: Cloudinary / AWS S3 / Cloudflare R2
- Version Control: Git (Conventional Commits)

---

## Project Structure
src/
├── controllers/
├── routes/
├── models/
├── validators/
├── middlewares/
├── utils/
├── config/
├── app.js
└── server.js


---

## Environment Configuration

Environment variables are managed using a `.env` file.  
A sample file `.env.example` is provided.


---

## Installation & Running the Project

```bash
# Clone repository
git clone <repository-url>

# Move into project folder
cd jewellery-backend

# Install dependencies
npm install

# Run development server
npm start

## API Validation

All request bodies and query parameters are validated using Joi / Zod

Validation logic is separated from controllers

Standard error responses are returned for invalid requests

## Git Workflow

main branch is kept stable

New features are developed using feature branches

All changes are merged via Pull Requests

Commit messages follow Conventional Commits format

##  Commit Example

feat(auth): implement otp verification
fix(user): handle invalid login credentials


##  Image Storage

Images are uploaded to cloud storage (Cloudinary)

Only image URLs are stored in the database

This improves scalability and performance

## Author

Najeeb LKD
Backend Developer | MERN Stack Learner

## License

This project is intended for learning and development purposes.







