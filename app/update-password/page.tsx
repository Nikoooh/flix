'use client'
import { createClient } from "../../supabase/functions/client"
import { useRef, useState } from "react"

interface Message {
  type: null | string
  message: string
}

const PasswordUpdatePage = () => {

  const passwordUpdateRef: React.MutableRefObject<HTMLFormElement | null> = useRef<HTMLFormElement>(null)
  const supabase = createClient()
  const [message, setMessage] = useState<Message>({type: null, message: ''})

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!passwordUpdateRef.current?.salasana.value || passwordUpdateRef.current.salasana.value.length <= 5) {
      setMessage({type: 'error', message: 'Salasanan täytyy olla vähintään 6 merkkiä pitkä'})
      setTimeout(() => {
        setMessage({type: null, message: ''})
      }, 5000)
      return
    }
    
    const { data, error } = await supabase.auth.updateUser({ password: passwordUpdateRef.current.salasana.value })

    if (data.user) {

      setMessage({type: 'success', message: 'Salasanan vaihto onnistui'})
      setTimeout(() => {
        setMessage({type: null, message: ''})
      }, 5000)    
      return

    } else if (error) {

      setMessage({type: 'error', message: error.message})
      setTimeout(() => {
        setMessage({type: null, message: ''})
      }, 5000)
      return

    }
  }

  return (
    <div className="flex justify-center items-center w-full" style={{marginTop: '20vh'}}>
      <div className="w-96">  
        <form ref={passwordUpdateRef} className="text-sm">
          <div className="mt-2">      
            <label className="text-lg" htmlFor='sls'>Uusi salsana</label>
            <input type="password" id="sls" name="salasana" className="w-full rounded p-4 bg-zinc-700 focus:bg-zinc-900"/>
          </div>

          {(message.type) ?
            <div className={`w-full ${message.type === 'error' ? 'bg-red-700' : 'bg-green-600'} rounded p-4 mt-2`}>
              <p>{message.message}</p>
            </div>
          :
            null
          }
                 
          <div className="mt-4">
            <button onClick={changePassword} className="w-full rounded p-4 bg-indigo-700 hover:bg-indigo-800">Päivitä salasana</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PasswordUpdatePage