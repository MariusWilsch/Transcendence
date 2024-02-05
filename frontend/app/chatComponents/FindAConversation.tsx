import { useEffect, useState } from 'react';
import { User, useAppContext } from '../AppContext';
import Link from 'next/link';
import { Spotlight, spotlight } from '@mantine/spotlight';
import { Badge, Center, Group, Text } from '@mantine/core';
import Image from 'next/image';
import { CiSearch } from 'react-icons/ci';
import { searchUsers } from '../utiles/utiles';

function FindAConversation() {
	const [query, setQuery] = useState('');
	const [data, setData] = useState<User[] | undefined>();
	const context = useAppContext();
	const roomIdExtractor = (user1: string, user2: string) => {
		return parseInt(user1) > parseInt(user2) ? user1 + user2 : user2 + user1;
	};
	useEffect(() => {
		const fetchData = async () => {
			const data = await searchUsers(query);
			data !== undefined ? setData(data) : setData([]);
		};
		if (query) {
			fetchData();
		}
	}, [query]);
	const items =
		data !== undefined
			? data?.map((item: User) => (
					<Link
						key={item.intraId}
						href={`${process.env.NEXT_PUBLIC_API_URL}:3000/chat/${roomIdExtractor(
							context.userData?.intraId,
							item.intraId,
						)}`}
					>
						<Spotlight.Action
							key={item.intraId}
							onClick={() => {
								item.intraId != context.userData?.intraId
									? context.setRecipientLogin(item.intraId)
									: 1;
								context.setComponent('conversation');
							}}
						>
							<Group wrap="nowrap" w="100%">
								{item.Avatar && (
									<Center>
										<Image
											src={item.Avatar}
											alt={item.login}
											width={50}
											height={50}
											className="w-16 h-16 rounded-full p-2"
											unoptimized={true}
											onError={(e: any) => {
												e.target.onerror = null;
												e.target.src =
													'http://m.gettywallpapers.com/wp-content/uploads/2023/05/Cool-Anime-Profile-Picture.jpg';
											}}
										/>
									</Center>
								)}

								<div style={{ flex: 1 }}>
									<Text>{item.fullname}</Text>

									{item.login && (
										<Text opacity={0.6} size="xs">
											{item.login}
										</Text>
									)}
								</div>
								<Badge className="ml-auto" variant="default">
									{item.status}
								</Badge>
							</Group>
						</Spotlight.Action>
					</Link>
			  ))
			: undefined;

	return (
		<>
			<div onClick={()=>{
				(context.userData &&  spotlight.open());
			}
			}
			className="relative text-sm ">
				<input
					type="text"
					value={'search or start a new conversation'}
					className="w-full px-2 py-2 border rounded-md focus:outline-none focus:border-slate-600 bg-slate-800"
					readOnly
				/>
			</div>
			<div className="max-w-545 mx-auto bg-black">
				<Spotlight.Root query={query} onQueryChange={setQuery}>
					<Spotlight.Search
						placeholder="Search by username..."
						leftSection={<CiSearch stroke={"1.5"} />}
					/>
					<Spotlight.ActionsList>
						{ data !== undefined && data.length > 0 ? (
							<div className="flex flex-col">{items}</div>
						) : (
							<Spotlight.Empty>Nothing found...</Spotlight.Empty>
						)}
					</Spotlight.ActionsList>
				</Spotlight.Root>
			</div>
		</>
	);
}

export default FindAConversation;
