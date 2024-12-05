import { getUsers } from "@/lib/admin";
import UserList from "../components/userList";

const AdminPage = async () => {
  
  const users = await getUsers()

  return (
    <div>
      <div className="mb-6">
        <p className="text-2xl">Käyttäjälista</p>
      </div>
      <div>
        <UserList userlist={users}/>
      </div>    
    </div>
  );
};

export default AdminPage;