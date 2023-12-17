import { NextResponse, NextRequest } from 'next/server'
import { verify, JsonWebTokenError, NotBeforeError, TokenExpiredError } from 'jsonwebtoken';


export default async function middleware(req: NextRequest, res: NextResponse) {
    const path = req.nextUrl.pathname;

    const hasToken = req.cookies.has("jwt");

    const cookie = req.cookies.get("jwt");

    if (hasToken && cookie) {
        //console.log("this user has a token .");
      } else {
        //console.log("this user does not a token .");
    }
}
