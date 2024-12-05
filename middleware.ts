import { NextRequest, NextResponse } from "next/server";
import { createClient } from "./supabase/functions/server";

export const config = {
  matcher: [
    '/((?!_next|login|reset-password|register|admin/login|api).*)'
  ] 
}

export const middleware = async (req: NextRequest) => {

  const res: NextResponse = NextResponse.next();
  const { pathname } = req.nextUrl;

  const supabase = createClient();

  const { data } = await supabase.auth.getSession();

  if (!data.session) {
    const loginUrl = req.nextUrl.clone()
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl)
  } 

  if (pathname.startsWith("/admin/user-control")) {
    const { data: userData } = await supabase.auth.getUser()
    if (userData.user?.user_metadata.role === 'admin') {
      return res
    } else {
      const homeUrl = req.nextUrl.clone();
      homeUrl.pathname = "/";
      return NextResponse.redirect(homeUrl)
    }
  }

  return res
  
}