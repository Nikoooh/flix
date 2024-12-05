"use client"

import { useEffect, useState } from "react"
import { User } from "@supabase/supabase-js"
import Link from "next/link"

const UserList = ({userlist}: {userlist: User[]}) => {
  const [users, setUsers] = useState<User[] | null>(null)
  const [dir, setDir] = useState(true)

  useEffect(() => {
    setUsers(userlist)
  }, [])

  if (!users) return null

  return (
    <div>
      <div>
        <p className="text-lg mb-2 cursor-pointer bg-zinc-700 w-fit py-2 px-6 rounded-md transition-colors duration-300 ease-in-out hover:bg-zinc-800" onClick={
          () => {
            dir ? 
              setUsers([...users].sort((a, b) => (a.email ?? "").localeCompare(b.email ?? ""))) 
            : setUsers([...users].sort((a, b) => (b.email ?? "").localeCompare(a.email ?? "")))
            setDir(!dir)
          }
        }>
          Järjestä
        </p>
      </div>
      <div>
        {users.map((user: User) => {
          return (
            <Link key={user.id} href={`user-control/${user.id}`}>       
              <div className="border-b-2 border-stone-600 border-opacity-30 py-4 px-2 cursor-pointer transition-colors duration-300 ease-in-out hover:text-zinc-400">
                <p>{user.email}</p>
              </div>
            </Link>
          )
        })} 
      </div>
    </div>
  )
}

export default UserList