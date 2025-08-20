# NestJS Real-Time Chat Application

A WebSocket-based real-time chat application implemented with NestJS framework.

## Overview

- Real-time messaging with WebSocket
- User presence tracking and notifications
- Message timestamps and active users list
- CORS-enabled secure communication

## Quick Start

Requirements:

- Node.js (v14+)
- npm (v6+)

```bash
git clone https://github.com/Abdin71/chat-application
cd chat-application
npm install
npm run start:dev     # Development
npm run start:prod    # Production
```

Server runs at `http://localhost:3000`

## Events Reference

From Client:

- `join(username: string)`: Join chat
- `message(text: string)`: Send message

From Server:

- `users(string[])`: Active users
- `userJoined(string)`: User joined
- `userLeft(string)`: User left
- `message(object)`: New message received

## Architecture

```plaintext
src/
├── chat/           # WebSocket implementation
├── app.module.ts   # Main module
└── main.ts        # Entry point
```

## License

MIT - See [LICENSE](LICENSE)