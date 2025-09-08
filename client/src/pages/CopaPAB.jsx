import React from 'react';
import { Link } from 'react-router-dom';

// Ícones como componentes simples (placeholders)
const InscricaoIcon = () => <div className="text-5xl">📝</div>;
const FotosIcon = () => <div className="text-5xl">🖼️</div>;
const ChaveamentoIcon = () => <div className="text-5xl">🏆</div>;
const LogoIcon = () => <div className="text-3xl">⚽</div>;

// Um componente reutilizável para os cards, para não repetir código
const CardLink = ({ to, icon, title, description, highlighted = false }) => {
  // Define as classes de borda com base na propriedade 'highlighted'
  const borderColor = highlighted ? 'border-blue-500' : 'border-gray-200';

  return (
    <Link 
      to={to} 
      className={`
        bg-white p-8 rounded-2xl shadow-lg border-2 ${borderColor}
        flex flex-col items-center gap-4 
        transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl
      `}
    >
      {icon}
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      <p className="text-gray-500 text-center">{description}</p>
    </Link>
  );
};

function CopaPAB() {
  return (
    // Container principal da página com fundo branco e espaçamento
    <div className="bg-white min-h-full p-8 md:p-12">
      <div className="max-w-5xl mx-auto">
        
        {/* Título da Página */}
        <div className="flex justify-center items-center gap-4 mb-12">
          <h1 className="text-4xl font-bold text-gray-800 uppercase tracking-wider">Copa Passa a Bola</h1>
          <LogoIcon />
        </div>

        {/* Grid dos Cards */}
        {/* Em telas pequenas (mobile), os cards ficam em coluna (grid-cols-1).
            Em telas médias ou maiores (md:), eles ficam em linha (grid-cols-3). */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <CardLink 
            to="/inscricao"
            icon={<InscricaoIcon />}
            title="Inscrição"
            description="Faça sua inscrição na Copa"
          />
          <CardLink 
            to="/fotos"
            icon={<FotosIcon />}
            title="Fotos"
            description="Veja as fotos do Evento"
            highlighted={true} // Este card terá a borda azul
          />
          <CardLink 
            to="/chaveamento"
            icon={<ChaveamentoIcon />}
            title="Chaveamento"
            description="Confira o chaveamento da Copa"
          />
        </div>

      </div>
    </div>
  );
}

export default CopaPAB;