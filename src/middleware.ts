import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  let verify = req.cookies.get("mapper-jwt")
  let url = req.url
  console.log(url)
  console.log(verify)
  if (!verify && url.includes("/mapper")) {
    return NextResponse.redirect(`${process.env.MY_SITE}/login`)
  }

  if (verify && url === `${process.env.MY_SITE}/`) {
    return NextResponse.redirect(`${process.env.MY_SITE}/mapper`)
  }
}