// chat.controller.ts
import { Controller, Post, Body, Get, Res,Param, UseGuards, Query } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Room , User, Message, Channel } from './dto/chat.dto';
import { JwtAuthGuard } from 'modules/auth/jwt-auth.guard';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('search')
  @UseGuards(JwtAuthGuard)
  async searchUsers(@Query('q') query: string) {
    return await this.chatService.searchUsers(query);
  }
  @Get('chan/:id/Search')
  @UseGuards(JwtAuthGuard)
  async searchMembers(@Param('id') id:string,@Query('q') query: string) {
    return await this.chatService.searchMembers(query, id);
  }
  @Get('chanMember/:id/:intraId')
  @UseGuards(JwtAuthGuard)
  async getMember(@Param('id') id:string,@Param('intraId') intraId:string) {
    return await this.chatService.getMember(id, intraId);
  }
  
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
    try{

      const data = await this.chatService.getPrivateRoomsByUser(id);
      res.json(data);
      return data;
    }
    catch(e){
      return undefined;
    }
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
    return dataBeta;
  }
  @Get('channels/protected')
  @UseGuards(JwtAuthGuard)
  async getProtectedChannels(@Res() res:any): Promise<Channel | undefined>{
    const data = await this.chatService.getAllTypeChannels("PROTECTED");
    const dataBeta = res.json(data);
    return dataBeta;
  }
  @Get('channel/:id')
  @UseGuards(JwtAuthGuard)
  async getChannel(@Param('id') id: string,@Res() res:any): Promise<Channel | undefined>{
    try{
      const data = await this.chatService.getChannel(id);
      const dataBeta = res.json(data);
      return dataBeta;
    }
    catch(e)
    {
      return undefined;
    }
  }
  @Get('channels/:id/availabelChannels')
  @UseGuards(JwtAuthGuard)
  async getAvailableChannels(@Param('id') id: string,@Res() res:any): Promise<Channel | undefined>{
    const data = await this.chatService.getAllAvailableChannels(id);
    const dataBeta = res.json(data);
    return dataBeta;
  }
  @Get('channels/:id/userChannels')
  @UseGuards(JwtAuthGuard)
  async getUserChannels(@Param('id') id: string, @Res() res:any): Promise<any | undefined>{
    const data = await this.chatService.getUserChannels(id);
    const dataBeta = res.json(data);
    return dataBeta;
  }
  @Get('channels/messages/:id')
  @UseGuards(JwtAuthGuard)
  async getChannelMessages(@Param('id') id: string, @Res() res:any): Promise<any | undefined>{
    const data = await this.chatService.getChannelMessages(id);
    const dataBeta = res.json(data);
    return dataBeta;
  }
  @Get('chanAvatar/:id')
  @UseGuards(JwtAuthGuard)
  async getChanAvatar(@Param('id') id: string, @Res() res:any): Promise<any | undefined>{
    const data = await this.chatService.getChanAvatar(id);
    const dataBeta = res.json(data);
    return dataBeta;
  }
  
  @Post('private-message')
  @UseGuards(JwtAuthGuard)
  async sendPrivateMessage(@Body() data: { sender: string; recipient: string; message: string }): Promise<void> {
    const { sender, recipient, message } = data;
    await this.chatService.sendPrivateMessage(sender, recipient, message);
  }
}
