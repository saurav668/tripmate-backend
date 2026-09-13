import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/notifications',
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth?.token;

      if (!token) {
        client.disconnect();
        return;
      }

      const payload =
        await this.jwtService.verifyAsync(token, {
          secret: process.env.JWT_ACCESS_SECRET,
        });

      const userId = payload.sub;

      if (!userId) {
        client.disconnect();
        return;
      }

      client.data.userId = userId;

      await client.join(`user:${userId}`);

      console.log(
        `User ${userId} connected`,
      );
    } catch (error) {
      console.log(
        'Socket authentication failed',
      );

      client.disconnect();
    }
  }

    sendNotification(
        userId: string,
        notification: any,
    ) {
        this.server
            .to(`user:${userId}`)
            .emit(
                'notification',
                notification,
            );
    }

  handleDisconnect(client: Socket) {
    console.log(
      `User ${client.data.userId} disconnected`,
    );
  }
}