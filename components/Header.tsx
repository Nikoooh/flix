"use client"

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "../supabase/functions/client";
import GetUser from "./GetUser";

export interface CurrentUser {
  id: string,
  email: string
}

const Header = ({ genreList }: { genreList: [] | string[] }) => {
  
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<CurrentUser | null>(null)
  const supabase = createClient()

  if (pathname === '/login' || pathname === '/reset-password' || pathname === '/register' || pathname === '/admin/login') return null

  const signOut = async () => {
    const {error} = await supabase.auth.signOut()
    if (!error) router.push('/login')
    console.log(error); 
  }
  
  return (
    <div className="p-6 mb-4 flex flex-row gap-8">
      <GetUser setUser={setUser}/>
      <div className="drawer sm:hidden w-fit">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <label htmlFor="my-drawer" className="btn bg-zinc-400 border-zinc-500 bg-opacity-60 drawer-button">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </label>
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
          <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
            <h1 className="text-2xl w-fit whitespace-nowrap underline mb-4">Genret</h1>
            {genreList.map((genre, idx) => (
              <Link
                key={idx}
                href={`/genre/${encodeURIComponent(genre.toLowerCase().replace(/-/g, '').replace(/ä/g, 'a').replace(/ö/g, 'o'))}`}
              >
                <li className="hover:underline">{genre}</li>
              </Link>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex basis-1/2 flex-grow">
        <Image src="/xamk_punainen.png" width={300} height={100} alt="Xamkflix logo" className="object-contain w-80 h-auto cursor-pointer" priority onClick={() => router.push('/')}/>
      </div>
     
      <div className="dropdown dropdown-end dark:text-white">
        <div tabIndex={0} role="button" className="btn btn-ghost rounded-btn">
          <Image src='/header/profile-icon.png' alt="profile picture" width={38} height={30} className="w-10 h-auto"/>
        </div>
        <ul
          tabIndex={0}
          className="menu dropdown-content bg-zinc-200 dark:bg-slate-900 rounded-box z-[1] mt-4 w-52 p-2 shadow">
          <li><a>{user && user.email}</a></li>
          <li><Link href={`/katselulista/${user && user.id}`}>Katselulista</Link></li>
          <li><Link href={`/update-password`}>Vaihda salasana</Link></li>
          <li onClick={() => signOut()}><a>Kirjaudu ulos</a></li>
        </ul>
      </div>
    </div>
  );
};

export default Header;