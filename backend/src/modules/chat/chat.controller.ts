// chat.controller.ts
import { Controller, Post, Body, Get, Res,Param, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Room , User, Message, Channel } from './dto/chat.dto';
import { JwtAuthGuard } from 'modules/auth/jwt-auth.guard';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllRooms(@Res() res:any): Promise<Room | undefined>{
    const data = await this.chatService.getAllPrivateRooms();
    res.json(data);
    console.log(data);
    return data;
  }
  @Get(':id/privateRooms')
  @UseGuards(JwtAuthGuard)
  async getPrivateRoomsByUser(@Param('id') id:string , @Res() res:any)
  {
    const data = await this.chatService.getPrivateRoomsByUser(id);
    res.json(data);
    return data;
  }
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getRoom(@Param('id') id: string, @Res() res:any) :Promise<void>{
    const data = await this.chatService.getPrivateRoom(id);
    res.json({success:true, data});
    return data;
  }
  @Get(':id/messages')
  @UseGuards(JwtAuthGuard)
  async getRoomMessages(@Param('id') id: string, @Res() res:any) :Promise<void>{
    try{
      const data = await this.chatService.getPrivateRoomMessages(id);
      res.json(data);
      return data;
    }
    catch(e){
      res.json({response:e});
    }
  }
  @Get('channels/public')
  @UseGuards(JwtAuthGuard)
  async getPublicChannels(@Res() res:any): Promise<Channel | undefined>{
    const data = await this.chatService.getAllTypeChannels("PUBLIC");
    const dataBeta = res.json(data);
    console.log(data);
    return dataBeta;
  }
  @Get('channels/protected')
  @UseGuards(JwtAuthGuard)
  async getProtectedChannels(@Res() res:any): Promise<Channel | undefined>{
    const data = await this.chatService.getAllTypeChannels("PROTECTED");
    const dataBeta = res.json(data);
    console.log(data);
    return dataBeta;
  }
  // @Get(':id/message')
  // async getMessages(@Param('id') id: string, @Res() res:any) : Promise<void>{
  //   const data = await this.chatService.getMessagesByUser(id);
  //   res.json(data) ??
  //   return data;
  //  }
  @Post('private-message')
  @UseGuards(JwtAuthGuard)
  async sendPrivateMessage(@Body() data: { sender: string; recipient: string; message: string }): Promise<void> {
    const { sender, recipient, message } = data;
    await this.chatService.sendPrivateMessage(sender, recipient, message);
  }
}
