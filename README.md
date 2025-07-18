# Booking Fields UI

This is the React-based frontend for the "Booking Fields" application. It provides a modern, responsive, and internationalized user interface that allows users to register, log in, view available sports fields, and manage their bookings.

This project was developed with Vite and features a component-based architecture, global state management via Context API, and a complete setup for containerization with Docker.

## ✨ Key Features

-   **Full User Authentication**: Secure registration, login, and logout functionality.
-   **Protected Routes**: Access to booking pages is restricted to authenticated users.
-   **Field Browsing**: View a list of all available sports fields.
-   **Dynamic Booking System**:
    -   Select a date to see real-time availability.
    -   Create new bookings for one or more time slots.
    -   View, edit, and cancel existing personal bookings.
-   **Internationalization (i18n)**: Support for English, Italian, and Spanish, with language detection.
-   **Custom UI Components**: Non-blocking notifications and confirmation modals for a smooth user experience.
-   **Responsive Design**: The layout adapts seamlessly to desktop and mobile devices.

## 🌐 Live Demo

You can access the live version of the application here:

**[https://bookingfields.up.railway.app/](https://bookingfields.up.railway.app/)**

## 🛠️ Tech Stack

-   **Framework**: [React](https://reactjs.org/)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Routing**: [React Router](https://reactrouter.com/)
-   **State Management**: React Context API
-   **Internationalization**: [i18next](https://www.i18next.com/)
-   **Styling**: CSS
-   **Deployment**: Docker & Nginx

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

-   Node.js (v18 or later)
-   npm / yarn / pnpm
-   A running instance of the backend API.

### Installation

1.  **Clone the repository:**
    ```sh
    git clone <your-repository-url>
    cd 5.2_Booking_Fields_UI
    ```

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    Create a new file named `.env.local` in the root of the project and add the URL of your backend API.

    ```env
    # .env.local
    VITE_API_URL=https://api-booking-fields.up.railway.app/api
    ```

4.  **Run the development server:**
    ```sh
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

## 📦 Available Scripts

In the project directory, you can run:

-   `npm run dev`: Runs the app in development mode.
-   `npm run build`: Builds the app for production to the `dist` folder.
-   `npm run lint`: Lints the code using ESLint.
-   `npm run preview`: Serves the production build locally.

## 🐳 Dockerization

This project is configured to run in a Docker container using Nginx as a web server.

1.  **Build the Docker image:**
    ```sh
    docker build -t booking-fields-ui .
    ```

2.  **Run the Docker container:**
    ```sh
    docker run -p 8080:80 booking-fields-ui
    ```
    The application will be accessible at `http://localhost:8080`.

## 📁 Project Structure

The source code is organized as follows:

```
src/
├── assets/         # Static assets like SVGs
├── components/     # Reusable React components (Layout, BookingCard, etc.)
├── context/        # Global state management (AuthContext)
├── pages/          # Page components for each route (HomePage, LoginPage, etc.)
├── App.jsx         # Main app component with context providers
├── i18n.js         # i18next configuration
└── main.jsx        # Application entry point with React Router setup
```

## 🙏 Acknowledgements

A special thank you to the creators of the visual assets used in this project:

-   **Background Videos**: Video by Tima Miroshnichenko , Kelly from Pexels.
-   **Fields Images**: Photos by Ercan Evcimen, Mudassir Ali, Athena Sandrini from Pexels.

## 📄 License

This project is distributed under the MIT License. See `LICENSE` for more information.
