import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

const API_URL = import.meta.env.VITE_API_URL;

// Componente para os Cards de KPI
function KpiCard({ title, value, description }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [topTimes, setTopTimes] = useState([]); // NOVO ESTADO
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // ATUALIZADO: Busca os stats E os top times em paralelo
        const [statsResponse, topTimesResponse] = await Promise.all([
          fetch(`${API_URL}/api/admin/dashboard-stats`),
          fetch(`${API_URL}/api/admin/dashboard-favoritos`)
        ]);

        if (!statsResponse.ok || !topTimesResponse.ok) {
          throw new Error('Falha ao buscar dados do dashboard.');
        }
        
        const statsData = await statsResponse.json();
        const topTimesData = await topTimesResponse.json();
        
        setStats(statsData);
        setTopTimes(topTimesData); // Salva os dados no novo estado

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []); // Roda apenas uma vez quando o componente carrega

  if (loading) {
    return <p>Carregando dashboard...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Seção 1: Cards de KPI (Sem alteração) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Total de Usuários"
          value={stats.totalUsuarios}
          description="Total de contas cadastradas na plataforma."
        />
        <KpiCard
          title="Inscritos no Encontro"
          value={`${stats.inscritosEncontro} / ${stats.limiteEncontro}`}
          description="Inscrições no encontro PAB atualmente aberto."
        />
        <KpiCard
          title="Equipes na Copa"
          value={`${stats.equipesCopa} / ${stats.limiteCopa}`}
          description="Equipes inscritas na copa PAB aberta."
        />
        <KpiCard
          title="Jogadoras Avulsas"
          value={stats.avulsasCopa}
          description="Jogadoras aguardando time na copa aberta."
        />
      </div>

      {/* ATUALIZADO: Seção 2: Top Times Favoritos */}
      <div className="grid grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Times Favoritos</CardTitle>
            <p className="text-sm text-muted-foreground">
              Times mais selecionados pelos usuários cadastrados.
            </p>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead className="text-right">Nº de Fãs</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topTimes.length > 0 ? topTimes.map((time) => (
                  <TableRow key={time.nome}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={time.logo_url} alt={time.nome} />
                          <AvatarFallback>{time.nome.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="font-medium">{time.nome}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-lg font-bold">{time.contagem}</TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-muted-foreground">
                      Nenhum time foi favoritado ainda.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AdminDashboard;