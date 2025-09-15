import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import noticiasData from '../data/mockNoticias.json';

const momentosImportantes = [
  {
    ano: "2025",
    titulo: "Marta é eleita a melhor jogadora de todos os tempos",
    imagem: "https://lncimg.lance.com.br/cdn-cgi/image/width=850,quality=75,format=webp/uploads/2018/10/23/5bcf63711af7d.jpeg",
    link: "/historia"
  },
  {
    ano: "1996",
    titulo: "Primeira Olimpíada com futebol feminino",
    imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyJQtIjtprg632HYqG5MGAfjXA2pXbziORyQ&s",
    link: "/historia"
  },
  {
    ano: "2007",
    titulo: "Campeãs do Pan-Americano no Rio de Janeiro",
    imagem: "https://s2-ge.glbimg.com/DIRxSEtTRC-DzMLZrWP26ksWDng=/0x0:3000x1984/984x0/smart/filters:strip_icc()/s.glbimg.com/es/ge/f/original/2017/07/10/pan_3.jpg",
    link: "/historia"
  }
];

function HomePage() {
  const [partidas, setPartidas] = useState([]);
  const [tabela, setTabela] = useState([]);
  const [noticias, setNoticias] = useState({ destaque: null, outras: [] });
  const [loading, setLoading] = useState(true);

  const carrosselRef = useRef(null);

  useEffect(() => {
    const carregarDadosHome = async () => {
      try {
        setLoading(true);
        const [resPartidas, resTabela] = await Promise.all([
          fetch('http://localhost:3001/api/partidas'),
          fetch('http://localhost:3001/api/tabela')
        ]);
        const dadosPartidas = await resPartidas.json();
        const dadosTabela = await resTabela.json();
        setPartidas(dadosPartidas);
        setTabela(dadosTabela);

        const noticiaDestaque = noticiasData.find(n => n.destaque === true);
        const outrasNoticias = noticiasData.filter(n => n.destaque === false).slice(0, 2);
        setNoticias({ destaque: noticiaDestaque, outras: outrasNoticias });

      } catch (error) {
        console.error("Erro ao carregar dados da Home:", error);
      } finally {
        setLoading(false);
      }
    };
    carregarDadosHome();
  }, []);

  const handleScroll = (direcao) => {
    if (carrosselRef.current) {
      const cardWidth = carrosselRef.current.children[0].offsetWidth;
      carrosselRef.current.scrollBy({ left: cardWidth * direcao, behavior: 'smooth' });
    }
  };

  if (loading) {
    return <div className="text-center p-12 bg-white">Carregando página inicial...</div>;
  }

  return (
    <div className="bg-white">
      <section 
        className="relative h-96 bg-cover bg-bottom bg-fixed text-white" 
        style={{ backgroundImage: "url('https://images.adsttc.com/media/images/51ac/764d/b3fc/4b3b/0e00/00db/large_jpg/024_MINEIRAO-GXAVIER-003.jpg?1370256968')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900 via-purple-900/50 to-transparent"></div>
        
        <div className="relative container mx-auto h-full flex flex-col justify-center items-center">
            <h1 className="text-5xl md:text-6xl font-bold text-shadow-lg mb-6">Próximos Jogos</h1>

            <div className="relative w-full max-w-5xl">
              <button onClick={() => handleScroll(-1)} className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition">
                &#10094;
              </button>

              <div ref={carrosselRef} className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth" style={{ scrollbarWidth: 'none', '-ms-overflow-style': 'none' }}>
                {partidas.map(partida => (
                  <div key={partida.id} className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 snap-center p-3">
                    <Link 
                      to="/jogos" 
                      className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-center hover:bg-white/20 transition-all duration-300 shadow-lg flex flex-col h-full"
                    >
                        <div className="flex justify-around items-center mb-2">
                            <div className="flex-1 flex flex-col items-center"><img src={partida.timeCasa.logo} alt={partida.timeCasa.nome} className="w-10 h-10" /><span className="text-xs font-semibold mt-1 truncate">{partida.timeCasa.nome}</span></div>
                            <span className="font-bold text-lg mx-2">vs</span>
                            <div className="flex-1 flex flex-col items-center"><img src={partida.timeFora.logo} alt={partida.timeFora.nome} className="w-10 h-10" /><span className="text-xs font-semibold mt-1 truncate">{partida.timeFora.nome}</span></div>
                        </div>
                        <p className="text-sm font-bold mt-auto bg-black/20 rounded-full px-3 py-1">{partida.data} - {partida.hora}</p>
                    </Link>
                  </div>
                ))}
              </div>

              <button onClick={() => handleScroll(1)} className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition">
                &#10095;
              </button>
            </div>
        </div>
      </section>

      <main className="container mx-auto p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8">
            {noticias.destaque && (
                <Link to={`/noticias/${noticias.destaque.id}`} className="block group">
                    <img src={noticias.destaque.imagens[0]} alt={noticias.destaque.titulo} className="w-full h-80 object-cover rounded-lg mb-4" />
                    <h2 className="text-3xl font-bold text-gray-800 group-hover:text-purple-700">{noticias.destaque.titulo}</h2>
                    <p className="text-gray-600 mt-2">{noticias.destaque.resumo}</p>
                </Link>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {noticias.outras.map(noticia => (
                    <Link to={`/noticias/${noticia.id}`} key={noticia.id} className="block group">
                        <img src={noticia.imagens[0]} alt={noticia.titulo} className="w-full h-40 object-cover rounded-lg mb-2" />
                        <h3 className="font-semibold text-gray-800 group-hover:text-purple-700">{noticia.titulo}</h3>
                    </Link>
                ))}
            </div>

            <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4 border-l-4 border-purple-600 pl-3">Veja momentos importantes</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {momentosImportantes.map((momento, index) => (
                        <Link to={momento.link} key={index} className="block group">
                            <div className="overflow-hidden rounded-lg">
                                <img src={momento.imagem} alt={momento.titulo} className="w-full h-40 object-cover transform transition-transform duration-500 group-hover:scale-110" />
                            </div>
                            <p className="text-gray-500 font-semibold mt-2">{momento.ano}</p>
                            <h3 className="font-bold text-lg group-hover:text-purple-700">{momento.titulo}</h3>
                        </Link>
                    ))}
                </div>
            </section>
        </div>

        <aside className="lg:col-span-1">
            <div className="bg-gray-50 p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-bold text-center mb-4">Campeonato Brasileiro</h2>
                <table className="w-full text-sm">
                    <thead className="text-xs text-gray-500"><tr className="border-b"><th className="p-2 text-left"># Clube</th><th className="p-2 text-center">P</th><th className="p-2 text-center">J</th></tr></thead>
                    <tbody>
                        {tabela.map(item => (
                            <tr key={item.pos} className="border-t border-gray-200">
                                <td className="p-2 font-semibold flex items-center gap-2"><span className="w-4">{item.pos}</span> <img src={item.time.logo} alt={item.time.nome} className="w-5 h-5" /> {item.time.nome}</td>
                                <td className="p-2 text-center font-bold">{item.P}</td>
                                <td className="p-2 text-center">{item.J}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </aside>
      </main>
    </div>
  );
}

export default HomePage;