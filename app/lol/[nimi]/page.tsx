interface Params {
  params: {
    nimi: string
  }
}

const ServerPage = ({params}: Params) => {  
  return (
    <div>
      <p>{params.nimi}</p>
    </div>
  )
}

export default ServerPage