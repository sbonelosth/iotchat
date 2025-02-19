# AI-Powered Assistant for Students

## Overview
This is a web-based chat application designed to facilitate conversations between students and an **AI-powered assistant** for a designated institution. For testing purposes, the app is currently able to only cater for the Internet of Things (IoT) programme offered in Durban University of Technology. The app provides a user-friendly interface for users to ask questions and receive responses, with support for file attachments and different chat scopes.

## Components
### `App.tsx`
The main entry point of the application. It wraps the entire app with `AuthProvider` and `ChatProvider` to provide authentication and chat context.

### `components/AppBar.tsx`
Displays the top navigation bar with the app title and context label. It also includes a button to clear all messages.

### `components/InputArea.tsx`
Provides the input area for users to type their messages, select chat context, and attach files. It handles form submission and file validation.

### `components/MessageItem.tsx`
Renders individual messages in the chat, including user messages and AI responses. It supports actions like retrying, editing, liking, disliking, and copying messages.

### `components/MessageList.tsx`
Displays the list of messages in the chat. It handles scrolling and ensures the latest message is always visible.

### `components/Toast.tsx`
Shows temporary notifications to the user, such as when a message is copied to the clipboard.

## Contexts
### `contexts/AuthContext.tsx`
Provides authentication context, including user information and viewport height. It handles window resize events to update the viewport height.

### `contexts/ChatContext.tsx`
Manages the chat context, including the current chat scope, messages, input state, and loading state. It handles sending questions, retrying messages, editing messages, and clearing messages.

## Views
### `views/Chat.tsx`
The main chat view that combines the `AppBar`, `MessageList`, and `InputArea` components. It uses the chat context to manage the state and actions.

## Configuration
### Prerequisites
- Node.js (version 14 or higher)
- npm (version 6 or higher)

### Installation
1. Clone the repository:
    ```sh
    git clone https://github.com/sbonelosth/iotchat.git
    cd iotchat

2. Install dependencies:
    ```sh
    npm install

### Running the App

1. Start the development server
    ```sh
    npm run dev

2. Open your browser and navigate to `http://localhost:3000`

### Building the App

To build the app for production, run:
    ```sh
    npm run build

To lint the code, run:
    ```sh
    npm run lint

To preview the build, run:
    ```sh
    npm run preview

### Future Developments
- **Authentication:** Implement user authentication to secure the chat and provide personalized experiences.
- **Routing:** Add routing to navigate between different pages or sections of the app.
- **Theme Picker:** Introduce a theme picker to allow users to switch between different themes.
- **Session Management:** Implement session management to maintain user state across different sessions.

### License
This project is licensed under the MIT License.