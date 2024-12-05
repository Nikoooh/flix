import { getUsers } from "@/lib/admin";
import { createClient } from "../../../supabase/functions/server"

const AnalyticsPage = async () => {

  const supabase = createClient();
  const users = await getUsers();
  const { data: sivudata } = await supabase.from('sivudata').select('*');
  const { data: moviedata } = await supabase.from('katselulista').select('*');

  const elokuva = (): string => {
    if (!moviedata || moviedata.length === 0) return 'Elokuvia ei löydetty';

    const freqMap = new Map<string, number>();
    let maxCount = 0;
    let favMovie = '';

    for (const movie of moviedata) {
      const name = movie.nimi;
      const count = (freqMap.get(name) || 0) + 1;
      freqMap.set(name, count);

      if (count > maxCount) {
        maxCount = count;
        favMovie = name;
      }
    }

    return favMovie;

  }

  const genre = (): string => {    
    if (!moviedata || moviedata.length === 0) return 'Genrejä ei löydetty';

    const freqMap = new Map<string, number>();
    let maxCount = 0;
    let favGenre = '';
    
    for (const movie of moviedata) {
      const genre = movie.genre;
      const count = (freqMap.get(genre) || 0) + 1;
      freqMap.set(genre, count);
    
      if (count > maxCount) {
        maxCount = count;
        favGenre = genre;
      }
    }
  
    return favGenre;
    
  }
  
  return (
    <div>
      <div className="mb-6">
        <p className="text-2xl">Käyttötilastot</p>
      </div>
      <div>
        <div>
          <p className="mb-2 text-lg">Käyttäjämäärä: {users.length}</p>
        </div>
        
        <div className="mb-2">
          <p className="mb-2 text-lg">Sivu tilastot</p>
          {sivudata &&
            sivudata.map((analytic) => {
              return <p key={analytic.id}>{analytic.sivu}: {analytic.avaukset}</p>
            })
          }  
        </div>
        
        <div>
          <p className="mb-2 text-lg">Elokuva tilastot</p>  
          <p>Suosituin elokuva: {elokuva()}</p>
          <p>Suosituin genre: {genre()}</p>
        </div>          
      </div>
    </div>
  )
}

export default AnalyticsPage