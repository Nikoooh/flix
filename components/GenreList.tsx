'use client'

import { usePathname } from "next/navigation"
import Link from "next/link"

const GenreList = ({ genreList }: { genreList: [] | string[] }) => {

  const pathname = usePathname()

  if (pathname === '/login' || pathname === '/reset-password' || pathname === '/register' || pathname === '/admin/login') return null

  return (
    <div className="hidden sm:block text-white">
      <h1 className="text-2xl w-fit whitespace-nowrap">Kaikki Genret</h1>
      <div>
        <ul className="list-disc ml-5 mt-5">
          {genreList.map((genre, idx) => {
            return (
              <Link key={idx} href={`/genre/${encodeURIComponent(genre.toLowerCase().replace(/-/g, '').replace(/ä/g, 'a').replace(/ö/g, 'o'))}/1`}>                   
                <li className="hover:underline">{genre}</li>
              </Link>
            )
          })}
        </ul>            
      </div>
    </div>
  )
}

export default GenreList