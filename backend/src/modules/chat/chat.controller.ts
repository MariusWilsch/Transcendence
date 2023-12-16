// chat.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('private-message')
  async sendPrivateMessage(@Body() data: { sender: string; recipient: string; message: string }): Promise<void> {
    const { sender, recipient, message } = data;
    await this.chatService.sendPrivateMessage(sender, recipient, message);
  }
}
