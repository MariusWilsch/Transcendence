// chat.controller.ts
import { Controller, Post, Body, Get, Res,Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Room , User, Message } from './dto/chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  async getAllRooms(@Res() res:any): Promise<Room | undefined>{
    const data = await this.chatService.getAllPrivateRooms();
    res.json(data);
    console.log(data);
    return data;
  }
  @Get(':id/privateRooms')
  async getPrivateRoomsByUser(@Param(':id') id:string , @Res() res:any)
  {
    // const data = await this.chatService.getPr
  }
  @Get(':id')
  async getRoom(@Param('id') id: string, @Res() res:any) :Promise<void>{
    const data = await this.chatService.getPrivateRoom(id);
    res.json({success:true, data});
    return data;
  }
  @Get(':id/messages')
  async getRoomMessages(@Param('id') id: string, @Res() res:any) :Promise<void>{
    console.log('id');
    const data = await this.chatService.getPrivateRoomMessages(id);
    res.json(data);
    return data;
  }
  // @Get(':id/message')
  // async getMessages(@Param('id') id: string, @Res() res:any) : Promise<void>{
  //   const data = await this.chatService.getMessagesByUser(id);
  //   res.json(data)
  //   return data;
  //  }
  @Post('private-message')
  async sendPrivateMessage(@Body() data: { sender: string; recipient: string; message: string }): Promise<void> {
    const { sender, recipient, message } = data;
    await this.chatService.sendPrivateMessage(sender, recipient, message);
  }
}
