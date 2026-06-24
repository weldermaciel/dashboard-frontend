'use client';

import { useState } from 'react';

type Props = {
  onSubmit: (data: any) => void;
  initialData?: any;
  onClose: () => void;
};

export default function ModalIndicador({ onSubmit, initialData, onClose }: Props) {
  const isEditing = !!initialData;
  const meses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

  const [form, setForm] = useState({
    id: initialData?.id || crypto.randomUUID(),
    secretaria: initialData?.secretaria || '',
    departamento: initialData?.departamento || '',
    indicador: initialData?.indicador || '',
    dono: initialData?.dono || '',
    direcao: initialData?.direcao || 'cima',
    tipo_dados: initialData?.tipo_dados || 'percentual',
    comportamento: initialData?.comportamento || 'mes_a_mes',
    tipo_info: initialData?.tipo_info || 'META',
    ano: initialData?.ano || new Date().getFullYear(),
    lancamentos: initialData?.lancamentos || [0,0,0,0,0,0,0,0,0,0,0,0],
    cor: initialData?.cor || '#002e6e',
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleLancamentoChange(index: number, value: string) {
    const novos = [...form.lancamentos];
    novos[index] = parseFloat(value) || 0;
    setForm(prev => ({ ...prev, lancamentos: novos }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{ background: 'white', padding: '2rem', borderRadius: 8, maxWidth: 700, width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>{isEditing ? 'Editar Indicador' : 'Cadastrar Novo Indicador'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
            <div>
              <label>1. Secretaria</label>
              <input name="secretaria" value={form.secretaria} onChange={handleChange} required style={{ width: '100%', padding: 6 }} />
            </div>
            <div>
              <label>2. Departamento</label>
              <input name="departamento" value={form.departamento} onChange={handleChange} required style={{ width: '100%', padding: 6 }} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label>3. Nome do Indicador</label>
              <input name="indicador" value={form.indicador} onChange={handleChange} required style={{ width: '100%', padding: 6 }} />
            </div>
            <div>
              <label>4. Dono (Responsável)</label>
              <input name="dono" value={form.dono} onChange={handleChange} required style={{ width: '100%', padding: 6 }} />
            </div>
            <div>
              <label>5. Ano Ref.</label>
              <input name="ano" type="number" value={form.ano} onChange={handleChange} required style={{ width: '100%', padding: 6 }} />
            </div>
            <div>
              <label>Direção (O que é bom?)</label>
              <select name="direcao" value={form.direcao} onChange={handleChange} style={{ width: '100%', padding: 6 }}>
                <option value="cima">Melhor para Cima (↑)</option>
                <option value="baixo">Melhor para Baixo (↓)</option>
                <option value="neutro">Sem Direção (↔)</option>
              </select>
            </div>
            <div>
              <label>Tipo de Dados</label>
              <select name="tipo_dados" value={form.tipo_dados} onChange={handleChange} style={{ width: '100%', padding: 6 }}>
                <option value="inteiro">Núm. Inteiro</option>
                <option value="percentual">Percentual (%)</option>
              </select>
            </div>
            <div>
              <label>Comportamento</label>
              <select name="comportamento" value={form.comportamento} onChange={handleChange} style={{ width: '100%', padding: 6 }}>
                <option value="mes_a_mes">Mês a Mês</option>
                <option value="acumulado">Acumulado</option>
              </select>
            </div>
            <div>
              <label>Tipo (Info)</label>
              <select name="tipo_info" value={form.tipo_info} onChange={handleChange} style={{ width: '100%', padding: 6 }}>
                <option value="META">META</option>
                <option value="REAL">REAL</option>
              </select>
            </div>
            <div>
              <label>Cor (hex)</label>
              <input name="cor" type="color" value={form.cor} onChange={handleChange} style={{ width: '100%', padding: 2 }} />
            </div>
          </div>

          {/* Meses (edição inline igual ao original) */}
          <div style={{ marginTop: '1rem' }}>
            <label style={{ fontWeight: 'bold' }}>Lançamentos Mensais:</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 4, marginTop: 4 }}>
              {meses.map((m, i) => (
                <div key={i}>
                  <small>{m}</small>
                  <input type="number" step="0.01" value={form.lancamentos[i]} onChange={e => handleLancamentoChange(i, e.target.value)} style={{ width: '100%', padding: 4 }} />
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
            <button type="submit" style={{ padding: '8px 16px', background: '#002e6e', color: 'white', border: 'none', cursor: 'pointer' }}>
              Confirmar
            </button>
            <button type="button" onClick={onClose} style={{ padding: '8px 16px', cursor: 'pointer' }}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}