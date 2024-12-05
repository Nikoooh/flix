import { genreLista } from "./elokuvatiedot";

export const haeGenre = async (genre: string): Promise<string | undefined> => {
  const genreList = await genreLista()
  return genreList.find((x) => normalisoiGenre(x) === genre);
}

const normalisoiGenre = (genre: string): string => {
  return genre
    .toLowerCase() 
    .replace(/ä/g, "a") 
    .replace(/ö/g, "o") 
    .replace(/-/g, ""); 
}