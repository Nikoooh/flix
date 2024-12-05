import { createClient } from "../supabase/functions/server"
import Image from "next/image"
import Link from "next/link"

const Katselulista = async ({userId, listaId}: {userId: number, listaId: number})  => {

  const supabase = createClient()
  const { data } = await supabase.from('katselulista').select('*').eq('userId', userId).eq('listaId', listaId)

  if (!data || !data.length) {   
    return (
      <div>
        <p className="text-lg text-black dark:text-white">Elokuvia ei löydetty katselulistalta.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-row flex-wrap mt-6">
      {data.map((elokuva) => {
        return (
          <div key={elokuva.nimi} className="border-2 rounded border-stone-300 dark:border-stone-500 basis-1/2 lg:basis-1/4 p-4 ">
            <Image 
              className="rounded"
              src={`https://image.tmdb.org/t/p/w500/${elokuva.tmdbKuva}`} 
              height={500} 
              width={500} 
              alt={`Elokuvan ${elokuva.nimi} juliste`} 
            />
            <div className="text-center mt-4">             
              <Link href={`/elokuva/${elokuva.elokuvaId}`}>
                <p className="hover:underline text-xl">{`${elokuva.nimi || elokuva.alkuperaisNimi} (${elokuva.valmistusvuosi})`}</p>      
              </Link>
              <div className="flex gap-4 justify-center">      
                <p>{elokuva.genre}</p> 
                <p>{elokuva.valmistusvuosi}</p>              
              </div>
            </div>
          </div>
        )
      })} 
    </div>
  )
}

export default Katselulista