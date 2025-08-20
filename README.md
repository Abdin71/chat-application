# NestJS Real-Time Chat Application

A real-time chat application built with NestJS and WebSocket technology, enabling instant messaging and user presence tracking.

## Features

- 🚀 Real-time messaging using WebSockets
- 👥 User join/leave notifications
- 👀 Active users list
- ⌚ Message timestamps
- 🎨 Clean and responsive UI
- ⚡ Instant message delivery
- 🔒 CORS enabled

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:

```bash
git clone <your-repository-url>
cd nestjs-weather-app
```

1. Install dependencies:

```bash
npm install
```

## Running the Application

### Development Mode

To run the application in development mode with hot-reload:

```bash
npm run start:dev
```

### Production Mode

To build and run the application in production mode:

```bash
npm run build
npm run start:prod
```

The application will be available at `http://localhost:3000`

## Testing

### Running Unit Tests

```bash
npm run test
```

### Running E2E Tests

```bash
npm run test:e2e
```

### Test Coverage

```bash
npm run test:cov
```

## Project Structure

```plaintext
src/
├── chat/
│   ├── chat.gateway.ts     # WebSocket gateway implementation
│   ├── chat.gateway.spec.ts # Gateway unit tests
│   └── chat.module.ts      # Chat module definition
├── app.module.ts           # Main application module
├── app.controller.ts       # Main application controller
├── app.service.ts         # Main application service
└── main.ts               # Application entry point
public/
└── index.html           # Frontend chat interface
```

## WebSocket Events

### Client to Server Events

- `join`: Emitted when a user joins the chat

```typescript
socket.emit('join', username);
```

- `message`: Emitted when a user sends a message

```typescript
socket.emit('message', messageText);
```

### Server to Client Events

- `users`: Emitted when the active users list changes

```typescript
// Returns array of usernames
socket.on('users', (users: string[]) => {});
```

- `userJoined`: Emitted when a new user joins

```typescript
socket.on('userJoined', (username: string) => {});
```

- `userLeft`: Emitted when a user leaves

```typescript
socket.on('userLeft', (username: string) => {});
```

- `message`: Emitted when a message is received

```typescript
socket.on('message', (data: {
  username: string,
  message: string,
  timestamp: string
}) => {});
```

## Frontend Interface

The application provides a simple and intuitive web interface with:

- Username input for joining the chat
- Real-time message display with timestamps
- Active users list
- Message input with Enter key support
- System notifications for user join/leave events

## Future Enhancements

- [ ] User authentication
- [ ] Message persistence with database
- [ ] Private messaging
- [ ] Typing indicators
- [ ] Chat rooms
- [ ] File sharing
- [ ] User avatars
- [ ] Message reactions

## Contributing

1. Fork the repository

1. Create your feature branch:

```bash
git checkout -b feature/amazing-feature
```

1. Commit your changes:

```bash
git commit -m 'Add some amazing feature'
```

1. Push to the branch:

```bash
git push origin feature/amazing-feature
```

1. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- NestJS team for the excellent framework
- Socket.IO team for the WebSocket implementation
