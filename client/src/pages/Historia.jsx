import React from 'react'; // Adicionado para boas práticas, embora o Vite não exija.
import TabelaEstatisticas from "../components/TabelaEstatisticas"; // <-- ESTA É A LINHA QUE FALTAVA

function Historia() {
  const artilheiras = [
    {
      classificacao: "1",
      nome: "Christine Sinclair",
      img: "https://media.istockphoto.com/id/967988240/pt/vetorial/canada-round-flag-vector-flat-icon.jpg?s=612x612&w=0&k=20&c=eO7jLYqK2jl4Hv2Vcfh9RN4yXcwVdmDnq61EOo-lI3g=",
      pais: "Canadá",
      estatistica: "190",
    },
    {
      classificacao: "2",
      nome: "Abby Wambach",
      img: "https://thumbs.dreamstime.com/b/%C3%ADcone-redondo-do-vetor-da-bandeira-estados-unidos-99061090.jpg",
      pais: "EUA",
      estatistica: "184",
    },
    {
      classificacao: "3",
      nome: "Mia Hamm",
      img: "https://thumbs.dreamstime.com/b/%C3%ADcone-redondo-do-vetor-da-bandeira-estados-unidos-99061090.jpg",
      pais: "EUA",
      estatistica: "158",
    },
    {
      classificacao: "4",
      nome: "Kristine Lilly",
      img: "https://thumbs.dreamstime.com/b/%C3%ADcone-redondo-do-vetor-da-bandeira-estados-unidos-99061090.jpg",
      pais: "EUA",
      estatistica: "130",
    },
    {
      classificacao: "5",
      nome: "Marta",
      img: "https://rlv.zcache.com.br/adesivo_redondo_bandeira_do_brasil_vintage-racaab08544e94eee90d2fed88a9ea213_zg2qos_644.webp?rlvnet=1",
      pais: "Brasil",
      estatistica: "115",
    },
  ];

  const selecoes = [
    {
      classificacao: "1",
      nome: "Estados Unidos",
      img: "https://thumbs.dreamstime.com/b/%C3%ADcone-redondo-do-vetor-da-bandeira-estados-unidos-99061090.jpg",
      pais: "EUA",
      estatistica: "04",
    },
    {
      classificacao: "2",
      nome: "Alemanha",
      img: "https://thumbs.dreamstime.com/b/ilustra%C3%A7%C3%A3o-circular-do-%C3%ADcone-de-bandeira-pa%C3%ADs-alemanha-s%C3%ADmbolo-indicador-crach%C3%A1-bot%C3%A3o-163375786.jpg",
      pais: "Alemanha",
      estatistica: "02",
    },
    {
      classificacao: "3",
      nome: "Noruega",
      img: "https://rlv.zcache.com.br/adesivo_redondo_bandeira_da_noruega-r9445c6c9087c46c2b3a1685569a1c269_zg2q1f_644.webp?rlvnet=1",
      pais: "Noruega",
      estatistica: "01",
    },
    {
      classificacao: "4",
      nome: "Japão",
      img: "https://img.freepik.com/vetores-premium/bandeira-redonda-do-japao-ilustracao-do-vetor_739746-116.jpg",
      pais: "Japão",
      estatistica: "01",
    },
    {
      classificacao: "5",
      nome: "Espanha",
      img: "https://us.123rf.com/450wm/viktorijareut/viktorijareut1504/viktorijareut150400049/38810904-round-spain-flag-vector-icon-isolated-spain-flag-button.jpg",
      pais: "Espanha",
      estatistica: "01",
    },
  ];

  const maioresBrasileiras = [
    {
      classificacao: "1",
      nome: "Marta ",
      img: "https://rlv.zcache.com.br/adesivo_redondo_bandeira_do_brasil_vintage-racaab08544e94eee90d2fed88a9ea213_zg2qos_644.webp?rlvnet=1",
      pais: "Brasil",
      estatistica: "119",
    },
    {
      classificacao: "2",
      nome: "Cristiane ",
      img: "https://rlv.zcache.com.br/adesivo_redondo_bandeira_do_brasil_vintage-racaab08544e94eee90d2fed88a9ea213_zg2qos_644.webp?rlvnet=1",
      pais: "Brasil",
      estatistica: "97",
    },
    {
      classificacao: "3",
      nome: "Debinha",
      img: "https://rlv.zcache.com.br/adesivo_redondo_bandeira_do_brasil_vintage-racaab08544e94eee90d2fed88a9ea213_zg2qos_644.webp?rlvnet=1",
      pais: "Brasil",
      estatistica: "62",
    },
    {
      classificacao: "4",
      nome: "Roseli",
      img: "https://rlv.zcache.com.br/adesivo_redondo_bandeira_do_brasil_vintage-racaab08544e94eee90d2fed88a9ea213_zg2qos_644.webp?rlvnet=1",
      pais: "Brasil",
      estatistica: "42",
    },
    {
      classificacao: "5",
      nome: "Pretinha",
      img: "https://rlv.zcache.com.br/adesivo_redondo_bandeira_do_brasil_vintage-racaab08544e94eee90d2fed88a9ea213_zg2qos_644.webp?rlvnet=1",
      pais: "Brasil",
      estatistica: "42",
    },
  ];

  return (
    <>
      <section className="container mx-auto  py-10 px-6">
        <h2 className="text-3xl font-bold text-[var(--roxo-principal)] mb-5">
          Senta que lá vem história
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-lg overflow-hidden shadow-md">
            <iframe
              width="100%"
              height="315"
              src="https://www.youtube.com/embed/nxI-mOvX9t0?si=Op-pS4Ageh31IcBS"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>

          <div className="rounded-lg overflow-hidden shadow-md">
            <iframe
              width="100%"
              height="315"
              src="https://www.youtube.com/embed/MGJ1frqc7jk?si=IfriT5HdwrCz-wjy"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>

      <section className="container mx-auto  py-10 px-6">
        <h2 className="text-3xl font-bold text-[var(--roxo-principal)] mb-5">
          Futebol Feminino em Números
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TabelaEstatisticas
            titulo="Top 5 artilheiras da história do futebol feminino"
            headerUm="País"
            headerDois="Gols"
            dados={artilheiras}
          />

          <TabelaEstatisticas
            titulo="Seleções femininas com mais títulos da Copa do Mundo"
            headerUm="País"
            headerDois="Títulos"
            dados={selecoes}
          />
          <TabelaEstatisticas
            titulo="Maiores artilheiras da Seleção Brasileira Feminina"
            headerUm="País"
            headerDois="Gols"
            dados={maioresBrasileiras}
          />
        </div>
      </section>

      <section className="container mx-auto py-10 px-6">
        <h2 className="text-3xl font-bold text-[var(--roxo-principal)] mb-5">
          Conquistas e Desafios
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-lg  overflow-hidden transform transition duration-300 hover:scale-105 cursor-pointer">
            <div className="p-4">
              <img
                src="https://lncimg.lance.com.br/cdn-cgi/image/width=850,quality=75,format=webp/uploads/2018/10/23/5bcf63711af7d.jpeg"
                alt="Jogadora Marta abraçando 6 troféus"
                className="rounded-3xl"
              />
              <p className=" text-[var(--cinza-texto)] font-bold mt-4">2025</p>
              <p className="font-bold text-xl ">
                Marta é eleita a melhor jogadora de todos os tempos
              </p>
            </div>
          </div>
          <div className="rounded-lg  overflow-hidden transform transition duration-300 hover:scale-105 cursor-pointer">
            <div className="p-4">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyJQtIjtprg632HYqG5MGAfjXA2pXbziORyQ&s"
                alt="Jogadora Marta abraçando 6 troféus"
                className="rounded-3xl w-100"
              />
              <p className=" text-[var(--cinza-texto)] font-bold mt-4">1996</p>
              <p className="font-bold text-xl">
                Primeira Olimpíada
              </p>
            </div>
          </div>
          <div className="rounded-lg  overflow-hidden transform transition duration-300 hover:scale-105 cursor-pointer">
            <div className="p-4">
              <img
                src="https://s2-ge.glbimg.com/DIRxSEtTRC-DzMLZrWP26ksWDng=/0x0:3000x1984/984x0/smart/filters:strip_icc()/s.glbimg.com/es/ge/f/original/2017/07/10/pan_3.jpg"
                alt="Jogadora Marta abraçando 6 troféus"
                className="rounded-3xl w-100"
              />
              <p className=" text-[var(--cinza-texto)] font-bold mt-4">2007</p>
              <p className="font-bold text-xl">
                Campeãs Pan-Americano do Rio
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
export default Historia;