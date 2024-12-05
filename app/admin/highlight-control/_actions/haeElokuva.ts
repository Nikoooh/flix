"use server"

import { haeElokuva as fetchElokuva } from "@/lib/elokuvatiedot";

export async function haeElokuvaAction(id: string) {
  const movie = await fetchElokuva(id);
  if (!movie) {
    return null
  }
  const { alkuperainennimi, kestomin, tmdbid, valmistumisvuosi, genre } = movie
  return { alkuperainennimi, kestomin, tmdbid, valmistumisvuosi, genre }
}