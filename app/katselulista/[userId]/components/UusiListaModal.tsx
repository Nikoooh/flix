'use client'

import { createClient } from "../../../../supabase/functions/client"
import { useState } from "react"

interface Props {
  userId: string
}

const UusiListaModal = ({userId}: Props) => {

  const [lista, setLista] = useState<string>('')
  const supabase = createClient()

  const handleNew = async (): Promise<void> => {
    await supabase.from('katselulistat').insert([{nimi: lista, userId: userId}]);
  }

  return (
    <div>
      <button className="btn dark:bg-slate-900 bg-zinc-300 text-black dark:text-stone-400" onClick={()=> {
        const modal = document.getElementById('listaModal') as HTMLDialogElement | null
        if (modal) modal.showModal()  
      }}>
        Luo uusi katselulista
      </button>
      <dialog id="listaModal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-xl">Luo uusi katselulista</h3>
          <input className="mt-4 p-2 rounded-md w-full" value={lista} onChange={({target}) => setLista(target.value)} placeholder="komediaa"/>
          <div className="mt-4 flex flex-row gap-2">          
            <button className="btn" onClick={handleNew}>Luo uusi katselulista</button>
            <button className="btn" onClick={() => {
              const modal = document.getElementById('listaModal') as HTMLDialogElement | null
              if (modal) modal.close() 
            }}>
              Sulje
            </button>        
          </div>
        </div>
      </dialog>
    </div>
  )
}

export default UusiListaModal