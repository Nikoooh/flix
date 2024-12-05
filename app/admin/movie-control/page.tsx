import Link from "next/link"

const MovieControlPage = () => {
  return (
    <div>
      <div className="flex flex-col gap-6">    
        <div> 
          <Link href={'./movie-control/create'}>
            <button className="btn dark:bg-stone-950 hover:none w-fit">
              Lisää elokuva tietokantaan
            </button>
          </Link>        
        </div>
        <div> 
          <Link href={'./movie-control/edit'}>
            <button className="btn dark:bg-stone-950 hover:none w-fit">
              Tietojen muokkaus ja poisto
            </button>
          </Link>  
        </div>
      </div>
    </div>
  )
}

export default MovieControlPage