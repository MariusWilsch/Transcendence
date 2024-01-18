import { Injectable } from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { User, Room, Message } from './dto/chat.dto';
import { Prisma, PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { JWT_SECRET } from 'modules/auth/constants';

enum ChannelType {
  Public = 1,
  PROTECTED,
  PRIVATE
}
const prisma = new PrismaClient();
@Injectable()
export class ChatService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService
    ) { }
  async createMessage(sender: string, recipient: string, content: string): Promise<any> {
    const date = new Date();
    const dateToIso : string = date.toISOString(); 
    const senderUser:User = await prisma.user.findUnique({ where: { intraId: sender } });
    const recipientUser:User = await prisma.user.findUnique({ where: { intraId: recipient } });
    const privateRoomName = parseInt(senderUser.intraId) > parseInt(recipientUser.intraId) ? senderUser.intraId + recipientUser.intraId :recipientUser.intraId + senderUser.intraId;
    let room = await prisma.privateRoom.findUnique({
      where:{
        name:privateRoomName,
      }
    });
    if (!senderUser || !recipientUser) {
      throw new Error('Sender or recipient not found.');
    }
    const userStatue = prisma.friend.findFirst({
      where:{
        friendId:sender,
      }
    });

    if (userStatue && (await userStatue)?.friendshipStatus === 'BLOCKED')
    {
      throw ('message can\'t be sent');
    }
    if (!room && (senderUser && recipientUser))
    {
      room =   await prisma.privateRoom.create({
        data: {
          name:privateRoomName,
          participantsIds:[senderUser.intraId, recipientUser.intraId],
          participants: {
            connect: [
              { intraId: senderUser.intraId },
              { intraId: recipientUser.intraId },
            ],
          },
        },
      });
    }
    if(!room && (!senderUser || !recipientUser)){
      
      throw('error during the creation of the room');
    }
     const message = await prisma.message.create({
      data: {
        sender:sender,
        recipient:recipient,
        content:content,
        PrivateRoomName:privateRoomName,
      },
    });
    await prisma.privateRoom.update({
      where: {
        name: privateRoomName,
      },
      data:{
        updated_at:dateToIso,
      },
    });
    console.log(message);
    return message;
  }

  getUserFromJwt(jwt: any): User | undefined {
    if (!jwt) {
      return undefined;
    }

    try {
      const payload = this.jwtService.verify(jwt, {
        secret: JWT_SECRET,
      });

      const user = payload.userWithoutDate;
      return user;
    } catch (error) {
      console.error('JWT Verification Error:', error);
      return undefined;
    }
  }

  async createPrivateRoom(user1: string, user2: string, clientRoomid:string): Promise<void> {
    if (user1 === user2)
    {
      return;
    }
    const romeName  = parseInt(user1) > parseInt(user2) ? user1 + user2 :user2 + user1;
    if (romeName !== clientRoomid)
    {
      return ;
    }
    const room = await prisma.privateRoom.findUnique({
      where:{
        name:romeName,
      }
    });
    if (room)
    {
      console.log('room already exist');
      return;
    }
    const member1 = await prisma.user.findUnique({ where: { intraId: user1 } });
    const member2 = await prisma.user.findUnique({ where: { intraId: user2 } });
    console.log(member1);
    console.log(member2);
    if (!member1 || !member2) {
      // Handle the case where either sender or recipient does not exis
      throw ('Sender or recipient not found.');
    }
    await prisma.privateRoom.create({
      data: {
        name:romeName,
        participantsIds:[member1.intraId, member2.intraId],
        participants: {
          connect: [
            { intraId: member1.intraId },
            { intraId: member2.intraId},
          ],
        },
      },
    });
  }

  async getMessagesByUsr(userId: string): Promise<any[]> {
    return prisma.message.findMany({
      where: {
        OR: [
          { sender: userId },
          { recipient: userId },
        ],
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  // You can add other methods for more database operations as needed
  async getAllMessages(): Promise<any[]> {
    return prisma.message.findMany();
  }
  //get user by id
  async getUserById(userId: string): Promise<any> {
    return prisma.user.findUnique({
      where: {
        intraId: userId,
      },
    });
  }
  //get all users
  async getAllUsers(): Promise<any[]> {
    return prisma.user.findMany();
  }

  async getAllRooms() {
    try {
      const rooms = await prisma.privateRoom.findMany({
        orderBy: {
          updated_at: 'asc',
        },
      });

      return rooms;
    } catch (e) {
      console.log('Error in getAllRooms: ', e);
    }
  }
  async getRoom(roomId:string) :Promise<any>{
    return await prisma.privateRoom.findUnique({
      where: {
        name: roomId,
      },
    });
  }
  async getRoomMessages(roomId:string) :Promise<any>{
    return await prisma.message.findMany({
      where:{
        PrivateRoomName:roomId,
      },
      orderBy:{
        createdAt:'asc',
      }
    })
  }
  async getRoomsByUser(userId:string) :Promise<any>
  {
    return  await prisma.privateRoom.findMany({
      where:{
        participantsIds:{
          has: userId,
        },
      },
      orderBy:{
        updated_at:'asc',
      }
    })
  }
  async sendPrivateMessage(sender: string, recipient: string, message: string): Promise<void> {
    await this.createMessage(sender, recipient, message);
  }
  async getAllPrivateRooms(): Promise<any> {
    const data = await this.getAllRooms();
    return data;
  }
  async getPrivateRoom(roomId: string) {
    const data = await this.getRoom(roomId);
    return data;
  }
  async getPrivateRoomsByUser(userId:string)
  {
    const data = await this.getRoomsByUser(userId);
    return data;
  }
  async getPrivateRoomMessages(roomId: string){
    const room = await this.getPrivateRoom(roomId);
    if (!room)
    {
      throw ('no such room');
    }
    const data = await this.getRoomMessages(roomId);
    return data;
  }
  async getMessagesByUser(userId:string): Promise<any>{
    const data = await this.getMessagesByUsr(userId);
    return data;
  }
  generateRandomId(): string {
    const randomId = crypto.randomBytes(8).toString('hex');
    return randomId;
  }
  async createMember(intraId:string, channelId:string, isOwner:boolean):Promise<void> {
    const memberId = this.generateRandomId();
    const user = await prisma.user.findUnique({
      where:{
        intraId,
      }
    })
    if (!user)
    {
      throw ('no such user');
    }

    await prisma.memberShip.create({
      data:{
        memberId:this.generateRandomId(),
        intraId,
        channelId,
        isOwner:isOwner,
        Avatar:user.Avatar,
        login:user.login,
      },
    });
  }
  async createChannel(ownerId:string,channelName:string,typePass:{type:string, password:string}):Promise<void> {
    const name = channelName + ownerId;
    let password:string;
    const saltRounds = 10;
    const channel = await prisma.channel.findUnique({
      where:{
        name,
      },
    })
    if (channel)
    {
      throw ('channle already exist');
    }
    if (typePass.type == "PROTECTED")
    {
      password = await bcrypt.hash(typePass.password, saltRounds);
    }
    await prisma.channel.create({
      data:{
        name,
        ownerId,
        type:typePass.type,
        password,
      },
    });
    try{

      await this.createMember(ownerId, name, true);
    }
    catch(e)
    {
      console.log("creating memeber successfully failed");
    }
  }
  async getAllTypeChannels(type:string) {
    const data = prisma.channel.findMany({
      where:{
        type,
      },
    })
    return data;
  }
  async getUserChannels(userId:string) {
    const data = await prisma.memberShip.findMany({
      where:{
        intraId:userId,
      },
    });
    return data;
  }
  async joinChannel(user:User, channelId:string, type:string, password:string)
  {
    const channel = await prisma.channel.findUnique({
      where:{
        name:channelId,
      },
    })
    if (!channel){
      throw ('no such channel sorry');
    }
    const member = await prisma.memberShip.findFirst({
      where:{
        intraId:user.intraId,
        channelId,
      }
    })
    if (member)
    {
      throw('already in channel');
    }
    if (channel.type === 'PROTECTED')
    {
        const reslt = await bcrypt.compare(password, channel.password);
        if (!reslt)
        {
          throw("password incorrect");
        }
    }
    await this.createMember(user.intraId, channelId, false);
  }
  async getAllChannelUsers(channelId:string){
    return await prisma.memberShip.findMany({
      where:{
        channelId,
        isBanned:false,
        isMuted:false,
      },
    })
  }
  async createChannelMessage(channelId:string, message:string, sender:User){
    const memberShip = await  prisma.memberShip.findFirst({
      where:{
        channelId,
        intraId :sender.intraId
      },
    })
    if (!memberShip)
    {
      throw ('no such member');
    }
    if (memberShip.isBanned || memberShip.isMuted)
    {
      throw ('you can t send message into that channel ');
    }
    return await prisma.channelMessage.create({
      data:{
        channelId,
        sender:sender.intraId,
        Avatar:sender.Avatar,
        content:message,
      },

    })
  }
  async getAllAvailableChannels(intraId:string){
    
    return await prisma.channel.findMany({
      where:{
        type:{
          not:{
            equals:'PRIVATE',
          }
        },
        members:{
          none:{
            intraId,
          }
        }
      }
    })
  }
  async getChannel(channelId:string):Promise<any>{
    const channel = await prisma.channel.findUnique({
      where:{
        name:channelId,
      },
    });
    if (!channel)
    {
      throw('no such channel');
    }
    return channel;
  }
  async getChannelMessages(channelId:string):Promise<any>
  {
    const channel = await prisma.channel.findUnique({
      where:{
        name:channelId,
      },
    });
    if (!channel)
    {
      throw('no such channel');
    }
    return await prisma.channelMessage.findMany({
      where:{
        channelId,
      }
    })
  }

  async searchUsers(query: string) {
    return await prisma.user.findMany({
      where: {
        login: {
          contains: query,
        },
      },
    });
  }
  async getChanAvatar(channelId:string){
    return await prisma.memberShip.findMany({
      take:3,
      where:{
        channelId,
      }
    })
  }
  async searchMembers(query: string, channelId:string) {
    return await prisma.memberShip.findMany({
      where: {
        channelId,
        isBanned:false,
        login: {
          contains: query,
        },
      },
    });
  }
  async updateChannelUser(moderatorId:string,memberId:string, info:{userPrivilige:boolean, banning:boolean, Muting:{action:boolean, time:Date}}){
    const memberShip = await prisma.memberShip.findUnique({
      where:{
        memberId,
      }
    });
    const moderator = await prisma.memberShip.findFirst({
      where:{
        intraId:moderatorId,
        channelId:memberShip.channelId,
      }
    });
    // if (!moderator
    //     || (!moderator.isModerator)
    //     || (!moderator.isModerator && !moderator.isOwner)){
    //       throw('lack of privilege');    
    //    }
    if (!memberShip){
      throw('member doesn t exist')
    }
    if (memberShip.isOwner){
      throw('you can t modify the owner privilege');
    }
    // console.log({
    //   isBanned:info.banning !== memberShip.isBanned ? info.banning:memberShip.isBanned,
    //   isModerator:info.userPrivilige!== memberShip.isModerator?info.userPrivilige:memberShip.isModerator,
    //   isMuted:info.Muting.action !==memberShip.isMuted?info.Muting.action:memberShip.isMuted,
    //   mutedTime:info.Muting.time,
    // });
    await prisma.memberShip.update({
      where:{
        memberId,
      },
      data:{
        isBanned:info.banning !== memberShip.isBanned ? info.banning:memberShip.isBanned,
        isModerator:info.userPrivilige!== memberShip.isModerator?info.userPrivilige:memberShip.isModerator,
        isMuted:info.Muting.action !==memberShip.isMuted?info.Muting.action:memberShip.isMuted,
        mutedTime:info.Muting.time,
      }
    })
    return memberShip;
  }
  async getMember(channelId:string, intraId:string){
    return await prisma.memberShip.findFirst({
      where:{
        channelId,
        intraId,
      }
    })
  }
}
