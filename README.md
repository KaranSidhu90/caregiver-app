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

1. Download and Extract the Zip file:
2. Open a terminal window and navigate to the `caregiver-app` directory.

### Backend Setup

1. Open a new terminal window and navigate to the `server` directory.

   ```bash
   cd server
   ```

2. Install the dependencies:
   Install all the required npm packages:

   ```bash
   npm install
   ```

3. Start the server:

   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the `caregiver` directory.

   ```bash
   cd caregiver
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Fetch local machine's IP address, by running the following command in the terminal:

   ```bash
   ipconfig
   ```

4. Copy the IPv4 Address and replace the `BASE_URL` in the `caregiver/config/apiEndpoint.ts` file with the copied IP address. 
   ```bash
   IPv4 Address. . . . . . . . . . . : xxx.xxx.xxx.xxx
   ```

   ```typescript
   export const BASE_URL = 'http://<IPv4 Address>:5000';
   ```


5. Start the Metro server: Start the Metro Bundler, which serves your React Native app.

   ```bash
   npx expo start -c
   ```

6. Run the app: Run the app on an emulator or a physical device.

## Login Credentials

Senior Credentials:
 - **Phone Number**: +1 (306) 581 6969
 - **Passcode**: 1234

Caregiver Credentials:
   - **Phone Number**: +1 (306) 500 1234
   - **Passcode**: 1234

## Summary

1. Install Prerequisites: Ensure you have Node.js, npm, and React Native CLI installed.
2. Download Zip: Download and extract the zip file.
3. Install Dependencies: Navigate to the project directory and run npm install for the server and frontend app.
4. Start Server: Run npm start in the server directory.
5. Update Base URL: Update the BASE_URL in the caregiver/config/apiEndpoint.ts file with your local machine's IP address.
6. Start Metro Server: Run npx expo start -c to start the Metro server.
7. Login: Use the provided credentials to log in and explore the app.