'use client'

import { useState } from "react"
import { useRef } from "react"
import { createClient } from "../../supabase/functions/client"
import { useRouter } from 'next/navigation'
import Image from "next/image"
import Link from "next/link"
import { checkAdmin } from "@/lib/admin"
import Counter from "@/components/Counter"

const LoginPage = () => {

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

    if (!isAdmin) {
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
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
    } else {
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
          <Image src="/xamk_punainen.png" alt="xamk logo" width={300} height={300} className="mb-8 w-80 h-auto"/>
        </div>

        <form ref={loginRef} className="text-sm">
          <div className="mt-2">
            <label htmlFor='tunnus'>Käyttäjätunnus</label>
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
            <Link href='/reset-password'>
              <p className="hover:text-slate-200 hover:cursor-pointer">Unohditko salasanan?</p>
            </Link>
            <button onClick={kirjaudu} className="w-full rounded p-4 bg-indigo-700 hover:bg-indigo-800">Kirjaudu sisään</button>
            <Link href='/register'>
              <button className="w-full rounded p-4 bg-stone-600 hover:bg-stone-700 mt-2">Rekisteröidy</button>
            </Link>     
          </div>
        </form>
      </div>

      <Counter page="kirjautuminen" key='kirjautuminen'/>
    </div>
  )
}

export default LoginPage