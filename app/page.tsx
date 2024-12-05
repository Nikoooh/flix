import { haeElokuvat, Elokuva } from "@/lib/elokuvatiedot";
import Link from "next/link";
import Image from "next/image";
import Carousel from "@/components/Carousel";

interface Props {
  searchParams: { 
    sortBy: string, order: string 
  }
}

const HomePage = async ({ searchParams }: Props): Promise<JSX.Element> => {

  const sortBy = searchParams?.sortBy || 'aika';
  const order = searchParams?.order || 'desc';

  const elokuvat: Elokuva[] | [] = await haeElokuvat()

  if (sortBy === "aakkos") {
    elokuvat.sort((a, b) => 
      (order === "asc" ? a.nimi.localeCompare(b.nimi) : b.nimi.localeCompare(a.nimi))
    );
  } else if (sortBy === "aika") {
    elokuvat.sort((a, b) => 
      (order === "asc" ? a._id.toString().localeCompare(b._id.toString()) : b._id.toString().localeCompare(a._id.toString()))
    );
  }

  return (
    <div>
           
      <Carousel />
         
      <div> 
        <h1 className="text-4xl">Elokuvat</h1>
      </div>

      <div>
        <h1 className="font-medium text-2xl mt-4 mb-2">Järjestä</h1>
        <Link href={{pathname: '/', query: {sortBy: 'aakkos', order: order === 'asc' ? 'desc' : 'asc'}}}>
          <button className="bg-zinc-300 dark:bg-stone-600 rounded-lg px-5 py-2.5 me-2 mb-2 mr4">Aakkosjärjestys</button>
        </Link>
        <Link href={{pathname: '/', query: {sortOrder: 'aika', order: order === 'asc' ? 'desc' : 'asc'}}}>
          <button className="bg-zinc-300 dark:bg-stone-600 rounded-lg px-5 py-2.5 me-2 mb-2 mr4">Aikajärjestys</button>
        </Link>        
      </div>  
      
      <div className="flex flex-row flex-wrap">       
        {elokuvat.map((elokuva: Elokuva) => {
          return (
            <div key={elokuva.nimi} className="border-2 rounded border-stone-300 dark:border-stone-500 basis-1/2 lg:basis-1/4 flex-grow p-4 ">
              <Image 
                className="rounded"
                src={`https://image.tmdb.org/t/p/w500/${elokuva.tmdbkuva}`} 
                height={500} 
                width={500} 
                alt={`Elokuvan ${elokuva.nimi} juliste`} 
              />
              <div className="text-center mt-4">             
                <Link href={`/elokuva/${elokuva._id}`}>
                  <p className="hover:underline text-xl">{`${elokuva.nimi || elokuva.alkuperainennimi} (${elokuva.valmistumisvuosi})`}</p>      
                </Link>
                <div className="flex gap-4 justify-center">      
                  <p>{elokuva.genre[0]}</p> 
                  <p>{elokuva.valmistumisvuosi}</p>              
                </div>
              </div>
            </div>
          )
        })}  
      </div>     
    </div>
  );
}

export default HomePage
