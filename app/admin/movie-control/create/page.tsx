"use client"

import { useState, useRef } from "react";
import { Message } from "@/lib/elokuvatiedot";
import { insertNewMovieAction } from "./_actions/insert";

const MovieControlCreatePage = () => {
  const [message, setMessage] = useState<Message | null>(null)
  const formRef: React.MutableRefObject<HTMLFormElement | null> = useRef<HTMLFormElement>(null);


  const handleNew = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!formRef.current) {
      setMessage({type: 'error', message: 'Tietoja puuttuu!'})
      setTimeout(() => {
        setMessage(null)
      }, 5000)
      return
    }

    const formData = new FormData(formRef.current); 
    const genret = formData.get('genre') as string;
    const ohjaajat = formData.get('ohjaaja') as string;
    const tuotanto = formData.get('tuotanto') as string;

    if (!genret || !ohjaajat || !tuotanto) {
      setMessage({type: 'error', message: 'Tietoja puuttuu!'})
      setTimeout(() => {
        setMessage(null)
      }, 5000)  
      return
    }

    const genreArr = genret.split(', ');
    const ohjaajatArr = ohjaajat.split(', ');
    const tuotantoArr = tuotanto.split(', ')
    
    const movieData = {
      nimi: formData.get("nimi") as string,
      alkuperainennimi: formData.get("alkNimi") as string,
      genre: genreArr,
      ohjaaja: ohjaajatArr,
      imdbid: formData.get("imdb") as string,
      imdburl: formData.get("imdburl") as string,
      tmdbid: parseNumber(formData.get("tmdb")) as number,
      tmdbkuva: formData.get("tmdbkuva") as string,
      valmistumisvuosi: parseNumber(formData.get("valmvuosi")) as number,
      kestomin: parseNumber(formData.get("kesto")) as number,
      tuotantomaa: tuotantoArr
    };
  
    const res = await insertNewMovieAction(movieData);
    
    if (res) {
      setMessage(res)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
      
  };

  const parseNumber = (value: FormDataEntryValue | null): number | null => {
    if (value === null || value === "") return null; 
    const num = Number(value);
    return isNaN(num) ? null : num; 
  };
  
  return (
    <div>       
      <div> 
        <form className="lg:w-2/3 xl:w-1/2 w-full flex flex-col gap-6" ref={formRef}>
          <div className="flex flex-row gap-2 w-full">
            <div className="flex flex-col flex-1">
              <label htmlFor='nimi'>Nimi</label>
              <input type="text" id="nimi" name="nimi" className="w-full rounded p-4 bg-zinc-700 focus:bg-zinc-900"/>
            </div>
            <div className="flex flex-col flex-1">
              <label htmlFor='alkNimi'>Alkuperäinen nimi</label>
              <input type="text" id="alkNimi" name="alkNimi" className="w-full rounded p-4 bg-zinc-700 focus:bg-zinc-900"/>
            </div>
          </div>
          <div className="flex flex-row gap-2 w-full">
            <div className="flex flex-col flex-1">
              <label htmlFor='genre'>Genre(t)</label>
              <input type="text" id="genre" name="genre" className="w-full rounded p-4 bg-zinc-700 focus:bg-zinc-900"/>
            </div>
            <div className="flex flex-col flex-1">
              <label htmlFor='ohjaaja'>Ohjaaja(t)</label>
              <input type="text" id="ohjaaja" name="ohjaaja" className="w-full rounded p-4 bg-zinc-700 focus:bg-zinc-900"/>
            </div>
          </div>      
          <div className="flex flex-row gap-2 w-full">
            <div className="flex flex-col flex-1">
              <label htmlFor='imdb'>Imdb ID</label>
              <input type="text" id="imdb" name="imdb" className="w-full rounded p-4 bg-zinc-700 focus:bg-zinc-900"/>
            </div>
            <div className="flex flex-col flex-1">
              <label htmlFor='imdburl'>Imdb URL</label>
              <input type="text" id="imdburl" name="imdburl" className="w-full rounded p-4 bg-zinc-700 focus:bg-zinc-900"/>
            </div>
          </div>
          <div className="flex flex-row gap-2 w-full">
            <div className="flex flex-col flex-1">
              <label htmlFor='tmdb'>Tmdb ID</label>
              <input type="number" id="tmdb" name="tmdb" className="w-full rounded p-4 bg-zinc-700 focus:bg-zinc-900"/>
            </div>
            <div className="flex flex-col flex-1">
              <label htmlFor='tmdbkuva'>Tmdb kuva</label>
              <input type="text" id="tmdbkuva" name="tmdbkuva" className="w-full rounded p-4 bg-zinc-700 focus:bg-zinc-900"/>
            </div>
          </div>
          <div className="flex flex-row gap-2 w-full">
            <div className="flex flex-col flex-1">
              <label htmlFor='valmvuosi'>Valmistumisvuosi</label>
              <input type="number" id="valmvuosi" name="valmvuosi" className="w-full rounded p-4 bg-zinc-700 focus:bg-zinc-900"/>
            </div>
            <div className="flex flex-col flex-1">
              <label htmlFor='kesto'>Kesto (min)</label>
              <input type="number" id="kesto" name="kesto" className="w-full rounded p-4 bg-zinc-700 focus:bg-zinc-900"/>
            </div>
            <div className="flex flex-col flex-1">
              <label htmlFor='tuotanto'>Tuotantomaa</label>
              <input type="text" id="tuotanto" name="tuotanto" className="w-full rounded p-4 bg-zinc-700 focus:bg-zinc-900"/>
            </div>
          </div>
          {message !== null &&
            <div className={`w-full ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'} rounded-lg py-4 px-6`}>
              <p className="text-lg">{message.message}</p>
            </div>
          }          
          <div className="w-full">
            <button className="btn dark:bg-stone-950 hover:none w-full" onClick={handleNew}>
              Lisää elokuva tietokantaan
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MovieControlCreatePage