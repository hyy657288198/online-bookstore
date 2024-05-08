<<<<<<< HEAD
This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

# Website Deployment Guide

This guide provides instructions for deploying the components of our web application: the frontend, backend, and database. Our application is structured into these three main parts, each with its specific deployment process.

## Website Structure
- **Frontend**: User interface and client-side logic.
- **Backend**: Server-side logic and API.
- **Database**: Data storage and management.

## Database Deployment (Neon Cloud with PostgreSQL)
We utilize a third-party cloud provider, Neon, for our database solution, employing PostgreSQL format. The database is deployed to the cloud for scalability and ease of management.

### Steps:
1. **Create a Neon Cloud Account**: Sign up for a Neon account and set up your PostgreSQL database.
2. **Database Configuration**: Configure the database settings according to your application requirements.
3. **Cloud Deployment**: Deploy the database to Neon Cloud.

## Backend Deployment (Node.js on Google App Engine)
Our backend, written in Node.js, connects with the database and is deployed using Google App Engine.

### Pre-requisites:
- Google Cloud SDK
- Node.js

### Steps:
1. **Google Cloud SDK Setup**: Install and initialize the Google Cloud SDK on your local machine.
2. **App Engine Configuration**: Add the `app.yaml` file to the root directory of the backend service.
3. **Deployment Command**: In the root directory of the backend service, run the following command:  

```bash
gcloud app deploy
```
4. **Service Verification**: Verify that the backend service is running correctly on Google App Engine.

## Frontend Deployment
The frontend is deployed similarly to the backend, as a separate service under the same Google App Engine project (`book project`).

### Steps:
1. **Setup**: Ensure the frontend codebase is ready for deployment.
2. **Deployment Command**: In the root directory of the frontend service, run:  
```bash
gcloud app deploy
```

3. **Service Verification**: Check that the frontend service is up and running.

## Domain Configuration
Each service (frontend and backend) has its own domain name. Ensure that these are properly configured and that the frontend and backend can communicate with each other through their respective URLs.



Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
=======
[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/CayJ584t)
>>>>>>> 2d7c4a630abc3b2d44b486ea9bed6b04237368b5
