'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, senha });
    if (error) {
      setErro(error.message);
    } else {
      onLogin();
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', fontFamily: 'Arial' }}>
      <h1 style={{ color: '#002e6e' }}>Dashboard</h1>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ display: 'block', width: '100%', padding: 8, marginBottom: 8 }}
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={e => setSenha(e.target.value)}
          required
          style={{ display: 'block', width: '100%', padding: 8, marginBottom: 8 }}
        />
        <button type="submit" style={{ padding: '8px 16px', background: '#002e6e', color: 'white', border: 'none', cursor: 'pointer' }}>
          Entrar
        </button>
      </form>
      {erro && <p style={{ color: 'red' }}>{erro}</p>}
    </div>
  );
}