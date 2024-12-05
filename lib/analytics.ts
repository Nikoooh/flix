"use server"

import { createClient } from "../supabase/functions/server"
import { incrementPage } from "./admin";

export const updateCounter = async(field: string) => {

  const supabase = createClient();
  const { data } = await supabase.from('sivudata').select('*');

  switch (field) {
    case "vierailut":
      await supabase.from('sivudata').update({avaukset: 
        data?.find((sivu) => {
          return sivu.sivu === 'vierailut'
        })?.avaukset + 1
      }).eq('sivu', 'vierailut')
      break;
    case "elokuva": 
      await supabase.from('sivudata').update({avaukset: 
        data?.find((sivu) => {
          return sivu.sivu === 'elokuva'
        })?.avaukset + 1
      }).eq('sivu', 'elokuva')
      break;
    case "genre": 
      await supabase.from('sivudata').update({avaukset: 
        data?.find((sivu) => {
          return sivu.sivu === 'genre'
        })?.avaukset + 1
      }).eq('sivu', 'genre')
      break;
    case "katselulista": 
      await supabase.from('sivudata').update({avaukset: 
        data?.find((sivu) => {
          return sivu.sivu === 'katselulista'
        })?.avaukset + 1
      }).eq('sivu', 'katselulista')
      break;
    case "kirjautuminen": 
      incrementPage('kirjautuminen');
      break;
    case "rekisteröinti": 
      incrementPage('rekisteröinti');
      break;
  }
 
}