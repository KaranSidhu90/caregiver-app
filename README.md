# Setting Up the Caregiver App

Welcome to the Caregiver App setup guide. This document will walk you through the steps to set up and run the Caregiver App on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (latest LTS version is recommended)
- **npm** (comes with Node.js)
- **React Native CLI** 

To install React Native CLI, run:

```bash
npm install -g react-native-cli
```

## Setup Instructions

1. Clone the repository to your local machine:

```bash
git clone https://github.com/your-username/caregiver-app.git
cd caregiver-app
```

2. Install the dependencies:
   Install all the required npm packages:

```bash
npm install
```

3. Start the Metro server: Start the Metro Bundler, which serves your React Native app.

```bash
npm start -- --reset-cache
```

## Mocking the Backend

Currently, the backend for this app is not functional. Instead, we are using an API Mocking tool to mock data for the app.

Login Credentials:
 - **Phone Number**: +1 123-123-1234
 - **Passcode**: 1234

## Summary

1. Install Prerequisites: Ensure you have Node.js, npm, and React Native CLI installed.
2. Clone Repository: Clone the project repository.
3. Install Dependencies: Navigate to the project directory and run npm install.
4. Start Metro Bundler: Run npm start -- --reset-cache.
5. Run the App: Use npx react-native run-android, npx react-native run-ios, or npm run web to run the app on a device/emulator or the web.
6. Login: Use the provided credentials to log in and explore the app.