'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  useEffect(() => {
async function fetchWithRetry(url: string, options = {}, retries = 3, delay = 1000) {
      for (let i = 0; i < retries; i++) {
        try {
          const response = await fetch(url, { signal: AbortSignal.timeout(10000) });
          if (response.ok) return response.json();
        } catch (err) {
          console.log(`Tentativa ${i + 1} falhou, tentando novamente...`);
        }
        // Aguarda antes de tentar de novo (dobra o tempo a cada tentativa)
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      }
      throw new Error('Backend não respondeu após várias tentativas');
    }

    async function conectarBackend() {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      try {
        const data = await fetchWithRetry(`${apiUrl}/`, 4, 2000);
        setMensagem(data.message || 'Conectado!');
      } catch (err) {
        setErro('Backend demorou para acordar. Tente recarregar a página.');
        console.error(err);
      }
    }
    conectarBackend();
  }, []);

  return (
    <main style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Dashboard de Indicadores</h1>
      {erro && <p style={{ color: 'orange' }}>{erro}</p>}
      {mensagem && <p style={{ color: 'green' }}>Backend: {mensagem}</p>}
    </main>
  );
}