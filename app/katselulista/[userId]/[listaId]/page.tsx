import Katselulista from "@/components/Katselulista"

interface Props  {
  params: {
    userId: number
    listaId: number
  }
}

const ListaPage = async ({params}: Props)  => {
  return (
    <Katselulista userId={params.userId} listaId={params.listaId} />
  )
}

export default ListaPage