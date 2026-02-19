export enum TipoTransacao {
  Despesa = 1,
  Receita = 2,
}

export enum FinalidadeCategoria {
  Despesa = 1,
  Receita = 2,
  Ambas = 3,
}

export interface Pessoa {
  id: string;
  nome: string;
  idade: number;
}

export interface Categoria {
  id: string;
  descricao: string;
  finalidade: FinalidadeCategoria;
}

export interface Transacao {
  id: string;
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  categoriaId: string;
  pessoaId: string;
}

export interface TotalPorPessoa {
  pessoaId: string;
  nome: string;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

export interface TotalGeral {
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

export interface TotalPorCategoria {
  categoriaId: string;
  descricao: string;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}
