import { NextResponse, NextRequest } from 'next/server';

export default async function middleware(req: NextRequest, res: NextResponse) {
	const cookie = req.cookies.get('jwt');

	if (cookie) {
		// // console.log("this user has a token .");
	} else {
		// // console.log("this user does not a token .");
	}
}
