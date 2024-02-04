import { useDisclosure } from '@mantine/hooks';
import { useAppContext } from '../AppContext';
import { useState } from 'react';
import Cookies from 'universal-cookie';
import { Button, Modal, Select } from '@mantine/core';
import { FaUserEdit } from 'react-icons/fa';
import Image from 'next/image';

function addHoursToNow(hours: string) {
	const hoursToAdd = parseInt(hours, 10);
	const currentDate = new Date();
	currentDate.setHours(currentDate.getHours() + hoursToAdd);
	return currentDate;
}

const EditMemberShip = (props: any) => {
	const [opened, { open, close }] = useDisclosure(false);
	const context = useAppContext();
	const { member, currentMember } = props;
	const {
		memberId,
		intraId,
		channelId,
		Avatar,
		login,
		isOwner,
		isModerator,
		isBanned,
		isMuted,
		mutedTime,
		joined_at,
	} = member;
	const [ModeValue, setModeValue] = useState('');
	const [muteValue, setMuteValue] = useState('');
	const handleSubmit = () => {
		if (ModeValue || muteValue) {
			if (context.socket) {
				const cookie = new Cookies();
				const jwt = cookie.get('jwt');
				context.socket.emit('updateChannelUser', {
					jwt,
					memberId,
					info: {
						userPrivilige: ModeValue === 'moderator' ? true : false,
						banning: member.isBanned,
						Muting:
							member.isMuted && muteValue === 'UnMute'
								? { action: false, time: new Date() }
								: muteValue
								? { action: true, time: addHoursToNow(muteValue) }
								: { action: member.isMuted, time: addHoursToNow(muteValue) },
					},
				});
			}
		}
	};
	const dataMode = member.isModerator
		? [{ value: 'remove Moderator', label: 'remove moderator' }]
		: [{ value: 'moderator', label: 'moderator' }];
	const dataMute = member.isMuted
		? [{ value: 'UnMute', label: 'UnMute' }]
		: [
				{ value: '1', label: 'Mute for 1h' },
				{ value: '2', label: 'Mute for 2h' },
				{ value: '6', label: 'Mute for 6h' },
				{ value: '12', label: 'Mute for 12h' },
				{ value: '131651616516165167', label: 'until Unmute' },
		  ];
	return (
		<>
			<Modal
				opened={opened}
				withCloseButton={false}
				onClose={() => {
					setModeValue('');
					setMuteValue('');
					close();
				}}
				centered
			>
				<div className="p-2">
					<div className="flex flex-col justify-center items-center">
						<Image
							width={144}
							height={144}
							src={Avatar}
							alt="user avatar"
							className="w-10 sm:w-16 h-10 sm:h-16 rounded-full border"
							unoptimized={true}
							onError={(e: any) => {
								e.target.onerror = null;
								e.target.src =
									'http://m.gettywallpapers.com/wp-content/uploads/2023/05/Cool-Anime-Profile-Picture.jpg';
							}}
						/>
						<h1>{login}</h1>
					</div>
					<div className="change-privilege p-2">
						<Select
							data={dataMode}
							placeholder="change the user privilige "
							value={ModeValue ? ModeValue : ''}
							onChange={(_value: string | null) => {
								_value ? setModeValue(_value) : setMuteValue('');
							}}
						/>
					</div>
					<div className="muted p-2">
						<Select
							data={dataMute}
							placeholder="Mute or unmute the user"
							value={muteValue ? muteValue : ''}
							onChange={(_value: string | null) => {
								_value ? setMuteValue(_value) : setMuteValue('');
							}}
						/>
					</div>
					<div className="flex flex-col justify-center items-center ">
						<Button
							color="gray"
							onClick={() => {
								setModeValue('');
								setMuteValue('');
								close();
								handleSubmit();
							}}
						>
							{' '}
							submit{' '}
						</Button>
					</div>
				</div>
			</Modal>
			<FaUserEdit
				className="text-white w-6 h-6 transform transition-transform hover:scale-110"
				onClick={open}
			/>
		</>
	);
};

export default EditMemberShip;
