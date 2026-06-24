'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useSession } from '@/hooks/useSession';
import Login from '@/components/Login';
import ModalIndicador from '@/components/ModalIndicador';
import { apiGet, apiPost, apiPut, apiPutLote, apiDelete } from '@/services/api';

export default function Home() {
  const { session, loading: sessionLoading } = useSession();
  const [indicadores, setIndicadores] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [msgSucesso, setMsgSucesso] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editando, setEditando] = useState<any>(null);
  const [filtroSecretaria, setFiltroSecretaria] = useState('');
  const [filtroDepartamento, setFiltroDepartamento] = useState('');
  const [filtroIndicador, setFiltroIndicador] = useState('');
  const [filtroDono, setFiltroDono] = useState('');
  const [filtroAno, setFiltroAno] = useState('');

  const meses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

  const carregarDados = useCallback(async () => {
    if (!session) return;
    setCarregando(true);
    try {
      const json = await apiGet(session);
      setIndicadores(json.indicadores || []);
    } catch {
      setErro('Erro ao carregar indicadores.');
    } finally {
      setCarregando(false);
    }
  }, [session]);

  useEffect(() => { carregarDados(); }, [carregarDados]);

  // --- CRUD ---
  async function handleCriar(data: any) {
    try {
      await apiPost(session, data);
      setMostrarModal(false);
      setMsgSucesso('Indicador cadastrado!');
      setTimeout(() => setMsgSucesso(''), 3000);
      carregarDados();
    } catch { setErro('Erro ao criar.'); }
  }

  async function handleEditar(data: any) {
    try {
      await apiPut(session, data.id, data);
      setEditando(null);
      setMsgSucesso('Indicador atualizado!');
      setTimeout(() => setMsgSucesso(''), 3000);
      carregarDados();
    } catch { setErro('Erro ao editar.'); }
  }

  async function handleDeletar(id: string) {
    if (!confirm('Excluir este indicador?')) return;
    try {
      await apiDelete(session, id);
      carregarDados();
    } catch { setErro('Erro ao excluir.'); }
  }

  // --- Salvar lançamentos em lote (igual ao original) ---
  async function handleSalvarLancamentos() {
    try {
      const lista = indicadores.map(ind => ({
        id: ind.id,
        lancamentos: ind.lancamentos,
      }));
      await apiPutLote(session, lista);
      setMsgSucesso('Lançamentos salvos!');
      setTimeout(() => setMsgSucesso(''), 3000);
    } catch { setErro('Erro ao salvar lançamentos.'); }
  }

  function handleLancamentoChange(id: string, index: number, value: string) {
    setIndicadores(prev => prev.map(ind =>
      ind.id === id
        ? { ...ind, lancamentos: ind.lancamentos.map((v: number, i: number) => i === index ? (parseFloat(value) || 0) : v) }
        : ind
    ));
  }

  // --- Limpar filtros ---
  function limparFiltros() {
    setFiltroSecretaria('');
    setFiltroDepartamento('');
    setFiltroIndicador('');
    setFiltroDono('');
    setFiltroAno('');
  }

  // --- Filtragem ---
  const filtrados = indicadores.filter(ind => {
    if (filtroSecretaria && !ind.secretaria.toLowerCase().includes(filtroSecretaria.toLowerCase())) return false;
    if (filtroDepartamento && !ind.departamento.toLowerCase().includes(filtroDepartamento.toLowerCase())) return false;
    if (filtroIndicador && !ind.indicador.toLowerCase().includes(filtroIndicador.toLowerCase())) return false;
    if (filtroDono && !ind.dono?.toLowerCase().includes(filtroDono.toLowerCase())) return false;
    if (filtroAno && ind.ano.toString() !== filtroAno) return false;
    return true;
  });

  if (sessionLoading) return <p style={{ padding: '2rem' }}>Carregando...</p>;
  if (!session) return <Login onLogin={() => {}} />;

  return (
    <main style={{ padding: '1.5rem', fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 style={{ color: '#002e6e', margin: 0 }}>Dashboard Estratégico de Indicadores</h1>
        <button onClick={() => supabase.auth.signOut()} style={{ padding: '6px 12px', cursor: 'pointer' }}>Sair</button>
      </div>

      {/* Mensagens */}
      {erro && <p style={{ color: 'red', background: '#ffeeee', padding: 8 }}>{erro}</p>}
      {msgSucesso && <p style={{ color: 'green', background: '#eeffee', padding: 8 }}>{msgSucesso}</p>}

      {/* Ações principais */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <button onClick={() => { setMostrarModal(true); setEditando(null); }} style={btnStyle('#002e6e', 'white')}>
          + Novo Indicador
        </button>
        <button onClick={handleSalvarLancamentos} style={btnStyle('#28a745', 'white')}>
          💾 Salvar Lançamentos na Planilha
        </button>
      </div>

      {/* Filtros (igual ao original) */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center', background: '#f5f5f5', padding: '0.8rem', borderRadius: 6 }}>
        <input placeholder="Secretaria" value={filtroSecretaria} onChange={e => setFiltroSecretaria(e.target.value)} style={inputStyle} />
        <input placeholder="Departamento" value={filtroDepartamento} onChange={e => setFiltroDepartamento(e.target.value)} style={inputStyle} />
        <input placeholder="Indicador" value={filtroIndicador} onChange={e => setFiltroIndicador(e.target.value)} style={inputStyle} />
        <input placeholder="Dono" value={filtroDono} onChange={e => setFiltroDono(e.target.value)} style={inputStyle} />
        <input placeholder="Ano" type="number" value={filtroAno} onChange={e => setFiltroAno(e.target.value)} style={{ ...inputStyle, width: 80 }} />
        <button onClick={limparFiltros} style={btnStyle('#dc3545', 'white')}>❌ Limpar</button>
      </div>

      {/* Tabela de Lançamentos */}
      <h3>📋 Tabela de Lançamentos</h3>
      {carregando && <p>Carregando...</p>}

      {filtrados.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#002e6e', color: 'white' }}>
                <th style={thStyle}>SECRETARIA</th>
                <th style={thStyle}>DEPARTAMENTO</th>
                <th style={thStyle}>INDICADOR</th>
                <th style={thStyle}>DONO</th>
                <th style={thStyle}>DIREÇÃO</th>
                <th style={thStyle}>INFO</th>
                <th style={thStyle}>ANO</th>
                {meses.map(m => <th key={m} style={thStyle}>{m}</th>)}
                <th style={thStyle}>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map(ind => (
                <tr key={ind.id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={tdStyle}>{ind.secretaria}</td>
                  <td style={tdStyle}>{ind.departamento}</td>
                  <td style={tdStyle}>{ind.indicador}</td>
                  <td style={tdStyle}>{ind.dono}</td>
                  <td style={tdStyle}>{ind.direcao === 'cima' ? '↑' : ind.direcao === 'baixo' ? '↓' : '↔'}</td>
                  <td style={tdStyle}>{ind.tipo_info}</td>
                  <td style={tdStyle}>{ind.ano}</td>
                  {ind.lancamentos.map((valor: number, i: number) => (
                    <td key={i} style={{ ...tdStyle, padding: '2px 4px' }}>
                      <input
                        type="number"
                        step="0.01"
                        value={valor}
                        onChange={e => handleLancamentoChange(ind.id, i, e.target.value)}
                        style={{ width: '100%', border: '1px solid #ddd', padding: 2, fontSize: '0.8rem' }}
                      />
                    </td>
                  ))}
                  <td style={tdStyle}>
                    <button onClick={() => setEditando(ind)} style={{ marginRight: 4, cursor: 'pointer', background: 'none', border: 'none' }}>✏️</button>
                    <button onClick={() => handleDeletar(ind.id)} style={{ cursor: 'pointer', background: 'none', border: 'none' }}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!carregando && filtrados.length === 0 && <p>Nenhum indicador encontrado.</p>}

      {/* Modal de Cadastro/Edição */}
      {mostrarModal && <ModalIndicador onSubmit={handleCriar} onClose={() => setMostrarModal(false)} />}
      {editando && <ModalIndicador onSubmit={handleEditar} initialData={editando} onClose={() => setEditando(null)} />}
    </main>
  );
}

// --- Helpers de estilo ---
const thStyle: React.CSSProperties = { padding: '6px 8px', textAlign: 'left', fontWeight: 'bold', border: '1px solid #002e6e', whiteSpace: 'nowrap' };
const tdStyle: React.CSSProperties = { padding: '4px 6px', border: '1px solid #ccc', verticalAlign: 'middle' };

function btnStyle(bg: string, color: string): React.CSSProperties {
  return { padding: '8px 14px', background: bg, color, border: 'none', cursor: 'pointer', fontWeight: 'bold', borderRadius: 4 };
}

const inputStyle: React.CSSProperties = { padding: 6, border: '1px solid #ccc', borderRadius: 4, width: 130 };