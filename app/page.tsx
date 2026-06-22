'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function conectarBackend() {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/', {
          // Timeout maior porque o Render free pode estar dormindo
          signal: AbortSignal.timeout(15000)
        });
        if (!res.ok) throw new Error('Erro HTTP: ' + res.status);
        const data = await res.json();
        setMensagem(data.message || 'Conectado!');
      } catch (err) {
        setErro('Backend ainda não respondeu. Pode estar "acordando"...');
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