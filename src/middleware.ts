import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  let verify = req.cookies.get("mapper-jwt")
  let url = req.url
  
  if (!verify && url.includes("/app")) {
    return NextResponse.redirect(`${process.env.MY_SITE}/login`)
  }

  if (!verify && url === `${process.env.MY_SITE}/`) {
    return NextResponse.redirect(`${process.env.MY_SITE}/login`)
  }

  if (verify && url === `${process.env.MY_SITE}/`) {
    return NextResponse.redirect(`${process.env.MY_SITE}/app`)
  }
}