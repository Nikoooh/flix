"use client"

import { useRef, useState } from "react"
import { deleteElokuvaAction, getElokuvaAction, updateElokuvaAction } from "./_actions/elokuvaActions";
import { ElokuvaWithoutId } from "@/lib/elokuvatiedot";
import { createClient } from "../../../../supabase/functions/client";

const MovieControlEditPage = () => {

  const searchRef: React.MutableRefObject<HTMLFormElement | null> = useRef<HTMLFormElement>(null);
  const editRef: React.MutableRefObject<HTMLFormElement | null> = useRef<HTMLFormElement>(null);
  const [movieData, setMovieData] = useState<ElokuvaWithoutId | null>(null)
  const [id, setId] = useState<string | null>(null)
  const supabase = createClient();

  const handleSeach = async (e: React.FormEvent) => {
    e.preventDefault();

    if (movieData) setMovieData(null)

    if (!searchRef.current?.searchId.value || searchRef.current?.searchId.value <= 0) {
      return
    }

    const res = await getElokuvaAction(searchRef.current.searchId.value);
    setMovieData(res);
    setId(searchRef.current.searchId.value)

  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editRef.current || !id || !movieData) {
      return;
    };

    const confirm = window.confirm(`Päivitetäänkö elokuvan ${movieData.nimi} tietoja?`)

    if (!confirm) {
      return
    }

    const editFormData = new FormData(editRef.current); 

    const genret = editFormData.get('genre') as string;
    const ohjaajat = editFormData.get('ohjaaja') as string;
    const tuotanto = editFormData.get('tuotanto') as string;

    const genreArr = genret.split(', ');
    const ohjaajatArr = ohjaajat.split(', ');
    const tuotantoArr = tuotanto.split(', ')

    const updatedData = {
      nimi: editFormData.get("nimi") as string,
      alkuperainennimi: editFormData.get("alkNimi") as string,
      genre: genreArr,
      ohjaaja: ohjaajatArr,
      imdbid: editFormData.get("imdb") as string,
      imdburl: editFormData.get("imdburl") as string,
      tmdbid: parseNumber(editFormData.get("tmdb")) as number,
      tmdbkuva: editFormData.get("tmdbkuva") as string,
      valmistumisvuosi: parseNumber(editFormData.get("valmvuosi")) as number,
      kestomin: parseNumber(editFormData.get("kesto")) as number,
      tuotantomaa: tuotantoArr
    }
    
    await updateElokuvaAction(id, updatedData);
    
  }

  const parseNumber = (value: FormDataEntryValue | null): number | null => {
    if (value === null || value === "") return null; 
    const num = Number(value);
    return isNaN(num) ? null : num; 
  };

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!movieData || !id) return;

    const { data } = await supabase.from('katselulista').select('*').eq('nimi', movieData.nimi);
    const confirm = window.confirm(`Poistetaanko elokuva ${movieData.nimi}? Elokuvan on lisätty katselulistoille: ${data?.length} kertaa`);

    if (!confirm) return;

    const res = await deleteElokuvaAction(id);
    if (res && res.deletedCount === 1) {
      console.log(res);   
      setMovieData(null); 
    }
  }
  
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col">
        <form ref={searchRef} onSubmit={handleSeach}>       
          <label htmlFor='idInput'>Hae muokattava elokuva</label>
          <div className="h-14 mt-2">
            <input id="idInput" name="searchId" placeholder="Movie ID" className="w-96 rounded p-4 bg-zinc-700 focus:bg-zinc-900"/> 
            <button className="btn h-full" type="submit">HAE</button>
          </div> 
        </form>           
      </div>
      {movieData &&
        <div>
          <form className="lg:w-2/3 xl:w-1/2 w-full flex flex-col gap-6" ref={editRef}>
            <div className="flex flex-row gap-2 w-full">
              <div className="flex flex-col flex-1">
                <label htmlFor='nimi'>Nimi</label>
                <input type="text" id="nimi" name="nimi" defaultValue={movieData.nimi} className="w-full rounded p-4 bg-zinc-700 focus:bg-zinc-900"/>
              </div>
              <div className="flex flex-col flex-1">
                <label htmlFor='alkNimi'>Alkuperäinen nimi</label>
                <input type="text" id="alkNimi" name="alkNimi" defaultValue={movieData.alkuperainennimi} className="w-full rounded p-4 bg-zinc-700 focus:bg-zinc-900"/>
              </div>
            </div>
            <div className="flex flex-row gap-2 w-full">
              <div className="flex flex-col flex-1">
                <label htmlFor='genre'>Genre(t)</label>
                <input type="text" id="genre" name="genre" defaultValue={movieData.genre.join(', ')} className="w-full rounded p-4 bg-zinc-700 focus:bg-zinc-900"/>
              </div>
              <div className="flex flex-col flex-1">
                <label htmlFor='ohjaaja'>Ohjaaja(t)</label>
                <input type="text" id="ohjaaja" name="ohjaaja" defaultValue={movieData.ohjaaja.join(', ')} className="w-full rounded p-4 bg-zinc-700 focus:bg-zinc-900"/>
              </div>
            </div>      
            <div className="flex flex-row gap-2 w-full">
              <div className="flex flex-col flex-1">
                <label htmlFor='imdb'>Imdb ID</label>
                <input type="text" id="imdb" name="imdb" defaultValue={movieData.imdbid} className="w-full rounded p-4 bg-zinc-700 focus:bg-zinc-900"/>
              </div>
              <div className="flex flex-col flex-1">
                <label htmlFor='imdburl'>Imdb URL</label>
                <input type="text" id="imdburl" name="imdburl" defaultValue={movieData.imdburl} className="w-full rounded p-4 bg-zinc-700 focus:bg-zinc-900"/>
              </div>
            </div>
            <div className="flex flex-row gap-2 w-full">
              <div className="flex flex-col flex-1">
                <label htmlFor='tmdb'>Tmdb ID</label>
                <input type="number" id="tmdb" name="tmdb" defaultValue={movieData.tmdbid} className="w-full rounded p-4 bg-zinc-700 focus:bg-zinc-900"/>
              </div>
              <div className="flex flex-col flex-1">
                <label htmlFor='tmdbkuva'>Tmdb kuva</label>
                <input type="text" id="tmdbkuva" name="tmdbkuva" defaultValue={movieData.tmdbkuva} className="w-full rounded p-4 bg-zinc-700 focus:bg-zinc-900"/>
              </div>
            </div>
            <div className="flex flex-row gap-2 w-full">
              <div className="flex flex-col flex-1">
                <label htmlFor='valmvuosi'>Valmistumisvuosi</label>
                <input type="number" id="valmvuosi" name="valmvuosi" defaultValue={movieData.valmistumisvuosi} className="w-full rounded p-4 bg-zinc-700 focus:bg-zinc-900"/>
              </div>
              <div className="flex flex-col flex-1">
                <label htmlFor='kesto'>Kesto (min)</label>
                <input type="number" id="kesto" name="kesto" defaultValue={movieData.kestomin} className="w-full rounded p-4 bg-zinc-700 focus:bg-zinc-900"/>
              </div>
              <div className="flex flex-col flex-1">
                <label htmlFor='tuotanto'>Tuotantomaa</label>
                <input type="text" id="tuotanto" name="tuotanto" defaultValue={movieData.tuotantomaa} className="w-full rounded p-4 bg-zinc-700 focus:bg-zinc-900"/>
              </div>
            </div>      
            <div className="w-full flex flex-row gap-2">
              <button className="btn dark:bg-stone-950 hover:none flex-1" onClick={handleUpdate}>
                Tallenna muutokset
              </button>
              <button className="btn bg-red-600 text-white hover:bg-red-700 border-0 hover:none flex-1" onClick={handleDelete}>
                Poista elokuva
              </button>
            </div>
          </form>
        </div>   
      }    
    </div>
  )
}

export default MovieControlEditPage