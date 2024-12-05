import { getUser } from "@/lib/admin"
import Link from "next/link"
import DeleteButton from "./components/DeleteButton"

interface Props {
  params: {
    userId: string
  }
}

const UserControlPage = async ({params}: Props) => {

  const { user, katselulista } = await getUser(params.userId);

  if (!user) {
    return <p>Käyttäjätietojen haussa tapahtui virhe</p>
  }
  
  return (
    <div>
      <div>
        <p className="text-2xl mb-5 ">{user.email}</p>
      </div>
      <div className="mb-5">
        <p>ID: {user.id}</p>
        <p>Puhelinnumero: {user.phone}</p>
        <p>Luotu: {new Date(user.created_at).toLocaleDateString()}</p>
        <p>Viimeisin kirjautuminen: {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Ei kirjautumisia'}</p>
      </div>
      <div className="mb-5">
        <p className="text-xl mb-2">Käyttäjän katselulistat</p>
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
      <DeleteButton userId={params.userId}/>
    </div>
  )
}

export default UserControlPage