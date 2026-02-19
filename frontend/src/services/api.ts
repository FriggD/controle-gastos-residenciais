import axios from 'axios';
import type { Pessoa, Categoria, Transacao, TotalPorPessoa, TotalGeral, TotalPorCategoria } from '../types';
import { FinalidadeCategoria, TipoTransacao } from '../types';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Pessoas
export const pessoaService = {
  getAll: () => api.get<Pessoa[]>('/pessoas'),
  getById: (id: string) => api.get<Pessoa>(`/pessoas/${id}`),
  create: (data: { nome: string; idade: number }) => api.post<Pessoa>('/pessoas', data),
  update: (id: string, data: { nome: string; idade: number }) => 
    api.put<Pessoa>(`/pessoas/${id}`, { id, ...data }),
  delete: (id: string) => api.delete(`/pessoas/${id}`),
};

// Categorias
export const categoriaService = {
  getAll: () => api.get<Categoria[]>('/categorias'),
  create: (data: { descricao: string; finalidade: FinalidadeCategoria }) => 
    api.post<Categoria>('/categorias', data),
  update: (id: string, data: { descricao: string; finalidade: FinalidadeCategoria }) => 
    api.put<Categoria>(`/categorias/${id}`, { id, ...data }),
  delete: (id: string) => api.delete(`/categorias/${id}`),
};

// Transações
export const transacaoService = {
  getAll: () => api.get<Transacao[]>('/transacoes'),
  create: (data: { 
    descricao: string; 
    valor: number; 
    tipo: TipoTransacao; 
    categoriaId: string; 
    pessoaId: string 
  }) => api.post<Transacao>('/transacoes', data),
  delete: (id: string) => api.delete(`/transacoes/${id}`),
};

// Relatórios
export const relatorioService = {
  getTotaisPorPessoa: () => 
    api.get<{ totais: TotalPorPessoa[]; totalGeral: TotalGeral }>('/relatorios/totais-por-pessoa'),
  getTotaisPorCategoria: () => 
    api.get<{ totais: TotalPorCategoria[]; totalGeral: TotalGeral }>('/relatorios/totais-por-categoria'),
};
