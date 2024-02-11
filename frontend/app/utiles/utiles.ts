import { Channel, ChannelMessage, MemberShip, Room } from '../AppContext';

export async function searchUsers(query: string) {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}:3001/chat/search?q=${query}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
			},
		);

		const data = await response.json();
		return data;
	} catch (e) {
		// console.log(e);
	}
}

export async function searchMember(query: string, channelId: string) {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}:3001/chat/chan/${channelId}/Search?q=${query}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
			},
		);

		const data = await response.json();
		return data;
	} catch (e) {
		// console.log(e);
	}
}

export async function getChannelFirstMembers(
	channelId: string,
): Promise<MemberShip[] | []> {
	try {
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}:3001/chat/chanAvatar/${channelId}`,
			{
				method: 'GET',
				credentials: 'include',
			},
		);
		if (!res.ok) {
			return [];
		}
		const members = res.json();

		return members;
	} catch (e) {
		// console.log(e);
		return [];
	}
}

export async function getChannel(
	channelId: string,
): Promise<Channel | undefined> {
	try {
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}:3001/chat/channel/${channelId}`,
			{
				method: 'GET',
				credentials: 'include',
			},
		);
		if (!res.ok) {
			return undefined;
		}
		const channel = res.json();

		return channel;
	} catch (e) {
		// console.log(e);
	}
}

export async function getCurrentMember(
	channelId: string,
	intraId: string,
): Promise<MemberShip | undefined> {
	try {
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}:3001/chat/chanMember/${channelId}/${intraId}`,
			{
				method: 'GET',
				credentials: 'include',
			},
		);
		if (!res.ok) {
			return undefined;
		}
		const channel = res.json();

		return channel;
	} catch (e) {
		// console.log(e);
	}
}

export async function getChannelMessages(
	channelId: string,
	userId: string | undefined,
): Promise<ChannelMessage[] | []> {
	try {
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}:3001/chat/channels/messages/${channelId}`,
			{
				method: 'GET',
				credentials: 'include',
			},
		);
		// if (!res.ok){
		//   return [];
		// }
		const messages = res.json();

		return messages;
	} catch (e) {
		// console.log(e);
		return [];
	}
}

export async function getMessages(userId: string, page: number): Promise<any> {
	try {
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}:3001/chat/${userId}/messages?page=${page}`,
			{
				method: 'GET',
				credentials: 'include',
			},
		);
		const room = res.json();

		return room;
	} catch (e) {
		// console.log(e);
	}
}

export async function getCurrentUser(): Promise<any> {
	try {
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:3001/auth/user`, {
			method: 'GET',
			credentials: 'include',
		});
		if (!res.ok) {
			return undefined;
		}
		var data = await res.json();
		if (data.succes === false) {
			return;
		}
		if (data.data !== null && data.data !== undefined) {
			return data.data;
		}
		return;
	} catch (e) {
		// console.log(e);
	}
}

export async function getUser(intraId: string): Promise<any> {
	try {
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}:3001/users/${intraId}`,
			{
				method: 'GET',
				credentials: 'include',
			},
		);
		if (!res.ok) {
			return undefined;
		}
		var data = await res.json();
		if (data.succes === false) {
			return;
		}
		if (data.data !== null && data.data !== undefined) {
			return data.data;
		}
		return;
	} catch (e) {
		// console.log(e);
	}
}

export async function getUserFriends(intraId: string): Promise<any> {
	try {
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}:3001/users/${intraId}/friends`,
			{
				method: 'GET',
				credentials: 'include',
			},
		);
		const friends = res.json();
		return friends;
	} catch (e) {
		// console.log(e);
	}
}

export async function getRooms(userId: string): Promise<Room[] | undefined> {
	try {
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}:3001/chat/${userId}/privateRooms/`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
			},
		);
		if (!res.ok) {
			return undefined;
		}

		const room = await res.json();

		// // console.log(room)
		return room;
	} catch (e) {
		// console.log(e);
	}
}
