import { useState, useEffect } from 'react';
import { relatorioService } from '../services/api';
import type { TotalPorPessoa, TotalPorCategoria, TotalGeral } from '../types';
import PageHeader from '../components/PageHeader';

const RelatoriosPage = () => {
  const [totaisPorPessoa, setTotaisPorPessoa] = useState<TotalPorPessoa[]>([]);
  const [totalGeralPessoas, setTotalGeralPessoas] = useState<TotalGeral | null>(null);
  const [totaisPorCategoria, setTotaisPorCategoria] = useState<TotalPorCategoria[]>([]);
  const [totalGeralCategorias, setTotalGeralCategorias] = useState<TotalGeral | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadRelatorios();
  }, []);

  const loadRelatorios = async () => {
    try {
      const [pessoasRes, categoriasRes] = await Promise.all([
        relatorioService.getTotaisPorPessoa(),
        relatorioService.getTotaisPorCategoria(),
      ]);
      setTotaisPorPessoa(pessoasRes.data.totais);
      setTotalGeralPessoas(pessoasRes.data.totalGeral);
      setTotaisPorCategoria(categoriasRes.data.totais);
      setTotalGeralCategorias(categoriasRes.data.totalGeral);
    } catch (err) {
      setError('Erro ao carregar relatórios');
    }
  };

  const formatCurrency = (value: number) => `R$ ${value.toFixed(2)}`;

  return (
    <div className="container">
      <PageHeader
        title="Relatórios"
        subtitle="Visualize os totais e saldos do sistema"
        icon="assessment"
      />

      {error && (
        <div className="alert alert-error">
          <span className="material-symbols-outlined">error</span>
          {error}
        </div>
      )}

      <div className="card">
        <h2>
          <span className="material-symbols-outlined">person</span>
          Totais por Pessoa
        </h2>
        <div className="table-container">
          <table className="table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Total Receitas</th>
              <th>Total Despesas</th>
              <th>Saldo</th>
            </tr>
          </thead>
          <tbody>
            {totaisPorPessoa.map((total) => (
              <tr key={total.pessoaId}>
                <td>{total.nome}</td>
                <td style={{ color: 'var(--success)' }}>{formatCurrency(total.totalReceitas)}</td>
                <td style={{ color: 'var(--danger)' }}>{formatCurrency(total.totalDespesas)}</td>
                <td style={{ fontWeight: 'bold', color: total.saldo >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                  {formatCurrency(total.saldo)}
                </td>
              </tr>
            ))}
          </tbody>
          {totalGeralPessoas && (
            <tfoot>
              <tr style={{ fontWeight: 'bold', backgroundColor: 'var(--gray-100)' }}>
                <td>TOTAL GERAL</td>
                <td style={{ color: 'var(--success)' }}>{formatCurrency(totalGeralPessoas.totalReceitas)}</td>
                <td style={{ color: 'var(--danger)' }}>{formatCurrency(totalGeralPessoas.totalDespesas)}</td>
                <td style={{ color: totalGeralPessoas.saldo >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                  {formatCurrency(totalGeralPessoas.saldo)}
                </td>
              </tr>
            </tfoot>
          )}
          </table>
        </div>
      </div>

      <div className="card">
        <h2>
          <span className="material-symbols-outlined">category</span>
          Totais por Categoria
        </h2>
        <div className="table-container">
          <table className="table">
          <thead>
            <tr>
              <th>Categoria</th>
              <th>Total Receitas</th>
              <th>Total Despesas</th>
              <th>Saldo</th>
            </tr>
          </thead>
          <tbody>
            {totaisPorCategoria.map((total) => (
              <tr key={total.categoriaId}>
                <td>{total.descricao}</td>
                <td style={{ color: 'var(--success)' }}>{formatCurrency(total.totalReceitas)}</td>
                <td style={{ color: 'var(--danger)' }}>{formatCurrency(total.totalDespesas)}</td>
                <td style={{ fontWeight: 'bold', color: total.saldo >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                  {formatCurrency(total.saldo)}
                </td>
              </tr>
            ))}
          </tbody>
          {totalGeralCategorias && (
            <tfoot>
              <tr style={{ fontWeight: 'bold', backgroundColor: 'var(--gray-100)' }}>
                <td>TOTAL GERAL</td>
                <td style={{ color: 'var(--success)' }}>{formatCurrency(totalGeralCategorias.totalReceitas)}</td>
                <td style={{ color: 'var(--danger)' }}>{formatCurrency(totalGeralCategorias.totalDespesas)}</td>
                <td style={{ color: totalGeralCategorias.saldo >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                  {formatCurrency(totalGeralCategorias.saldo)}
                </td>
              </tr>
            </tfoot>
          )}
          </table>
        </div>
      </div>
    </div>
  );
};

export default RelatoriosPage;
