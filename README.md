# skillswap

Welcome to **skillswap**! This project is designed to help users exchange skills and connect with each other via a web platform.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Firebase Setup](#firebase-setup)
  - [Project Setup](#project-setup)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- User authentication (Firebase)
- Skill listing and searching
- Messaging/communication between users
- Real-time updates

---

## Tech Stack

- **JavaScript** (primary language)
- **Firebase** (authentication, database, hosting)
- Other dependencies (see `package.json`)

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14+ recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- A Google account for Firebase setup

---

### Firebase Setup

1. **Create a Firebase Project:**
   - Go to [Firebase Console](https://console.firebase.google.com/) and create a new project.

2. **Add a Web App:**
   - In your Firebase project, click on "Web" (`</>`) to register your app.
   - Follow the steps to register and copy the Firebase configuration (you'll need this soon).

3. **Enable Authentication:**
   - In Firebase Console, go to **Authentication** > **Sign-in method**.
   - Enable your preferred methods (e.g., Email/Password, Google, etc.).

4. **Configure Firestore Database:**
   - Go to **Firestore Database** and click "Create database".
   - Start in test mode (for development) or set up proper security rules for production.

5. **(Optional) Enable Storage:**
   - For file uploads, enable **Storage** in Firebase Console.

6. **Get Your Firebase Config:**
   - Copy the config object from the Firebase Console (looks like `apiKey`, `authDomain`, etc.).

7. **Add Config to Project:**
   - Create a file named `.env` or `firebaseConfig.js` in your project root.
   - Add your Firebase config. Example for `.env`:

     ```
     REACT_APP_FIREBASE_API_KEY=your_api_key
     REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
     REACT_APP_FIREBASE_PROJECT_ID=your_project_id
     REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
     REACT_APP_FIREBASE_APP_ID=your_app_id
     ```

   - If your project uses a config file (e.g., `firebaseConfig.js`):

     ```js
     // firebaseConfig.js
     export const firebaseConfig = {
       apiKey: "your_api_key",
       authDomain: "your_auth_domain",
       projectId: "your_project_id",
       storageBucket: "your_storage_bucket",
       messagingSenderId: "your_sender_id",
       appId: "your_app_id"
     };
     ```

---

### Project Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/vikramkumarsfe/skillswap1.git
   cd skillswap1
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Add Firebase Config:**
   - Add your Firebase config as described above.

4. **Start the development server:**

   ```bash
   npm start
   ```

   The app will be available at [http://localhost:3000](http://localhost:3000).

---

## Usage

- Register or log in using your chosen authentication provider.
- List the skills you want to offer or learn.
- Search for other users and connect with them.
- Exchange messages and arrange skill-swapping sessions.

---

## Contributing

Contributions are welcome! Please open issues or pull requests for new features, bug fixes, or improvements.

---

## License

This project is licensed under the MIT License.

---

## Contact

For any questions, please contact [vikramkumarsfe](https://github.com/vikramkumarsfe).
