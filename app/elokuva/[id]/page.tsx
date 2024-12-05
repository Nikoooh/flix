import { getCast, getOverview, haeElokuva } from "@/lib/elokuvatiedot"
import Image from "next/image"
import Link from "next/link"
import DescriptionModal from "@/components/DescriptionModal"
import AddFavourite from "@/components/AddFavourite"
import Counter from "@/components/Counter"

interface Props {
  params: {
    id: string
  }
}

const ElokuvaPage = async ({ params }: Props): Promise<JSX.Element> => {
  
  const elokuva = await haeElokuva(params.id)

  if (!elokuva) return <p className="text-red-500">Tapahtui virhe</p>

  const cast = await getCast(elokuva.tmdbid)
  const kuvaus = await getOverview(elokuva.tmdbid)

  return (
    <div className="p-2 w-full">
      <div className="flex flex-col sm:flex-row sm:justify-start gap-8">
        <div className="w-fit">
          {elokuva.tmdbkuva && (
            <Image 
              src={`https://image.tmdb.org/t/p/w500/${elokuva.tmdbkuva}`} 
              width={400} 
              height={400} 
              alt={`${elokuva.nimi} juliste`} 
              className="rounded-lg shadow-lg"
            />
          )}
        </div>
        <div className="sm:w-3/6">
          <div className="mb-2">
            <p className="font-bold text-3xl">
              {elokuva.nimi}
            </p>
            <p className="text-xl">
              {`${elokuva.nimi !== elokuva.alkuperainennimi ? `(${elokuva.alkuperainennimi})` : ''}`}
            </p>
          </div>

          <DescriptionModal kuvaus={kuvaus}/>
          
          <div className="text-md mt-4">
            <p className="mt-4">Genre: {elokuva.genre.join(', ')}</p>
            <p className="mt-4">Julkaistu: {elokuva.valmistumisvuosi}</p>
            <p className="mt-4">Kesto: {elokuva.kestomin} minuuttia</p>          
            <p className="mt-4">{cast.join(', ')}</p>
            <p className="mt-4">Ohjaaja(-t): {elokuva.ohjaaja.join(', ')}</p>
          </div>

          <div className="mt-12 w-full flex flex-row">   
            <AddFavourite elokuva={{...elokuva, _id: elokuva._id.toString()}}/>
            <Link href={`/`}>           
              <button className="bg-zinc-300 dark:bg-stone-600 rounded-lg px-5 py-3 me-2 mb-2">Palaa listaukseen</button>  
            </Link>          
          </div>        
        </div>
      </div>

      <Counter page="elokuva" key='elokuva'/>
    </div>
  )
}

export default ElokuvaPage