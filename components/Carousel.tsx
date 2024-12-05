import { createClient } from "../supabase/functions/server";

interface Backdrop {
  aspect_ratio: number
  height: number
  iso_639_1: boolean
  file_path: string
  vote_average: number
  vote_count: number
  width: number
}

const Carousel = async () => {

  const supabase = createClient()

  const { data } = await supabase.from('nostot').select()
  
  if (!data) return <p>Ei nostoja</p>

  data.sort((a, b) => a.position - b.position);

  const options = {method: 'GET', headers: {accept: 'application/json', Authorization: `Bearer ${process.env.TMDB_API_KEY}`}};
  const backdrops: Backdrop[] = await Promise.all(
    data.map((item) =>
      fetch(`https://api.themoviedb.org/3/movie/${item.tmdbId}/images`, options)
        .then(res => res.json())
        .then(data => {
          return data.backdrops.reduce((a: Backdrop, b: Backdrop) => (b.width > (a?.width || 0) ? b : a), null);
        })
    )
  );

  return (
    <div>   
      <div className="carousel rounded-xl shadow-xl dark:text-white text-black w-full"> 
        {data?.map((item, idx) => {
          return (
            <div id={`item${idx+1}`} className="carousel-item w-full md:h-48 lg:h-96 bg-contain" style={{backgroundImage: `url(https://image.tmdb.org/t/p/w500/${backdrops[idx].file_path})`}} key={idx}>
              <div className="flex flex-col justify-center items-center w-full"> 
                <div className="pl-28 w-full"> 
                  <div className="bg-slate-950 w-2/5 px-12 py-12 bg-opacity-80 rounded-2xl">
                    <p className="md:text-2xl text-lg underline">{item.nimi}</p>
                    <p>{item.vuosi}</p>
                    <p>{item.genret.join(', ')}</p>
                    <p>{item.kesto} min</p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div className="flex w-full justify-center gap-2 py-2">
        <a href="#item1" className="btn btn-xs">1</a>
        <a href="#item2" className="btn btn-xs">2</a>
        <a href="#item3" className="btn btn-xs">3</a>
      </div>
    </div>
  )
}

export default Carousel