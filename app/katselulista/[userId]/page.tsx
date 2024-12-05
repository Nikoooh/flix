import { createClient } from "../../../supabase/functions/server";
import Link from "next/link";
import UusiListaModal from "./components/UusiListaModal";
import Counter from "@/components/Counter";

interface Props {
  params: {
    userId: string
  }
}

const KatselulistaPage = async ({params}: Props) => {

  const supabase = createClient();
  const { data: katselulista } = await supabase.from('katselulistat').select('*').eq('userId', params.userId)

  return (
    <div>
      <div>
        <p className="text-2xl mb-1">Katselulistat</p>
        <div className="mb-4">
          {katselulista?.map((lista) => {
            return (
              <Link href={`${params.userId}/${lista.id}`} key={lista.id}>        
                <div className="border-b-2 border-stone-600 border-opacity-30 py-4 px-2">
                  <p>{lista.nimi}</p>
                </div>
              </Link>
            )
          })}
        </div>
        <UusiListaModal userId={params.userId}/>
      </div>

      <Counter page="katselulista" key='katselu'/>
    </div>
  )
}

export default KatselulistaPage