"use client"

import Counter from "@/components/Counter"
import { createClient } from "../../supabase/functions/client"
import { useRef, useState } from "react"

interface Message {
  type: null | string
  message: string
}

const RegisterPage = () => {

  const registerRef: React.MutableRefObject<HTMLFormElement | null> = useRef<HTMLFormElement>(null)
  const [message, setMessage] = useState<Message>({type: null, message: ''})
  const supabase = createClient()

  const register = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()

    if (!registerRef.current?.osoite.value || registerRef.current.osoite.value.length < 6) {
      setMessage({type: 'error', message: 'Sähköpostiosoitteen täytyy olla vähintään 6 merkkiä pitkä'})
      setTimeout(() => {
        setMessage({type: null, message: ''})
      }, 5000)
      return
    }

    if (!registerRef.current?.sls.value || registerRef.current.sls.value.length < 6) {
      setMessage({type: 'error', message: 'Salasanan täytyy olla vähintään 6 merkkiä pitkä'})
      setTimeout(() => {
        setMessage({type: null, message: ''})
      }, 5000)
      return
    } else if (registerRef.current.sls.value !== registerRef.current.slsConfirm.value) {
      setMessage({type: 'error', message: 'Salasanat eivät täsmää.'})
      setTimeout(() => {
        setMessage({type: null, message: ''})
      }, 5000)
      return
    }


    const { data, error } = await supabase.auth.signUp({
      email: registerRef.current.osoite.value,
      password: registerRef.current.sls.value
    })
    
    if (data.user) {
      setMessage({type: 'success', message: 'Sähköpostin vahvistus linkki lähetetty'})
      setTimeout(() => {
        setMessage({type: null, message: ''})
      }, 5000)
    } else {
      setMessage({type: 'error', message: `Tapahtui virhe: ${error?.message}`})
      setTimeout(() => {
        setMessage({type: null, message: ''})
      }, 5000)
    }
  }

  return (
    <div className="flex justify-center items-center w-full" style={{marginTop: '20vh'}}>
      <div className="w-96">  

        <form ref={registerRef} className="text-sm">
          <div className="mt-2">
            <label htmlFor='email'>Sähköpostiosoite</label>
            <input type="text" id="email" name="osoite" className="w-full rounded p-4 bg-zinc-700 focus:bg-zinc-900"/>
          </div>

          <div className="mt-2">
            <label htmlFor='password'>Salasana</label>
            <input type="password" id="password" name="sls" className="w-full rounded p-4 bg-zinc-700 focus:bg-zinc-900"/>
          </div>

          <div className="mt-2">
            <label htmlFor='passwordConfirm'>Vahvista salasana</label>
            <input type="password" id="passwordConfirm" name="slsConfirm" className="w-full rounded p-4 bg-zinc-700 focus:bg-zinc-900"/>
          </div>

          {(message.type) ?
            <div className={`w-full ${message.type === 'error' ? 'bg-red-700' : 'bg-green-600'} rounded p-4 mt-2`}>
              <p>{message.message}</p>
            </div>
          :
            null
          }
             
          <div className="mt-4">
            <button onClick={register} className="w-full rounded p-4 bg-indigo-700 hover:bg-indigo-800">Rekisteröidy</button>
          </div>
        </form>
      </div>

      <Counter page="rekisteröinti" key='rekisteröinti' />
    </div>
  )
}

export default RegisterPage