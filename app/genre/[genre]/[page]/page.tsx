import Counter from "@/components/Counter"
import { Elokuva, haeGenrenMukaan } from "@/lib/elokuvatiedot"
import { haeGenre } from "@/lib/genret"
import Link from "next/link"

interface Props {
  params: {
    genre: string,
    page: number
  },
  searchParams: { 
    sortBy: string, order: string 
  }
}

const GenrePage = async ({ params, searchParams }: Props): Promise<JSX.Element> => {

  const sortBy = searchParams?.sortBy || 'aika';
  const order = searchParams?.order || 'desc';

  const genre = await haeGenre(params.genre)
  
  if (!genre) return <>tapahtui virhe</>

  const elokuvat = await haeGenrenMukaan(genre)

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
      <div>
        <h1 className="text-3xl">{genre}</h1>
      </div>

      <div>
        <h1 className="font-medium text-2xl mt-1">Järjestä</h1>
        <div className="mt-4">
          <Link href={{pathname: `/genre/${params.genre}/${params.page}`, query: {sortBy: 'aakkos', order: order === 'asc' ? 'desc' : 'asc'}}}>
            <button className="bg-zinc-300 dark:bg-stone-600 rounded-lg px-5 py-2.5 me-2 mb-2">Aakkosjärjestys</button>
          </Link>
          <Link href={{pathname: `/genre/${params.genre}/${params.page}`, query: {sortBy: 'aika', order: order === 'asc' ? 'desc' : 'asc'}}}>
            <button  className="bg-zinc-300 dark:bg-stone-600 rounded-lg px-5 py-2.5 me-2 mb-2">Aikajärjestys</button>
          </Link> 
        </div>       
      </div>

      <div>
        <ul className="list-disc m-5">
          {elokuvat?.slice(((params.page - 1) * 20), params.page * 20).map((elokuva: Elokuva, idx) => {
            return (
              <Link key={idx} href={`/elokuva/${elokuva._id}`}>
                <li className="hover:underline">{elokuva.nimi}</li>
              </Link>            
            )     
          })}
        </ul>

        <div className="join">
          {Array.from({ length: 5 }, (_, i) => {
            const currentPage = Number(params.page);
            const pageNumber = currentPage >= 8 
              ? Math.min(10, 6 + i)  
              : currentPage <= 2 
                ? i + 1  
                : currentPage - 2 + i;  
          
            const isActive = pageNumber === currentPage;
            return (
              <Link key={pageNumber} href={`/genre/${params.genre}/${pageNumber}`}>
                <button className={`join-item btn ${isActive ? 'btn-active' : ''}`}>
                  {pageNumber}
                </button>
              </Link>
            );
          })}
        </div>
      </div>

      <Counter page="genre" key='genre'/>
    </div>
  )
}

export default GenrePage