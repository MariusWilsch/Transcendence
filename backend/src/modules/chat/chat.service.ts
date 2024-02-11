import { Injectable } from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { User, Room, Message } from './dto/chat.dto';
import { MemberShip, PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';

const prisma = new PrismaClient();
@Injectable()
export class ChatService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly jwtService: JwtService
	) {}

	async updateUserStatus(intraId: string, status: string) {
		const user = await prisma.user.findUnique({
			where: {
				intraId,
			},
		});
		if (!user) return;
		await prisma.user.update({
			where: {
				intraId,
			},
			data: {
				status: status === 'ONLINE' ? 'ONLINE' : 'OFFLINE',
			},
		});
	}
	async createMessage(
		sender: string,
		recipient: string,
		content: string
	): Promise<any> {
		const date = new Date();
		const dateToIso: string = date.toISOString();
		const senderUser: User = await prisma.user.findUnique({
			where: { intraId: sender },
		});
		const recipientUser: User = await prisma.user.findUnique({
			where: { intraId: recipient },
		});
		const privateRoomName =
			parseInt(senderUser.intraId) > parseInt(recipientUser.intraId)
				? senderUser.intraId + recipientUser.intraId
				: recipientUser.intraId + senderUser.intraId;
		let room = await prisma.privateRoom.findUnique({
			where: {
				name: privateRoomName,
			},
		});
		if (!senderUser || !recipientUser) {
			throw new Error('Sender or recipient not found.');
		}
		const userStatue = await prisma.friend.findFirst({
			where: {
				OR: [
					{
						friendId: sender,
						userId: recipient,
					},
					{
						userId: sender,
						friendId: recipient,
					},
				],
			},
		});

		if (userStatue?.friendshipStatus === 'BLOCKED') {
			throw "message can't be sent";
		}
		if (!room && senderUser && recipientUser) {
			room = await prisma.privateRoom.create({
				data: {
					name: privateRoomName,
					participantsIds: [senderUser.intraId, recipientUser.intraId],
					participants: {
						connect: [
							{ intraId: senderUser.intraId },
							{ intraId: recipientUser.intraId },
						],
					},
				},
			});
		}
		if (!room && (!senderUser || !recipientUser)) {
			throw 'error during the creation of the room';
		}
		const message = await prisma.message.create({
			data: {
				sender: sender,
				recipient: recipient,
				content: content,
				PrivateRoomName: privateRoomName,
			},
		});
		await prisma.privateRoom.update({
			where: {
				name: privateRoomName,
			},
			data: {
				updated_at: dateToIso,
			},
		});
		return message;
	}

	async createPrivateRoom(
		user1: string,
		user2: string,
		clientRoomid: string
	): Promise<void> {
		if (user1 === user2) {
			return;
		}
		const romeName =
			parseInt(user1) > parseInt(user2) ? user1 + user2 : user2 + user1;
		if (romeName !== clientRoomid) {
			return;
		}
		const room = await prisma.privateRoom.findUnique({
			where: {
				name: romeName,
			},
		});
		if (room) {
			// console.log('room already exist');
			return;
		}
		const member1 = await prisma.user.findUnique({ where: { intraId: user1 } });
		const member2 = await prisma.user.findUnique({ where: { intraId: user2 } });
		if (!member1 || !member2) {
			// Handle the case where either sender or recipient does not exis
			throw 'Sender or recipient not found.';
		}
		await prisma.privateRoom.create({
			data: {
				name: romeName,
				participantsIds: [member1.intraId, member2.intraId],
				participants: {
					connect: [{ intraId: member1.intraId }, { intraId: member2.intraId }],
				},
			},
		});
	}

	async getMessagesByUsr(userId: string): Promise<any[]> {
		return prisma.message.findMany({
			where: {
				OR: [{ sender: userId }, { recipient: userId }],
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
			// console.log('Error in getAllRooms: ', e);
		}
	}
	async getRoom(roomId: string): Promise<any> {
		return await prisma.privateRoom.findUnique({
			where: {
				name: roomId,
			},
		});
	}
	async getRoomMessages(
		roomId: string,
		pageSize: number,
		skip: number
	): Promise<any> {
		return await prisma.message.findMany({
			take: pageSize,
			skip,
			where: {
				PrivateRoomName: roomId,
			},
			orderBy: {
				createdAt: 'desc',
			},
		});
	}
	async getRoomsByUser(userId: string): Promise<any> {
		return await prisma.privateRoom.findMany({
			where: {
				participantsIds: {
					has: userId,
				},
			},
			orderBy: {
				updated_at: 'asc',
			},
		});
	}
	async sendPrivateMessage(
		sender: string,
		recipient: string,
		message: string
	): Promise<void> {
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
	async getPrivateRoomsByUser(userId: string) {
		const data = await this.getRoomsByUser(userId);
		return data;
	}
	async getPrivateRoomMessages(roomId: string, pageSize: number, skip: number) {
		const room = await this.getPrivateRoom(roomId);
		if (!room) {
			throw 'no such room';
		}
		const data = await this.getRoomMessages(roomId, pageSize, skip);
		return data;
	}
	async getMessagesByUser(userId: string): Promise<any> {
		const data = await this.getMessagesByUsr(userId);
		return data;
	}
	generateRandomId(): string {
		const randomId = crypto.randomBytes(8).toString('hex');
		return randomId;
	}
	async createMember(
		intraId: string,
		channelName: string,
		channelId: string,
		isOwner: boolean,
		onInviteState: boolean
	): Promise<void> {
		const memberId = this.generateRandomId();
		const user = await prisma.user.findUnique({
			where: {
				intraId,
			},
		});
		if (!user) {
			throw 'no such user';
		}

		await prisma.memberShip.create({
			data: {
				memberId: this.generateRandomId(),
				intraId,
				channelId,
				channelName,
				isOwner: isOwner,
				isModerator: isOwner,
				Avatar: user.Avatar,
				login: user.login,
				onInviteState,
			},
		});
	}
	async createChannel(
		ownerId: string,
		channelName: string,
		typePass: { type: string; password: string }
	): Promise<void> {
		const name = channelName;
		let password: string;
		const saltRounds = 10;
		if (channelName.length > 30 || channelName.length < 3) {
			throw 'Invalid input: channel name required 3 to 30 characters';
		}
		const channel = await prisma.channel.findUnique({
			where: {
				name,
			},
		});
		if (channel) {
			throw 'channle already exist';
		}
		if (typePass.type == 'PROTECTED') {
			password = await bcrypt.hash(typePass.password, saltRounds);
		}
		const createdChannel = await prisma.channel.create({
			data: {
				name,
				ownerId,
				type: typePass.type,
				password,
			},
		});
		try {
			await this.createMember(ownerId, name, createdChannel.id, true, false);
		} catch (e) {
			// console.log("creating memeber successfully failed");
		}
	}
	async getAllTypeChannels(type: string) {
		const data = prisma.channel.findMany({
			where: {
				type,
			},
		});
		return data;
	}
	async getUserChannels(userId: string) {
		const data = await prisma.memberShip.findMany({
			where: {
				intraId: userId,
				isBanned: false,
				onInviteState: false,
			},
		});
		return data;
	}
	async joinChannel(
		userId: string,
		channelId: string,
		type: string,
		password: string
	) {
		const channel = await prisma.channel.findUnique({
			where: {
				id: channelId,
			},
		});
		if (!channel) {
			throw 'no such channel sorry';
		}
		const user = await prisma.user.findUnique({
			where: {
				intraId: userId,
			},
		});
		if (!user) {
			throw 'no such user';
		}
		const member = await prisma.memberShip.findFirst({
			where: {
				intraId: user.intraId,
				channelId,
			},
		});
		if (member) {
			throw 'already in channel';
		}
		if (channel.type === 'PROTECTED') {
			const reslt = await bcrypt.compare(password, channel.password);
			if (!reslt) {
				throw 'password incorrect';
			}
		}
		await this.createMember(
			user.intraId,
			channel.name,
			channel.id,
			false,
			false
		);
	}
	async getAllChannelUsers(channelId: string) {
		return await prisma.memberShip.findMany({
			where: {
				channelId,
				isBanned: false,
				onInviteState: false,
			},
		});
	}
	async createChannelMessage(channelId: string, message: string, sender: User) {
		const dateNow = new Date();
		const dateOs = dateNow.toISOString();
		const memberShip = await prisma.memberShip.findFirst({
			where: {
				channelId,
				intraId: sender.intraId,
			},
		});

		if (!memberShip) {
			throw 'no such member';
		}
		if (memberShip.isBanned) {
			throw 'you can t send message into that channel ';
		}
		if (memberShip.isMuted) {
			if (memberShip.mutedTime !== null && memberShip.mutedTime <= dateNow) {
				await prisma.memberShip.update({
					where: {
						memberId: memberShip.memberId,
					},
					data: {
						isMuted: false,
					},
				});
			} else {
				throw `you re muted for until a specific time `;
			}
		}
		const user = await prisma.user.findUnique({
			where: {
				intraId: sender.intraId,
			},
		});
		if (!user) {
			throw 'no such user';
		}
		return await prisma.channelMessage.create({
			data: {
				channelId,
				channelName: memberShip.channelName,
				sender: sender.intraId,
				Avatar: user.Avatar,
				content: message,
			},
		});
	}
	async getAllAvailableChannels(intraId: string) {
		return await prisma.channel.findMany({
			take: 5,
			where: {
				type: {
					not: {
						equals: 'PRIVATE',
					},
				},
				members: {
					none: {
						intraId,
					},
				},
			},
		});
	}
	async getChannel(channelId: string): Promise<any> {
		const channel = await prisma.channel.findUnique({
			where: {
				id: channelId,
			},
		});
		if (!channel) {
			throw 'no such channel';
		}
		return channel;
	}
	async getChannelMessages(channelId: string): Promise<any> {
		const channel = await prisma.channel.findUnique({
			where: {
				id: channelId,
			},
		});
		if (!channel) {
			throw 'no such channel';
		}
		return await prisma.channelMessage.findMany({
			where: {
				channelId,
			},
		});
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
	async getChanAvatar(channelId: string) {
		return await prisma.memberShip.findMany({
			take: 3,
			where: {
				channelId,
			},
		});
	}
	async searchMembers(query: string, channelId: string) {
		return await prisma.memberShip.findMany({
			where: {
				channelId,
				onInviteState: false,
				login: {
					contains: query,
				},
			},
		});
	}
	async updateChannelUser(
		moderatorId: string,
		memberId: string,
		info: {
			userPrivilige: boolean;
			banning: boolean;
			Muting: { action: boolean; time: Date };
		}
	) {
		const memberShip = await prisma.memberShip.findUnique({
			where: {
				memberId,
			},
		});
		const moderator = await prisma.memberShip.findFirst({
			where: {
				intraId: moderatorId,
				channelId: memberShip.channelId,
			},
		});
		if (!memberShip) {
			throw 'member doesn t exist';
		}
		if (memberShip.isOwner) {
			throw 'you can t modify the owner privilege';
		}
		await prisma.memberShip.update({
			where: {
				memberId,
			},
			data: {
				isBanned:
					info.banning !== memberShip.isBanned
						? info.banning
						: memberShip.isBanned,
				isModerator:
					info.userPrivilige !== memberShip.isModerator
						? info.userPrivilige
						: memberShip.isModerator,
				isMuted:
					info.Muting.action !== memberShip.isMuted
						? info.Muting.action
						: memberShip.isMuted,
				mutedTime: info.Muting.time,
			},
		});
		return memberShip;
	}
	async getMember(channelId: string, intraId: string) {
		return await prisma.memberShip.findFirst({
			where: {
				channelId,
				intraId,
			},
		});
	}
	async updateChannelSettings(
		ownerId: string,
		channelId: string,
		info: { newName: string; type: string; password: string }
	) {
		const saltRounds = 10;
		let password = '';
		const channel = await prisma.channel.findUnique({
			where: {
				id: channelId,
			},
		});
		if (!channel) {
			throw 'no such channel';
		}
		const owner = prisma.memberShip.findFirst({
			where: {
				channelId,
				intraId: ownerId,
				isOwner: true,
			},
		});
		if (!owner) {
			throw 'luck of privilige ';
		}
		if (info.newName) {
			const newChannelCheck = await prisma.channel.findUnique({
				where: {
					name: info.newName,
				},
			});
			if (newChannelCheck) {
				throw 'channel name already exist';
			}
		}
		if (info.type === 'PROTECTED') {
			password = await bcrypt.hash(info.password, saltRounds);
		}
		await prisma.channel.update({
			where: {
				id: channelId,
			},
			data: {
				name: info.newName ? info.newName : channel.name,
				type: info.type ? info.type : channel.type,
				password: info.password ? password : channel.password,
			},
		});
	}

	async leaveChannel(intraId: string, channelName: string) {
		let newOwner: MemberShip;
		const channel = await prisma.channel.findUnique({
			where: {
				id: channelName,
			},
		});
		if (!channel) {
			throw 'no such channel';
		}
		const membership = await prisma.memberShip.findFirst({
			where: {
				intraId,
				channelId: channelName,
			},
		});
		if (!membership) {
			throw 'no such member';
		}
		if (membership.isOwner) {
			newOwner = await prisma.memberShip.findFirst({
				where: {
					channelId: channelName,
					intraId: {
						not: intraId,
					},
					isModerator: true,
				},
			});
			if (!newOwner) {
				newOwner = await prisma.memberShip.findFirst({
					where: {
						channelId: channelName,
						intraId: {
							not: intraId,
						},
						isBanned: false,
					},
				});
			}
			if (!newOwner) {
				await prisma.memberShip.deleteMany();
				await prisma.channelMessage.deleteMany();
				await prisma.channel.delete({
					where: {
						id: channelName,
					},
				});
				return;
			}
			await prisma.memberShip.update({
				where: {
					memberId: newOwner.memberId,
				},
				data: {
					isOwner: true,
					isModerator: true,
				},
			});
		}
		await prisma.memberShip.deleteMany({
			where: {
				intraId,
				channelId: channelName,
			},
		});
	}

	async inviteChannel(ownerId: string, invitedId: string, channelId: string) {
		const channel = await prisma.channel.findUnique({
			where: {
				id: channelId,
			},
		});
		if (!channel) {
			throw 'no such channel';
		}
		const owner = await prisma.memberShip.findFirst({
			where: {
				channelId,
				intraId: ownerId,
				isOwner: true,
			},
		});
		if (!owner) {
			throw 'lack of previlige';
		}
		const member = await prisma.memberShip.findFirst({
			where: {
				intraId: invitedId,
				channelId,
			},
		});
		if (member) {
			if (member.onInviteState) {
				throw 'the invitation is already sent';
			} else {
				throw 'already on the channel';
			}
		}
		await this.createMember(invitedId, channel.name, channel.id, false, true);
	}

	async getInviteChannel(intraId: string) {
		return await prisma.memberShip.findMany({
			where: {
				intraId,
				onInviteState: true,
			},
		});
	}
	async updateInvite(intraId: string, channelName: string, status: boolean) {
		const memeber = await prisma.memberShip.findFirst({
			where: {
				intraId,
				channelId: channelName,
			},
		});
		if (!memeber) {
			throw 'no such invitation';
		}
		if (status) {
			await prisma.memberShip.update({
				where: {
					memberId: memeber.memberId,
				},
				data: {
					onInviteState: false,
				},
			});
		} else {
			await prisma.memberShip.delete({
				where: {
					memberId: memeber.memberId,
				},
			});
		}
	}
	async getBlockedUser(user: string) {
		return await prisma.friend.findMany({
			where: {
				OR: [
					{
						friendshipStatus: 'BLOCKED',
						friendId: user,
					},
					{
						friendshipStatus: 'BLOCKED',
						userId: user,
					},
				],
			},
		});
	}

	async getUserActiveChannels(intraId: string) {
		const memberShips = await prisma.memberShip.findMany({
			where: {
				intraId,
			},
		});

		const channels = await Promise.all(
			memberShips.map(async (memberShip) => {
				const channel = await prisma.channel.findUnique({
					where: {
						id: memberShip.channelId,
					},
					include: {
						messages: {
							orderBy: {
								createdAt: 'desc',
							},
							take: 1,
						},
					},
				});

				if (channel && channel.messages && channel.messages.length > 0) {
					return {
						id: channel.id,
						name: channel.name,
						latestMessage: channel.messages[0],
					};
				}

				return null;
			})
		);

		const filteredChannels = channels.filter((channel) => channel !== null);

		const sortedChannels = filteredChannels.sort(
			(a, b) =>
				b.latestMessage.createdAt.getTime() -
				a.latestMessage.createdAt.getTime()
		);

		return sortedChannels;
	}
	async getSerachedChan(query: string, intraId: string) {
		return await prisma.channel.findMany({
			take: 5,
			where: {
				type: {
					not: {
						equals: 'PRIVATE',
					},
				},
				members: {
					none: {
						intraId,
					},
				},
				name: {
					contains: query,
				},
			},
		});
	}

	async kickFromChannel(intraId: string, memberId: string, channelId: string) {
		const moderator = await prisma.memberShip.findFirst({
			where: {
				channelId,
				intraId,
			},
		});
		if (!moderator) {
			throw 'no such user';
		}
		if (!moderator.isModerator) {
			throw 'lack of privilige';
		}
		const member = await prisma.memberShip.findUnique({
			where: {
				memberId,
			},
		});
		if (!member) {
			throw 'no such member';
		}
		if (member.isOwner) {
			throw "you can't kick the owner";
		}

		await prisma.memberShip.delete({
			where: {
				memberId,
			},
		});
	}
}
