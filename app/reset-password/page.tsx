'use client'
import { createClient } from "../../supabase/functions/client"
import { useRef } from "react"

const ResetPasswordPage = () => {

  const emailRef: React.MutableRefObject<HTMLFormElement | null> = useRef<HTMLFormElement>(null)
  const supabase = createClient()

  const recoverMail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!emailRef.current?.osoite.value) return
    await supabase.auth.resetPasswordForEmail(emailRef.current.osoite.value, {
      redirectTo: 'http://localhost:3000/update-password'
    })
  }

  return (
    <div className="flex justify-center items-center w-full" style={{marginTop: '20vh'}}>
      <div className="w-96">  

        <form ref={emailRef} className="text-sm">
          <div className="mt-2">
            <label htmlFor='email'>Sähköpostiosoite</label>
            <input type="text" id="email" name="osoite" className="w-full rounded p-4 bg-zinc-700 focus:bg-zinc-900"/>
          </div>
             
          <div className="mt-4">
            <button onClick={recoverMail} className="w-full rounded p-4 bg-indigo-700 hover:bg-indigo-800">Lähetä linkki</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ResetPasswordPage