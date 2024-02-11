import {
	Controller,
	Post,
	Body,
	Get,
	Res,
	Param,
	UseGuards,
	Query,
	Req,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { Room, Channel } from './dto/chat.dto';
import { JwtAuthGuard } from 'modules/auth/jwt-auth.guard';
import { AuthService } from 'modules/auth/auth.service';

@Controller('chat')
export class ChatController {
	constructor(
		private readonly chatService: ChatService,
		private authService: AuthService
	) {}

	@Get('search')
	@UseGuards(JwtAuthGuard)
	async searchUsers(@Query('q') query: string) {
		return await this.chatService.searchUsers(query);
	}
	@Get('chan/:id/Search')
	@UseGuards(JwtAuthGuard)
	async searchMembers(@Param('id') id: string, @Query('q') query: string) {
		return await this.chatService.searchMembers(query, id);
	}
	@Get('chanMember/:id/:intraId')
	@UseGuards(JwtAuthGuard)
	async getMember(@Param('id') id: string, @Param('intraId') intraId: string) {
		return await this.chatService.getMember(id, intraId);
	}

	@Get(':id/privateRooms')
	@UseGuards(JwtAuthGuard)
	async getPrivateRoomsByUser(@Param('id') id: string, @Res() res: any) {
		try {
			const data = await this.chatService.getPrivateRoomsByUser(id);
			res.json(data);
			return data;
		} catch (e) {
			return undefined;
		}
	}
	@Get(':id')
	@UseGuards(JwtAuthGuard)
	async getRoom(@Param('id') id: string, @Res() res: any): Promise<void> {
		const data = await this.chatService.getPrivateRoom(id);
		res.json({ success: true, data });
		return data;
	}
	@Get(':id/messages')
	@UseGuards(JwtAuthGuard)
	async getRoomMessages(
		@Param('id') id: string,
		@Res() res: any,
		@Query('page') page: number,
		@Query('pageSize') pageSize: number = 30
	): Promise<void> {
		try {
			const skip = page * pageSize;
			const data = await this.chatService.getPrivateRoomMessages(
				id,
				pageSize,
				skip
			);
			res.json(data);
			return data;
		} catch (e) {
			res.json({ response: e });
		}
	}
	@Get('channels/public')
	@UseGuards(JwtAuthGuard)
	async getPublicChannels(@Res() res: any): Promise<Channel | undefined> {
		const data = await this.chatService.getAllTypeChannels('PUBLIC');
		const dataBeta = res.json(data);
		return dataBeta;
	}
	@Get('channels/protected')
	@UseGuards(JwtAuthGuard)
	async getProtectedChannels(@Res() res: any): Promise<Channel | undefined> {
		const data = await this.chatService.getAllTypeChannels('PROTECTED');
		const dataBeta = res.json(data);
		return dataBeta;
	}
	@Get('channel/:id')
	@UseGuards(JwtAuthGuard)
	async getChannel(
		@Param('id') id: string,
		@Res() res: any
	): Promise<Channel | undefined> {
		try {
			const data = await this.chatService.getChannel(id);
			const dataBeta = res.json(data);
			return dataBeta;
		} catch (e) {
			return undefined;
		}
	}
	@Get('channels/:id/availabelChannels')
	@UseGuards(JwtAuthGuard)
	async getAvailableChannels(
		@Param('id') id: string,
		@Res() res: any
	): Promise<Channel | undefined> {
		const data = await this.chatService.getAllAvailableChannels(id);
		const dataBeta = res.json(data);
		return dataBeta;
	}
	@Get('channels/:id/availChan')
	@UseGuards(JwtAuthGuard)
	async getSearchedChannels(
		@Param('id') id: string,
		@Res() res: any,
		@Query('q') query: string
	): Promise<Channel | undefined> {
		const data = await this.chatService.getSerachedChan(query, id);
		const dataBeta = res.json(data);
		return dataBeta;
	}
	@Get('invitesChannels/:id')
	@UseGuards(JwtAuthGuard)
	async getIviteChannel(
		@Param('id') id: string,
		@Res() res: any
	): Promise<Channel | undefined> {
		try {
			const data = await this.chatService.getInviteChannel(id);
			const dataBeta = res.json(data);
			return dataBeta;
		} catch (e) {
			return undefined;
		}
	}
	@Get('channels/:id/userChannels')
	@UseGuards(JwtAuthGuard)
	async getUserChannels(
		@Param('id') id: string,
		@Res() res: any
	): Promise<any | undefined> {
		const data = await this.chatService.getUserChannels(id);
		const dataBeta = res.json(data);
		return dataBeta;
	}
	@Get('channels/messages/:id')
	@UseGuards(JwtAuthGuard)
	async getChannelMessages(
		@Param('id') id: string,
		@Req() req: any,
		@Res() res: any
	): Promise<any | undefined> {
		try {
			const cookie = req.cookies;
			const user = this.authService.getUserFromCookie(cookie);
			let data = await this.chatService.getChannelMessages(id);
			let blockedUsers = await this.chatService.getBlockedUser(user.intraId);
			data = data.filter((item: any) => {
				return !blockedUsers.some((entry) => {
					if (entry.userId === user.intraId) {
						return entry.friendId === item.sender;
					} else if (entry.friendId === user.intraId) {
						return entry.userId === item.sender;
					}
					return false; // Make sure to have a default return value
				});
			});
			const dataBeta = res.json(data);
			return dataBeta;
		} catch (e) {
			// console.log(e);
		}
	}

	@Get('chanAvatar/:id')
	@UseGuards(JwtAuthGuard)
	async getChanAvatar(
		@Param('id') id: string,
		@Res() res: any
	): Promise<any | undefined> {
		const data = await this.chatService.getChanAvatar(id);
		const dataBeta = res.json(data);
		return dataBeta;
	}

	@Get('channelInvitation/:id')
	@UseGuards(JwtAuthGuard)
	async getChannelInvitation(
		@Param('id') id: string,
		@Res() res: any
	): Promise<any | undefined> {
		const data = await this.chatService.getInviteChannel(id);
		const dataBeta = res.json(data);
		return dataBeta;
	}

	@Post('createChannel/:id')
	@UseGuards(JwtAuthGuard)
	async createChannel(
		@Param('id') intraId: string,
		@Body() payload: { channelName: string; type: string; password: string },
		@Res() res: any
	) {
		try {
			await this.chatService.createChannel(
				intraId,
				payload.channelName,
				payload
			);
			res.json({ sucess: true });
		} catch (e) {
			// console.log(e);
			res.json({ sucess: false, error: e });
		}
	}
	@Post('leaveChannel/:id/:name')
	@UseGuards(JwtAuthGuard)
	async leaveChannel(
		@Param('id') intraId: string,
		@Param('name') channelName: string,
		@Res() res: any
	) {
		try {
			await this.chatService.leaveChannel(intraId, channelName);
			res.json({ sucess: true });
		} catch (e) {
			// console.log(e);
			res.json({ sucess: false, e });
		}
	}
	@Post('updateChannelInvite/:id/:name')
	@UseGuards(JwtAuthGuard)
	async updateInviteStatus(
		@Param('id') intraId: string,
		@Param('name') channelName: string,
		@Body() payload: { status: string },
		@Res() res: any
	) {
		try {
			await this.chatService.updateInvite(
				intraId,
				channelName,
				payload.status === 'true' ? true : false
			);
			res.json({ sucess: true });
		} catch (e) {
			// console.log(e);
			res.json({ sucess: false, e });
		}
	}
	@Post('joinChannel/:id')
	@UseGuards(JwtAuthGuard)
	async joinChannel(
		@Param('id') intraId: string,
		@Param('name') channelName: string,
		@Body() payload: { channelId: string; type: string; password: string },
		@Res() res: any
	) {
		try {
			await this.chatService.joinChannel(
				intraId,
				payload.channelId,
				payload.type,
				payload.password
			);
			res.json({ success: true, error: 'Invitation sent' });
		} catch (e) {
			// console.log(e);
			res.json({ success: false, error: e });
		}
	}
	@Post('inviteToChannel/:id/:name')
	@UseGuards(JwtAuthGuard)
	async inviteChannel(
		@Param('id') intraId: string,
		@Param('name') channelName: string,
		@Body() payload: { invitedId: string },
		@Res() res: any
	) {
		try {
			await this.chatService.inviteChannel(
				intraId,
				payload.invitedId,
				channelName
			);
			res.json({ sucess: true, error: 'invitation sent' });
		} catch (e) {
			// console.log(e);
			res.json({ success: false, error: e });
		}
	}
	@Post('updateChannel/:id/:name')
	@UseGuards(JwtAuthGuard)
	async updateChannelSettings(
		@Param('id') intraId: string,
		@Param('name') channelName: string,
		@Body() payload: { newName: string; type: string; password: string },
		@Res() res: any
	) {
		try {
			await this.chatService.updateChannelSettings(
				intraId,
				channelName,
				payload
			);
			res.json({ sucess: true });
		} catch (e) {
			// console.log(e);
			res.json({ sucess: false, e });
		}
	}
	@Post('kick/:id/:name')
	@UseGuards(JwtAuthGuard)
	async kickUser(
		@Param('id') intraId: string,
		@Param('name') channelName: string,
		@Body() payload: { memberId: string },
		@Res() res: any
	) {
		try {
			await this.chatService.kickFromChannel(
				intraId,
				payload.memberId,
				channelName
			);
			res.json({ sucess: true });
		} catch (e) {
			// console.log(e);
			res.json({ sucess: false, error: e });
		}
	}
	@Get('channelsRoom/:userId')
	@UseGuards(JwtAuthGuard)
	async getUserActiveChannels(@Param('userId') intraId: string) {
		try {
			const data = await this.chatService.getUserActiveChannels(intraId);
			return data;
		} catch (e) {
			return [];
		}
	}
}
