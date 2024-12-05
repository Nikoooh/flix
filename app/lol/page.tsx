interface Params {
  params: {
    nimi: string
  }
}

const ServerPage = ({params}: Params) => {

  console.log(params);
  
  return (
    <div>
      <p>Server</p>
    </div>
  )
}

export default ServerPage

