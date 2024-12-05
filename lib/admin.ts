"use server"
import { createClient } from "@supabase/supabase-js";

export const getUsers = async () => {

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const { data } = await supabaseAdmin.auth.admin.listUsers(); 

  return data.users;

}

export const checkAdmin = async (email: string) => {

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const { data } = await supabaseAdmin.auth.admin.listUsers();
  const user = data.users.find((user) => user.email === email);

  if (user?.user_metadata?.role === 'admin') {
    return { isAdmin: true }
  }

  return { isAdmin: false }
}

export const getUser = async (userId: string) => {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const { data } = await supabaseAdmin.auth.admin.getUserById(userId)
  const user = data.user

  const { data: katselulista } = await supabaseAdmin.from('katselulistat').select('*').eq('userId', userId)

  return { user, katselulista }

}

export const deleteUser = async (userId: string) => {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const { data } = await supabaseAdmin.auth.admin.deleteUser(userId);
  return data
}

export const incrementPage = async (page: string) => {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const { data } = await supabaseAdmin.from('sivudata').select('*');

  switch (page) {
    case 'kirjautuminen':
      await supabaseAdmin.from('sivudata').update({avaukset: 
        data?.find((sivu) => {
          return sivu.sivu === 'kirjautuminen'
          })?.avaukset + 1
        }).eq('sivu', 'kirjautuminen');
        break;
      case "rekisteröinti": 
        await supabaseAdmin.from('sivudata').update({avaukset: 
          data?.find((sivu) => {
            return sivu.sivu === 'rekisteröinti'
          })?.avaukset + 1
        }).eq('sivu', 'rekisteröinti')
        break;        
  }
}