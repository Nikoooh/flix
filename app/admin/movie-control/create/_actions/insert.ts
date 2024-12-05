"use server"

import { ElokuvaWithoutId, insertNewMovie } from "@/lib/elokuvatiedot";

export const insertNewMovieAction = async (data: ElokuvaWithoutId) => {
  const res = await insertNewMovie(data)
  return res
};
