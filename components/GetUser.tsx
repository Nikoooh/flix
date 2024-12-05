import { useEffect } from "react"
import { createClient } from "../supabase/functions/client"
import { CurrentUser } from "./Header"

const GetUser = ({setUser}: {setUser: React.Dispatch<React.SetStateAction<CurrentUser | null>>}) => {
  const supabase = createClient()
  
  const fetch = async () => {
    const { data } = await supabase.auth.getUser()
    if (data && data.user)
    setUser({id: data.user.id, email: data.user.email || 'undefined'});
  }

  useEffect(() => {
    fetch()
  }, [])
  
  return (
    null
  )
}

export default GetUser