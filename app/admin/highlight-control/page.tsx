"use client"

import { useEffect, useReducer, useRef, useState } from "react";
import { createClient } from "../../../supabase/functions/client";
import { haeElokuvaAction } from "./_actions/haeElokuva";

interface Highlight {
  id: number
  kesto: string
  nimi: string
  tmdbId: number
  vuosi: number
  genret: string[]
  position: number
}

interface Swap {
  id: number
  nimi: string
}

type Action =
  | { type: "SET_DATA"; payload: Highlight[] }
  | { type: "MOVE"; index: number; direction: "UP" | "DOWN" };

const reducer = (state: Highlight[] | null, action: Action): Highlight[] | null => {
  switch (action.type) {
    case "SET_DATA":
      return action.payload;

    case "MOVE":
      if (state) {
        const newState = [...state];
        const { index, direction } = action;
        const targetIndex = direction === "UP" ? index - 1 : index + 1;

        if (targetIndex >= 0 && targetIndex < newState.length) {
          [newState[index], newState[targetIndex]] = [newState[targetIndex], newState[index]];
        }
        return newState;
      }
      return state;

    default:
      return state;
  }
};

const insertNewOrder = async (nostot: Highlight[]) => {
  const supabase = createClient();
  await Promise.all(
    nostot.map((item, position) =>
      supabase.from("nostot").update({ position }).eq("id", item.id)
    )
  );
  
};

const HighlightControlPage = () => {

  const [nostot, dispatch] = useReducer(reducer, null);
  const [swap, setSwap] = useState<Swap | null>(null)
  const [editMode, setEditMode] = useState<boolean>(false);
  const supabase = createClient()
  const formRef: React.MutableRefObject<HTMLFormElement | null> = useRef<HTMLFormElement>(null)

  const fetch = async (): Promise<void> => { 
    const { data } = await supabase.from('nostot').select()
    if (data) {
      const sort = data.sort((a, b) => a.position - b.position)
      dispatch({type: "SET_DATA", payload: sort})
    }
  }

  const handleNewHighlight = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formRef.current && formRef.current.newHighlightId.value.length > 5) {
      const newHighlight = await haeElokuvaAction(formRef.current.newHighlightId.value)
      if (!swap) return
      if (newHighlight) {
        const { error } = await supabase.from('nostot').update({
          nimi: newHighlight.alkuperainennimi,
          vuosi: newHighlight.valmistumisvuosi,
          genret: [newHighlight.genre[0], newHighlight.genre[1]],
          kesto: newHighlight.kestomin,
          tmdbId: newHighlight.tmdbid
        }).eq("id", swap.id)
        if (!error) fetch()      
      }
    }
    
    return;
    
  }

  useEffect(() => {
    fetch()
  }, [])

  if (!nostot) return <p>Ei nostoja.</p>
  
  return (
    <div>
      <div>
        <p className="text-2xl mb-5">Nostojen hallinta</p>
      </div>
      <div className="flex flex-col flex-wrap w-fit items-stretch">
        {nostot.map((movie, idx) => {
          return (
            <div key={movie.nimi} className="mb-4 py-2 w-full">
              <div className="flex flex-row gap-4 justify-between">            
                <div className="mb-3">
                  <div className="flex flex-row gap-4">             
                    <p className="text-xl mb-2">{idx + 1}. {movie.nimi}</p>
                    {editMode &&
                      <div className="cursor-pointer" onClick={() => {
                        const modal = document.getElementById('changeHighlight') as HTMLDialogElement;
                        if (modal) {
                          setSwap({id: movie.id, nimi: movie.nimi});
                          modal.showModal();
                        }
                      }}> 
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-stone-300 hover:w-7 hover:h-7 transition-all duration-300">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                      </div>
                    }
                  </div>
                  <p>{movie.vuosi}</p>
                  <p>{movie.kesto} min</p>
                  <p>{movie.genret.join(', ')}</p>
                </div>
                {editMode &&
                  <div className="w-fit flex flex-col gap-4 justify-center items-center">
                    {idx > 0 && (
                      <button
                        className="bg-stone-950 btn-circle rotate-90"
                        onClick={() => dispatch({ type: "MOVE", index: idx, direction: "UP" })}
                      >
                        ❮
                      </button>
                    )}
                    {idx < nostot.length - 1 && (
                      <button
                        className="bg-stone-950 btn-circle rotate-90"
                        onClick={() => dispatch({ type: "MOVE", index: idx, direction: "DOWN" })}
                      >
                        ❯
                      </button>
                    )}
                  </div>           
                }
                
              </div>
              <div className="borderGradient"/>
            </div>
          )
        })}
      </div>

      <div>
        <button className="btn dark:bg-stone-950 hover:none" onClick={() => {
          setEditMode(!editMode)
          if (editMode) insertNewOrder(nostot)
        }}>
          {editMode ? 'Tallenna muutokset' : 'Muokkaa'}
        </button>
      </div>

      <dialog id="changeHighlight" className="modal">
        <div className="modal-box">
          {swap &&
            <div> 
              <h3 className="font-bold text-lg">Vaihda nosto {swap.nimi}?</h3>
              <p className="py-4">Uuden noston ID:</p>
              <form ref={formRef}>
                <input type="text" name="newHighlightId" className="rounded w-full py-4 px-2"/>
              </form>
              <div className="flex flex-row gap-2 mt-4">
                <button className="btn bg-stone-950" onClick={handleNewHighlight}>
                  Tallenna uusi nosto
                </button>
                <form method="dialog">
                  <button className="btn">
                    Sulje
                  </button>
                </form> 
              </div>                         
            </div>
          }
        </div>
      </dialog>
    </div>
  )
}

export default HighlightControlPage;