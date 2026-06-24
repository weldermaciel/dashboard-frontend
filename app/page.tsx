'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useSession } from '@/hooks/useSession';
import Login from '@/components/Login';

type Indicador = {
  id: string;
  secretaria: string;
  departamento: string;
  indicador: string;
  dono: string;
  tipo_dados: string;
  comportamento: string;
  tipo_info: string;
  ano: number;
  jan: number;
  fev: number;
  mar: number;
  abr: number;
  mai: number;
  jun: number;
  jul: number;
  ago: number;
  set: number;
  out: number;
  nov: number;
  dez: number;
  cor: string;
  direcao: string;
};

export default function Home() {
  const { session, loading: sessionLoading } = useSession();
  const [indicadores, setIndicadores] = useState<Indicador[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function carregarDados() {
      if (!session) return;  // <-- Adicione esta linha

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const token = session.access_token;
        const refreshToken = session.refresh_token?? '';

        const headers: Record<string, string> = { Authorization: `Bearer ${token}` };
        if (refreshToken) {
          headers['X-Refresh-Token'] = refreshToken;
        }

        const res = await fetch(`${apiUrl}/api/indicadores`, { headers });

        if (!res.ok) throw new Error('Erro ao carregar');
        const json = await res.json();
        setIndicadores(json.indicadores || []);
      } catch (err: any) {
        setErro('Não foi possível carregar os indicadores.');
        console.error(err);
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, [session]);

  if (sessionLoading) return <p>Carregando...</p>;
if (!session) return <Login onLogin={() => {}} />;

  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  return (
    <main style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Dashboard de Indicadores</h1>
  <button onClick={() => supabase.auth.signOut()}
    style={{ padding: '6px 12px', cursor: 'pointer' }}>
    Sair
  </button>
      </div>

      {erro && <p style={{ color: 'red' }}>{erro}</p>}
      {carregando && <p>Carregando dados...</p>}

      {indicadores.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#002e6e', color: 'white' }}>
                <th style={thStyle}>Secretaria</th>
                <th style={thStyle}>Departamento</th>
                <th style={thStyle}>Indicador</th>
                <th style={thStyle}>Dono</th>
                <th style={thStyle}>Info</th>
                <th style={thStyle}>Ano</th>
                {meses.map(m => <th key={m} style={thStyle}>{m}</th>)}
              </tr>
            </thead>
            <tbody>
              {indicadores.map(ind => (
                <tr key={ind.id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={tdStyle}>{ind.secretaria}</td>
                  <td style={tdStyle}>{ind.departamento}</td>
                  <td style={tdStyle}>{ind.indicador}</td>
                  <td style={tdStyle}>{ind.dono}</td>
                  <td style={tdStyle}>{ind.tipo_info}</td>
                  <td style={tdStyle}>{ind.ano}</td>
                  {[ind.jan, ind.fev, ind.mar, ind.abr, ind.mai, ind.jun, ind.jul, ind.ago, ind.set, ind.out, ind.nov, ind.dez].map((valor, i) => (
                    <td key={i} style={{ ...tdStyle, textAlign: 'right' }}>{valor}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

const thStyle: React.CSSProperties = {
  padding: '8px 10px',
  textAlign: 'left',
  fontWeight: 'bold',
  border: '1px solid #002e6e',
};

const tdStyle: React.CSSProperties = {
  padding: '6px 10px',
  border: '1px solid #ccc',
};