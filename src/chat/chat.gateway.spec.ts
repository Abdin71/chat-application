import { Test, TestingModule } from '@nestjs/testing';
import { ChatGateway } from './chat.gateway';
import { Socket } from 'socket.io';
import { Server } from 'socket.io';

interface MessageData {
  username?: string;
  message: string;
  timestamp: string;
}

interface MockServer {
  emit: jest.Mock<void, [string, MessageData]>;
}

describe('ChatGateway', () => {
  let gateway: ChatGateway;
  let mockServer: MockServer;

  beforeEach(async () => {
    mockServer = {
      emit: jest.fn<void, [string, MessageData]>(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatGateway],
    }).compile();

    gateway = module.get<ChatGateway>(ChatGateway);
    gateway.server = mockServer as unknown as Server;
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('handleConnection', () => {
    it('should log when client connects', () => {
      const mockClient = {
        id: 'test-client-id',
      } as Socket;

      const consoleSpy = jest.spyOn(console, 'log');

      gateway.handleConnection(mockClient);

      expect(consoleSpy).toHaveBeenCalledWith(
        `Client connected: ${mockClient.id}`,
      );
    });
  });

  describe('handleDisconnect', () => {
    it('should remove user and emit updates when client disconnects', () => {
      const mockClient = {
        id: 'test-client-id',
      } as Socket;

      // Add a user first
      gateway['users'].set(mockClient.id, 'testUser');

      gateway.handleDisconnect(mockClient);

      expect(gateway['users'].has(mockClient.id)).toBeFalsy();
      expect(mockServer.emit).toHaveBeenCalledWith('users', []);
      expect(mockServer.emit).toHaveBeenCalledWith('userLeft', 'testUser');
    });

    it('should not emit events if user was not found', () => {
      const mockClient = {
        id: 'nonexistent-client',
      } as Socket;

      gateway.handleDisconnect(mockClient);

      expect(mockServer.emit).not.toHaveBeenCalled();
    });
  });

  describe('handleJoin', () => {
    it('should add user and emit updates when user joins', () => {
      const mockClient = {
        id: 'test-client-id',
      } as Socket;
      const username = 'testUser';

      const result = gateway.handleJoin(mockClient, username);

      expect(gateway['users'].get(mockClient.id)).toBe(username);
      expect(mockServer.emit).toHaveBeenCalledWith('users', [username]);
      expect(mockServer.emit).toHaveBeenCalledWith('userJoined', username);
      expect(result).toEqual({
        event: 'join',
        data: `${username} joined the chat`,
      });
    });
  });

  describe('handleMessage', () => {
    it('should broadcast message with user info', () => {
      const mockClient = {
        id: 'test-client-id',
      } as Socket;
      const username = 'testUser';
      const message = 'Hello, World!';

      // Add user first
      gateway['users'].set(mockClient.id, username);

      gateway.handleMessage(mockClient, message);

      expect(mockServer.emit).toHaveBeenCalledWith(
        'message',
        expect.objectContaining({
          username,
          message,
        }),
      );

      const messageArg = mockServer.emit.mock.lastCall?.[1] || {};
      expect(typeof messageArg.timestamp).toBe('string');
    });

    it('should not broadcast message if user is not found', () => {
      const mockClient = {
        id: 'nonexistent-client',
      } as Socket;
      const message = 'Hello, World!';

      gateway.handleMessage(mockClient, message);

      expect(mockServer.emit).toHaveBeenCalledWith(
        'message',
        expect.objectContaining({
          username: undefined,
          message,
        }),
      );

      const messageArg = mockServer.emit.mock.lastCall?.[1] || {};
      expect(typeof messageArg.timestamp).toBe('string');
    });
  });
});
