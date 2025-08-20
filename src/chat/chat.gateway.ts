import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

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

  @SubscribeMessage('message')
  handleMessage(client: Socket, message: string) {
    const username = this.users.get(client.id);
    this.server.emit('message', {
      username,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
