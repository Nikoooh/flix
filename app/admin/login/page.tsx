"use client"

import { useState } from "react"
import { useRef } from "react"
import { createClient } from "../../../supabase/functions/client"
import { useRouter } from 'next/navigation'
import { checkAdmin } from '@/lib/admin'
import Image from "next/image"

const AdminLoginPage = () => {
  const [error, setError] = useState<string>('')

  const loginRef: React.MutableRefObject<HTMLFormElement | null> = useRef<HTMLFormElement>(null)
  const router = useRouter()
  const supabase = createClient()

  const kirjaudu = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginRef.current?.tunnus.value || !loginRef.current?.salasana.value) {
      setError('Täyty kaikki tiedot')
      setTimeout(() => {
        setError('')
      }, 5000)   

      return
      
    }

    const email = loginRef.current.tunnus.value;
    const { isAdmin } = await checkAdmin(email)

    if (isAdmin) {
      const {error} = await supabase.auth.signInWithPassword({
        email: loginRef.current.tunnus.value,
        password: loginRef.current.salasana.value
      })
    
      if (!error) {
        router.push('/')
      } else {
        setError('Virheellinen käyttäjätunnus tai salasana. Tarkista tiedot ja yritä uudelleen.')
        setTimeout(() => {
          setError('')
        }, 5000)      
      }
    }  else {
      setError('Virheellinen käyttäjätunnus tai salasana. Tarkista tiedot ja yritä uudelleen.')
      setTimeout(() => {
        setError('')
      }, 5000)    
    }    
  }

  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
      const user = session?.user
      if (user) {
        router.push('/update-password')
      } 
    }
  })

  return (
    <div className="flex justify-center items-center w-full" style={{marginTop: '20vh'}}>
      <div className="w-96">  
        <div className="flex justify-center">     
          <Image src="/xamk_punainen.png" alt="xamk logo" width={300} height={300} className="mb-8"/>
        </div>

        <form ref={loginRef} className="text-sm">
          <div className="mt-2">
            <label htmlFor='tunnus'>Admin käyttäjätunnus</label>
            <input type="text" id="tunnus" name="tunnus" className="w-full rounded p-4 bg-zinc-700 focus:bg-zinc-900"/>
          </div>
          <div className="mt-2">      
            <label htmlFor='sls'>Salasana</label>
            <input type="password" id="sls" name="salasana" className="w-full rounded p-4 bg-zinc-700 focus:bg-zinc-900"/>
          </div>

          {(error.length) ?
            <div className="w-full bg-red-700 rounded p-4 mt-2">
              <p>{error}</p>
            </div>
          :
            null
          }
                 
          <div className="mt-4">
            <button onClick={kirjaudu} className="w-full rounded p-4 bg-indigo-700 hover:bg-indigo-800">Kirjaudu sisään</button> 
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminLoginPage