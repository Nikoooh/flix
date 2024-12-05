"use server"

import { deleteMovie, editMovie, ElokuvaWithoutId, haeElokuva } from "@/lib/elokuvatiedot"

export const getElokuvaAction = async (id: string): Promise<ElokuvaWithoutId | null> => {
  const data = await haeElokuva(id);
  if (data) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {_id, ...resData} = data;
    return resData;
  }
  return null;
}

export const updateElokuvaAction = async (id: string, newData: ElokuvaWithoutId) => {
  const data = await editMovie(id, newData)
  if (data) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {_id, ...resData} = data;
    return resData
  }
}

export const deleteElokuvaAction = async (id: string) => {A
  const res = await deleteMovie(id);
  if (res) {
    return res;
  }
}