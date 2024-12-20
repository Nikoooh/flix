import type { Metadata } from "next";
import './globals.css'
import { genreLista } from "@/lib/elokuvatiedot";
import { Poppins } from "next/font/google"
import Header from "@/components/Header";
import GenreList from "@/components/GenreList";
import Counter from "@/components/Counter";

const poppins = Poppins({weight: "300", subsets: ['latin']})

export const metadata: Metadata = {
  title: "Xamkflix",
  description: "Generated by create next app",
};

export default async function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {

  const genreList = await genreLista()

  return (
    <html lang="en" className="dark">
      <body className={`p-6 ${poppins.className} 
        dark:bg-gradient-to-r dark:from-slate-950 dark:to-zinc-800 dark:to-15% dark:text-white 
        bg-gradient-to-r from-slate-950 from-3% to-zinc-100 to-15% min-h-screen text-black`
      }>

        <Header genreList={genreList} />
        <Counter page="vierailut" key='vierailut' />

        <div className="flex gap-12 w-full h-full">
          <GenreList genreList={genreList}/>
          <div className="pl-6 sm:p-0 w-full">
           {children} 
          </div>       
        </div>  
      </body>
    </html>
  );
}
