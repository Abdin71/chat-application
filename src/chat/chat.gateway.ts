import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatMessage } from './interfaces/message.interface';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private users: Map<string, string> = new Map();

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    const username = this.users.get(client.id);
    if (username) {
      this.users.delete(client.id);
      this.server.emit('users', Array.from(this.users.values()));
      this.server.emit('userLeft', username);
      console.log(`Client disconnected: ${client.id} (${username})`);
    }
  }

  @SubscribeMessage('join')
  handleJoin(client: Socket, username: string) {
    this.users.set(client.id, username);
    this.server.emit('users', Array.from(this.users.values()));
    this.server.emit('userJoined', username);
    return { event: 'join', data: `${username} joined the chat` };
  }

  private getUserSocketId(username: string): string | undefined {
    for (const [socketId, name] of this.users.entries()) {
      if (name === username) {
        return socketId;
      }
    }
    return undefined;
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, message: string) {
    const username = this.users.get(client.id);
    if (!username) return; // Handle case where user is not found

    const privateMessageRegex = /^@(\w+)\s+(.+)$/;
    const match = message.match(privateMessageRegex);

    if (match) {
      // Handle private message
      const [, targetUsername, privateMessage] = match;
      const targetSocketId = this.getUserSocketId(targetUsername);

      if (targetSocketId) {
        // Create private message
        const chatMessage: ChatMessage = {
          username,
          message: privateMessage,
          timestamp: new Date().toISOString(),
          type: 'private',
          to: targetUsername
        };

        // Send to sender and recipient only
        client.emit('message', chatMessage);
        this.server.to(targetSocketId).emit('message', chatMessage);
      } else {
        // Notify sender that user was not found
        client.emit('message', {
          username: 'System',
          message: `User ${targetUsername} not found.`,
          timestamp: new Date().toISOString(),
          type: 'system'
        });
      }
    } else {
      // Handle public message
      const chatMessage: ChatMessage = {
        username,
        message,
        timestamp: new Date().toISOString(),
        type: 'public'
      };
      this.server.emit('message', chatMessage);
    }
  }
}
