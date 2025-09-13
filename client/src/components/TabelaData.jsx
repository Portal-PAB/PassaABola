function TabelaData({ classificacao, nome, img,pais, estatistica}){
    return(
        <tr>
            <td className="text-lg px-4 text-center"> {classificacao} </td>
            <td className="whitespace-nowrap px-2">{nome}</td>
            <td>
              <img
                src={img}
                alt={`Bandeira ${pais}`}
                className="w-10 py-2"
              />
            </td>
            <td className="text-lg px-4 text-center">{estatistica}</td>
        </tr>
    )
}

export default TabelaData