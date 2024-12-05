
const MovieControlLayout = ({ children }: {children: React.ReactNode}) => {
  return (
    <div>
       <div>
        <p className="text-2xl mb-6">Elokuva hallinta</p>
      </div>
      <div>
        {children}
      </div>
    </div>
   
  )
}

export default MovieControlLayout