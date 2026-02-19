import { useState, useEffect } from 'react';
import { transacaoService, pessoaService, categoriaService } from '../services/api';
import type { Transacao, Pessoa, Categoria } from '../types';
import { TipoTransacao } from '../types';
import Button from '../components/Button';
import PageHeader from '../components/PageHeader';

const TransacoesPage = () => {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [tipo, setTipo] = useState<TipoTransacao>(TipoTransacao.Despesa);
  const [categoriaId, setCategoriaId] = useState('');
  const [pessoaId, setPessoaId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [transacoesRes, pessoasRes, categoriasRes] = await Promise.all([
        transacaoService.getAll(),
        pessoaService.getAll(),
        categoriaService.getAll(),
      ]);
      setTransacoes(transacoesRes.data);
      setPessoas(pessoasRes.data);
      setCategorias(categoriasRes.data);
    } catch (err) {
      setError('Erro ao carregar dados');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await transacaoService.create({
        descricao,
        valor: parseFloat(parseFloat(valor).toFixed(2)),
        tipo,
        categoriaId,
        pessoaId,
      });
      setDescricao('');
      setValor('');
      setTipo(TipoTransacao.Despesa);
      setCategoriaId('');
      setPessoaId('');
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao salvar transação');
    }
  };

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.replace(',', '.');
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setValor(value);
    }
  };

  const getPessoaNome = (id: string) => pessoas.find((p) => p.id === id)?.nome || '';
  const getCategoriaNome = (id: string) => categorias.find((c) => c.id === id)?.descricao || '';

  return (
    <div className="container">
      <PageHeader
        title="Gerenciamento de Transações"
        subtitle="Cadastre e gerencie as transações do sistema"
        icon="payments"
      />

      {error && (
        <div className="alert alert-error">
          <span className="material-symbols-outlined">error</span>
          {error}
        </div>
      )}

      <div className="card">
        <h2>
          <span className="material-symbols-outlined">add</span>
          Nova Transação
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-2">
            <div className="form-group">
              <label>Descrição</label>
              <input
                type="text"
                className="form-control"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                required
                maxLength={400}
              />
            </div>
            <div className="form-group">
              <label>Valor</label>
              <input
                type="text"
                className="form-control"
                value={valor}
                onChange={handleValorChange}
                required
                placeholder="0.00"
              />
            </div>
            <div className="form-group">
              <label>Tipo</label>
              <select
                className="form-control"
                value={tipo}
                onChange={(e) => setTipo(parseInt(e.target.value) as TipoTransacao)}
              >
                <option value={TipoTransacao.Despesa}>Despesa</option>
                <option value={TipoTransacao.Receita}>Receita</option>
              </select>
            </div>
            <div className="form-group">
              <label>Pessoa</label>
              <select
                className="form-control"
                value={pessoaId}
                onChange={(e) => setPessoaId(e.target.value)}
                required
              >
                <option value="">Selecione...</option>
                {pessoas.map((pessoa) => (
                  <option key={pessoa.id} value={pessoa.id}>
                    {pessoa.nome}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Categoria</label>
              <select
                className="form-control"
                value={categoriaId}
                onChange={(e) => setCategoriaId(e.target.value)}
                required
              >
                <option value="">Selecione...</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.descricao}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <Button type="submit" variant="primary" icon="add">
            Cadastrar
          </Button>
        </form>
      </div>

      <div className="card">
        <h2>
          <span className="material-symbols-outlined">list</span>
          Transações Cadastradas
        </h2>
        <div className="table-container">
          <table className="table">
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Valor</th>
              <th>Tipo</th>
              <th>Pessoa</th>
              <th>Categoria</th>
            </tr>
          </thead>
          <tbody>
            {transacoes.map((transacao) => (
              <tr key={transacao.id}>
                <td>{transacao.descricao}</td>
                <td>R$ {transacao.valor.toFixed(2)}</td>
                <td>{transacao.tipo === TipoTransacao.Despesa ? 'Despesa' : 'Receita'}</td>
                <td>{getPessoaNome(transacao.pessoaId)}</td>
                <td>{getCategoriaNome(transacao.categoriaId)}</td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransacoesPage;
