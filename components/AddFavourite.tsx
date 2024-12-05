'use client'

import { Elokuva } from "@/lib/elokuvatiedot"
import { createClient } from "../supabase/functions/client"
import { User } from "@supabase/supabase-js"
import { useEffect, useState } from "react"

interface Movie {
  nimi: string
  alkuperaisNimi: string
  valmistusvuosi: number
  tmdbKuva: string
  elokuvaId: string
  genre: string
  userId: string
  created_at: string
}

interface Lists {
  created_at: string
  id:  number
  nimi: string
  userId: string
}

const AddFavourite = ({elokuva}: {elokuva: Elokuva}) => {

  const [user, setUser] = useState<User | null>(null)
  const [lists,  setLists] = useState<Lists[] | null>(null)
  const [added, setAdded] = useState<boolean>(false)

  const supabase = createClient()
  
  const addToFavourites = async (id: number): Promise<void> => { 
    if (!user) return   
    await supabase.from('katselulista').insert(
      [{
        nimi: elokuva.nimi,
        alkuperaisNimi: elokuva.alkuperainennimi,
        valmistusvuosi: elokuva.valmistumisvuosi,
        tmdbKuva: elokuva.tmdbkuva,
        elokuvaId: elokuva._id.toString(),
        genre: elokuva.genre[0],
        userId: user.id,
        listaId: id
      }]   
    )  
  }

  const deleteFavourite = async () => {
    if (!user) return
    await supabase.from('katselulista').delete().eq('userId', user.id).eq('elokuvaId', elokuva._id.toString())
  }

  useEffect(() => {
    const fetchData = async () => {
      const { data: authData, error: authError } = await supabase.auth.getUser()

      if (authError || !authData) return
      setUser(authData.user);

      const { data: katselulista, error: listaError } = await supabase
        .from('katselulista')
        .select('*')
        .eq('userId', authData.user.id)   

      const { data: katselulistat } = await supabase.from('katselulistat').select('*').eq('userId', authData.user.id)
      setLists(katselulistat)

      if (!listaError && katselulista) {
        const added = katselulista.some((movie: Movie) => movie.elokuvaId === elokuva._id.toString() && movie.userId === authData.user.id)
        setAdded(added)
      }    
    }
    fetchData()
  }, [])

  if (added) {
    return (
      <button className="px-5 bg-red-600 rounded-lg mr-4" onClick={deleteFavourite}>
        <div className="flex flex-row gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
          </svg>
          <p>
            Poista katselulistalta
          </p> 
        </div>          
      </button>
    )
  }
  
  return (
    <div className="dropdown dropdown-end dark:text-white">
      <div tabIndex={0} role="button">
        <button className="px-5 py-3 bg-amber-600 rounded-lg mr-4">
          <div className="flex flex-row gap-2">   
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <p>
              Lisää katselulistaan
            </p>
          </div>     
        </button>
      </div>
      <ul tabIndex={0} className="menu dropdown-content bg-zinc-200 dark:bg-slate-900 rounded-box z-[1] mt-4 w-52 p-2 shadow">
        {lists?.map((lista)  => {
          return (
            <div key={lista.id} className="py-2 px-1 hover:text-slate-100">
              <li className="cursor-pointer" onClick={() => addToFavourites(lista.id)}>{lista.nimi}</li>
            </div>
            
          )
        })}
      </ul>
    </div>
  )
}

export default AddFavourite