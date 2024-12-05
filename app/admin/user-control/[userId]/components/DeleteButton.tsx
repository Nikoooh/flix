"use client"

import { deleteUser } from "@/lib/admin"
import { useRouter } from "next/navigation"

const DeleteButton = ({userId}: {userId: string}) => {

  const router = useRouter()

  const handleDelete = async () => {
    const confirm = window.confirm('Varmista käyttäjän poisto')
    if (confirm) {
      await deleteUser(userId)
      router.push('/admin/user-control')
    }
  }

  return (
    <div>
      <button className="btn bg-rose-600 text-zinc-100 px-8 border-1 border-red-800 hover:bg-rose-700 hover:border-red-800" onClick={handleDelete}>Poista käyttäjä</button>
    </div>
  )
}

export default DeleteButton