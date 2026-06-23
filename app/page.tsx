'use client';

import { useEffect, useState } from 'react';

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
  const [indicadores, setIndicadores] = useState<Indicador[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function fetchComRetry(url: string, tentativas = 5, delay = 2000) {
      for (let i = 0; i < tentativas; i++) {
        try {
          const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
          if (res.ok) return res.json();
        } catch (e) {
          console.log(`Tentativa ${i + 1} falhou, aguardando...`);
        }
        await new Promise(r => setTimeout(r, delay * (i + 1)));
      }
      throw new Error('Backend não respondeu após várias tentativas');
    }

    async function carregarDados() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const json = await fetchComRetry(`${apiUrl}/api/indicadores`);
        setIndicadores(json.indicadores || []);
      } catch (err: any) {
        setErro('Não foi possível carregar os indicadores. O servidor pode estar iniciando...');
        console.error(err);
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, []);

  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  return (
    <main style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Dashboard de Indicadores</h1>

      {carregando && <p style={{ color: '#666' }}>Carregando dados...</p>}
      {erro && <p style={{ color: 'red' }}>{erro}</p>}

      {!carregando && indicadores.length === 0 && !erro && (
        <p>Nenhum indicador encontrado.</p>
      )}

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