import { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { transacaoService, pessoaService, categoriaService } from '../services/api';
import type { Transacao, Pessoa, Categoria } from '../types';
import { TipoTransacao } from '../types';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const DashboardPage = () => {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroPessoa, setFiltroPessoa] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [busca, setBusca] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;

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
      console.error('Erro ao carregar dados');
    }
  };

  const transacoesFiltradas = useMemo(() => {
    return transacoes.filter((t) => {
      const matchCategoria = !filtroCategoria || t.categoriaId === filtroCategoria;
      const matchPessoa = !filtroPessoa || t.pessoaId === filtroPessoa;
      const matchTipo = !filtroTipo || t.tipo.toString() === filtroTipo;
      const matchBusca = !busca || t.descricao.toLowerCase().includes(busca.toLowerCase());
      return matchCategoria && matchPessoa && matchTipo && matchBusca;
    });
  }, [transacoes, filtroCategoria, filtroPessoa, filtroTipo, busca]);

  const transacoesPaginadas = useMemo(() => {
    const inicio = (paginaAtual - 1) * itensPorPagina;
    return transacoesFiltradas.slice(inicio, inicio + itensPorPagina);
  }, [transacoesFiltradas, paginaAtual]);

  const totalPaginas = Math.ceil(transacoesFiltradas.length / itensPorPagina);

  const dadosGraficoPizza = useMemo(() => {
    const despesasPorCategoria = transacoesFiltradas
      .filter((t) => t.tipo === TipoTransacao.Despesa)
      .reduce((acc, t) => {
        const cat = categorias.find((c) => c.id === t.categoriaId);
        const nome = cat?.descricao || 'Sem categoria';
        acc[nome] = (acc[nome] || 0) + t.valor;
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(despesasPorCategoria).map(([name, value]) => ({ name, value }));
  }, [transacoesFiltradas, categorias]);

  const dadosGraficoLinha = useMemo(() => {
    const porMes = transacoesFiltradas.reduce((acc, t) => {
      const mes = new Date().toLocaleDateString('pt-BR', { month: 'short' });
      if (!acc[mes]) acc[mes] = { mes, receitas: 0, despesas: 0 };
      if (t.tipo === TipoTransacao.Receita) acc[mes].receitas += t.valor;
      else acc[mes].despesas += t.valor;
      return acc;
    }, {} as Record<string, { mes: string; receitas: number; despesas: number }>);

    return Object.values(porMes);
  }, [transacoesFiltradas]);

  const COLORS = ['#6366f1', '#22c55e', '#f87171', '#fbbf24', '#818cf8', '#16a34a'];

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.text('Relatório de Transações', 14, 15);
    
    autoTable(doc, {
      head: [['Descrição', 'Valor', 'Tipo', 'Categoria']],
      body: transacoesFiltradas.map((t) => [
        t.descricao,
        `R$ ${t.valor.toFixed(2)}`,
        t.tipo === TipoTransacao.Despesa ? 'Despesa' : 'Receita',
        categorias.find((c) => c.id === t.categoriaId)?.descricao || '',
      ]),
      startY: 20,
    });
    
    doc.save('relatorio-transacoes.pdf');
  };

  const limparFiltros = () => {
    setFiltroCategoria('');
    setFiltroPessoa('');
    setFiltroTipo('');
    setBusca('');
    setPaginaAtual(1);
  };

  return (
    <div className="container">
      <PageHeader
        title="Dashboard"
        subtitle="Visualize gráficos e análises das suas transações"
        icon="dashboard"
      />

      <div className="card">
        <h2>
          <span className="material-symbols-outlined">filter_alt</span>
          Filtros e Busca
        </h2>
        <div className="grid grid-3">
          <div className="form-group">
            <label>Buscar</label>
            <input
              type="text"
              className="form-control"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por descrição..."
            />
          </div>
          <div className="form-group">
            <label>Categoria</label>
            <select className="form-control" value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}>
              <option value="">Todas</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>{c.descricao}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Pessoa</label>
            <select className="form-control" value={filtroPessoa} onChange={(e) => setFiltroPessoa(e.target.value)}>
              <option value="">Todas</option>
              {pessoas.map((p) => (
                <option key={p.id} value={p.id}>{p.nome}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Tipo</label>
            <select className="form-control" value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
              <option value="">Todos</option>
              <option value="1">Despesa</option>
              <option value="2">Receita</option>
            </select>
          </div>
        </div>
        <div className="btn-group">
          <Button variant="secondary" icon="clear" onClick={limparFiltros}>
            Limpar Filtros
          </Button>
          <Button variant="success" icon="download" onClick={exportarPDF}>
            Exportar PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h2>
            <span className="material-symbols-outlined">pie_chart</span>
            Despesas por Categoria
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={dadosGraficoPizza} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {dadosGraficoPizza.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2>
            <span className="material-symbols-outlined">show_chart</span>
            Receitas vs Despesas
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dadosGraficoLinha}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="receitas" stroke="#22c55e" strokeWidth={2} />
              <Line type="monotone" dataKey="despesas" stroke="#f87171" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h2>
          <span className="material-symbols-outlined">list</span>
          Transações Filtradas ({transacoesFiltradas.length})
        </h2>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Descrição</th>
                <th>Valor</th>
                <th>Tipo</th>
                <th>Categoria</th>
              </tr>
            </thead>
            <tbody>
              {transacoesPaginadas.map((t) => (
                <tr key={t.id}>
                  <td>{t.descricao}</td>
                  <td>R$ {t.valor.toFixed(2)}</td>
                  <td>{t.tipo === TipoTransacao.Despesa ? 'Despesa' : 'Receita'}</td>
                  <td>{categorias.find((c) => c.id === t.categoriaId)?.descricao}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPaginas > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
            <Button
              variant="secondary"
              icon="chevron_left"
              onClick={() => setPaginaAtual((p) => Math.max(1, p - 1))}
              disabled={paginaAtual === 1}
            >
              Anterior
            </Button>
            <span style={{ padding: '0.625rem 1.25rem', display: 'flex', alignItems: 'center' }}>
              Página {paginaAtual} de {totalPaginas}
            </span>
            <Button
              variant="secondary"
              icon="chevron_right"
              onClick={() => setPaginaAtual((p) => Math.min(totalPaginas, p + 1))}
              disabled={paginaAtual === totalPaginas}
            >
              Próxima
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
