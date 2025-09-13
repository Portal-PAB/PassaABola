import foto1 from "../assets/1.png"
import foto2 from "../assets/2.jpg"
import foto3 from "../assets/3.jpg"
import foto4 from "../assets/4.jpg"

function Sobre() {
  return (
    <div className="max-w-[1100px] mx-auto px-5">
      <section className="mb-12">
        <br />
        <h1 className="text-3xl font-bold text-purple-800 mb-6">Sobre Nós</h1>

        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 grid-rows-2 gap-6 mb-8">
          <div className="grid grid-rows-2 gap-6 col-span-1 row-span-2">
            <img
              src={foto1}
              alt="Imagem 1"
              className="w-full h-full rounded-xl shadow-md object-cover"
            />
            <div className="grid grid-cols-2 gap-6">
              <img
                src={foto3}
                alt="Imagem 3"
                className="w-full h-full rounded-xl shadow-md object-cover"
              />
              <img
                src={foto4}
                alt="Imagem 4"
                className="w-full h-full rounded-xl shadow-md object-cover"
              />
            </div>
          </div>

          <div className="col-span-1 sm:col-span-1 lg:col-span-2 row-span-2">
            <img
              src={foto2}
              alt="Imagem 2"
              className="w-full h-full rounded-xl shadow-md object-cover"
            />
          </div>
        </div>

        <p className="text-gray-700 mb-2">
          O <strong>Passa a Bola</strong> é mais do que um canal – é uma plataforma que valoriza,
          divulga e celebra o futebol feminino em todas as suas formas.
        </p>
        <p className="text-gray-700">
          Criado por <strong>Alê Xavier</strong> e <strong>Luana Maluf</strong>, o canal nasceu da
          vontade de dar voz às mulheres que fazem parte do universo da bola – dentro e fora das
          quatro linhas.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-purple-800 mb-4">O que você encontra aqui</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>
            <strong>PABcast:</strong> entrevistas com atletas, jornalistas e mulheres incríveis do
            futebol feminino
          </li>
          <li>
            <strong>Debates e histórias</strong> reais sobre o cenário feminino, desafios e
            conquistas
          </li>
          <li>
            <strong>Vídeos leves e divertidos:</strong> desafios, bastidores, maternidade, cultura e
            mais
          </li>
          <li>
            <strong>Cobertura de jogos, torneios e eventos</strong> importantes do futebol feminino
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-purple-800 mb-4">Por que existimos?</h2>
        <p className="text-gray-700 mb-2">
          Porque acreditamos no poder da representatividade. Porque o futebol feminino merece o mesmo
          palco. Porque queremos inspirar, informar e entreter – sem deixar ninguém de fora.
        </p>
        <p className="text-gray-700 font-semibold">
          💜 Juntas, seguimos fazendo história dentro e fora de campo – pelo futebol que é nosso por
          direito.
        </p>
        <br />
      </section>
    </div>
  )
}

export default Sobre
