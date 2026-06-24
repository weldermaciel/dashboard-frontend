const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getHeaders(session: any) {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session.access_token}`,
    'X-Refresh-Token': session.refresh_token ?? '',
  };
}

export async function apiGet(session: any) {
  const res = await fetch(`${API_URL}/api/indicadores`, { headers: getHeaders(session) });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiPost(session: any, data: any) {
  const res = await fetch(`${API_URL}/api/indicadores`, {
    method: 'POST',
    headers: getHeaders(session),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiPutLote(session: any, lista: any[]) {
  const res = await fetch(`${API_URL}/api/indicadores/lancamentos/lote`, {
    method: 'PUT',
    headers: getHeaders(session),
    body: JSON.stringify(lista),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiPut(session: any, id: string, data: any) {
  const res = await fetch(`${API_URL}/api/indicadores/${id}`, {
    method: 'PUT',
    headers: getHeaders(session),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiDelete(session: any, id: string) {
  const res = await fetch(`${API_URL}/api/indicadores/${id}`, {
    method: 'DELETE',
    headers: getHeaders(session),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}