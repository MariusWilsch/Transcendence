import { Button, Modal, ModalBody } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IoMdAdd } from 'react-icons/io';
import { useEffect, useState } from 'react';
import { User, useAppContext } from '../AppContext';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { searchUsers } from '../utiles/utiles';
import { FcInvite } from 'react-icons/fc';
import Image from 'next/image';

async function inviteUser(
	Channelname: string,
	invitedUser: string,
	owner: User,
) {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}:3001/chat/inviteToChannel/${owner.intraId}/${Channelname}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify({
					invitedId: `${invitedUser}`,
				}),
			},
		);
		if (response.ok) {
			const msg = 'invitation Sent';
			const res = await response.json();
			toast.success(res.error);
		} else {
			const msg = 'Error: ' + response;
			toast.error(msg);
		}
	} catch (e) {
		const msg = 'Error' + e;
		toast.error(msg);
	}
}
const InviteUsers = () => {
	const [opened, { open, close }] = useDisclosure(false);
	const [query, setQuery] = useState('');
	const [users, setUsers] = useState<User[] | []>([]);
	const context = useAppContext();

	const handleSubmit = () => {
		setUsers([]);
		close();
	};
	const handleQuery = (event: any) => {
		event.preventDefault(); // Fix the typo here
		setQuery(event.target.value);
	};
	const inviteAUser = (invitedId: string) => {
		if (context.channel && context.userData) {
			inviteUser(context.channel.id, invitedId, context.userData);
			handleSubmit();
		} else {
			toast.error('you should enter atleast the name of your channel');
		}
	};
	useEffect(() => {
		const search = async () => {
			if (context.channel) {
				const data = await searchUsers(query);
				setUsers(data);
			}
		};
		if (query) {
			search();
		}
	}, [query]);
	useEffect(() => {}, [context.userData]);
	return (
		<>
			<Modal opened={opened} withCloseButton={false} onClose={close} centered>
				<div className="p-2 flex flex-col space-y-4">
					<div className="searchBar">
						<label className="">
							<input
								id="searchField"
								name={`inputValue${Math.random()}`}
								type="text"
								value={query}
								placeholder="invite a user to your channel ..."
								onChange={handleQuery}
								className="  bg-[#1E2028] w-full items-center justify-center p-2 rounded-lg border border-[#292D39]   text-sm outline-none text-white"
							/>
						</label>
					</div>
					<div className="invited-Users flex flex-col p-4 space-y-4 ">
						{users &&
							users.map((user: User) => (
								<div key={user.intraId} className="flex flex-row  ml-0">
									<Image
										width={50}
										height={50}
										src={user?.Avatar}
										alt="My profile"
										className="w-10 sm:w-10 h-10 sm:h-10 rounded-full"
										unoptimized={true}
										onError={(e: any) => {
											e.target.onerror = null;
											e.target.src =
												'http://m.gettywallpapers.com/wp-content/uploads/2023/05/Cool-Anime-Profile-Picture.jpg';
										}}
									/>
									<span className="p-2 text-white text-center">{user?.login}</span>
									<button
										className="ml-auto bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
										onClick={() => {
											inviteAUser(user.intraId);
										}}
									>
										Invite
									</button>
								</div>
							))}
					</div>
				</div>
			</Modal>
			<div className="flex flex-row   justify-center space-x-3 text-white">
				<FcInvite
					className="text-white hover:scale-125"
					onClick={() => {
						open();
					}}
				/>
				{/* <Button color={'violet'} className="rounded"
          onClick={open}
        >
          + Add a channel
        </Button> */}
			</div>
		</>
	);
};

export default InviteUsers;
