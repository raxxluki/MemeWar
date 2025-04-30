# MemeWar Canvas

A real-time collaborative meme canvas built with React, Firebase, and Web3 integration.

## Overview

MemeWar Canvas is an interactive platform where users can create, place, and share memes on a collaborative canvas. The application features:

- Real-time updates using Firebase Firestore
- Web3 wallet integration for user authentication
- Meme generation capabilities
- Team-based competition between Doge and Pepe memes
- Leaderboard tracking

## Project Structure

The project is organized as follows:

- `components/` - React components for the application
  - `Canvas.jsx` - The main collaborative canvas component
  - `Home.jsx` - Main application page with tabs for different features
  - `MemeGenerator.jsx` - Component for creating and adding memes
  - `Web3Provider.jsx` - Handles wallet connection and authentication
  - Additional utility components
- `firebase.js` - Firebase configuration and database functions
- `app.jsx` - Main application entry point
- `index.html` - HTML entry point with module imports
- `styles.css` - Application styling

## Technologies Used

- **Frontend**: React 19
- **Database**: Firebase Firestore
- **Authentication**: Web3 wallet integration via wagmi
- **Styling**: Tailwind CSS
- **Module Loading**: ES Modules via importmap

## Getting Started

### Prerequisites

- Node.js and npm
- Firebase account with Firestore database

### Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file with your Firebase configuration:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```
4. Start the development server: `npm run dev`

## Deployment

This project can be deployed to Vercel. See the [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions on how to:

1. Commit the project to GitHub
2. Deploy to Vercel
3. Configure environment variables for Firebase

## Features

- **Canvas Interaction**: Pan, zoom, and interact with memes on the canvas
- **Meme Generation**: Create memes with different templates and descriptions
- **Team Competition**: Join either Team Doge or Team Pepe
- **Leaderboard**: Track top contributors
- **Offline Support**: Basic functionality works offline with localStorage backup

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.