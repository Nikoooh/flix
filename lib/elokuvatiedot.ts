import { MongoClient, Collection, ObjectId } from "mongodb";

const client: MongoClient = new MongoClient(process.env.DB_URI!)

export interface ElokuvaWithoutId {
  nimi: string;
  alkuperainennimi: string;
  valmistumisvuosi: number;
  ohjaaja: string[];
  genre: string[];
  tuotantomaa: string[];
  kestomin: number;
  imdbid: string;
  imdburl: string;
  tmdbid: number;
  tmdbkuva: string;
}

export interface Elokuva extends ElokuvaWithoutId {
  _id: ObjectId | string;
}

interface Cast {
  name: string;
  [key: string]: unknown;
}

export interface Message {
  type: 'error' | 'success';
  message: string; 
}

export const haeElokuvat = async (): Promise<Elokuva[] | []> => {

  await client.connect()
  const elokuvat: Collection<Elokuva> = client.db('xamkflix').collection('elokuvat');
  return elokuvat.find({}).limit(40).sort({_id: -1}).toArray()

}

export const haeElokuva = async (id: string): Promise<Elokuva | null> => {


  await client.connect()
  const elokuva: Collection<Elokuva> = client.db('xamkflix').collection('elokuvat');
  return elokuva.findOne({_id: new ObjectId(id)})
  
}

export const haeGenrenMukaan = async (genre: string): Promise<Elokuva[] | []> => {
  await client.connect()
  const elokuva: Collection<Elokuva> = client.db('xamkflix').collection('elokuvat');
  return elokuva.find({genre: genre}).limit(200).sort({ valmistumisvuosi: -1 }).toArray()
}

export const genreLista = async (): Promise<string[] | []> => {

  await client.connect();
  const genret = client.db('xamkflix').collection('elokuvat').distinct('genre');
  return genret

}

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${process.env.TMDB_API_KEY}`
  }
};

export const getCast = async (tmdbid: number) => {
  const response = await fetch(`https://api.themoviedb.org/3/movie/${tmdbid}/credits`, options)
  const data = await response.json();
  const cast = data.cast.slice(0, 5).map((actor: Cast) => actor.name)
  return cast
}

export const getOverview = async (tmdbid: number) => {

  let kuvaus;

  const responseFI = await fetch(`https://api.themoviedb.org/3/movie/${tmdbid}?language=fi-FI`, options)
  const dataFI = await responseFI.json();
  kuvaus = dataFI.overview

  if (!kuvaus) {
    const reponseDefault = await fetch(`https://api.themoviedb.org/3/movie/${tmdbid}`, options)
    const dataDefault = await reponseDefault.json();
    kuvaus = dataDefault.overview;
  }

  return kuvaus
    
}

export const insertNewMovie = async (data: ElokuvaWithoutId): Promise<Message> => {
  try {
    if (!data) {
      return { type: 'error', message: 'Elokuva tietoja puuttuu.' }
    }

    await client.connect()
    const isInDb = await client.db('xamkflix').collection('elokuvat').findOne({imdbid: data.imdbid});
    
    if (!isInDb) {
      client.db('xamkflix').collection('elokuvat').insertOne(data);
      return { type: 'success', message: 'Elokuva lisätty tietokantaan.' }
    }

    return { type: 'error', message: 'Elokuva on jo tietokannassa.' }

  } catch (error: unknown) {
    const errorMsg = error && typeof error === 'object' && 'message' in error ? error?.message : 'Tuntematon virhe'
    return { type: 'error', message: `Tapahtui virhe: ${errorMsg}` }
  }

}

export const editMovie = async (id: string, newData: ElokuvaWithoutId) => {
  try {
    await client.connect();
    const update = await client.db('xamkflix').collection('elokuvat').findOneAndUpdate({_id: new ObjectId(id)}, {$set: newData});
    return update;
  } catch (error) {
    console.error(error) 
  }
}

export const deleteMovie = async (id: string) => {
  try {
    await client.connect();
    const res = await client.db('xamkflix').collection('elokuvat').deleteOne({_id: new ObjectId(id)});
    return res;
  } catch (error) {
    console.error(error)
  }
}