import { useState, useEffect } from 'react';
import { pessoaService, categoriaService, transacaoService } from '../services/api';
import { FinalidadeCategoria, TipoTransacao } from '../types';
import Button from './Button';
import Modal from './Modal';

const MOCK_IDS_KEY = 'mockDataIds';

const MockDataButtons = () => {
  const [loading, setLoading] = useState(false);
  const [mockIds, setMockIds] = useState<{ pessoas: string[], categorias: string[], transacoes: string[] }>(() => {
    const stored = localStorage.getItem(MOCK_IDS_KEY);
    return stored ? JSON.parse(stored) : { pessoas: [], categorias: [], transacoes: [] };
  });
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [showClearModal, setShowClearModal] = useState(false);

  useEffect(() => {
    localStorage.setItem(MOCK_IDS_KEY, JSON.stringify(mockIds));
  }, [mockIds]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const populateMockData = async () => {
    setLoading(true);
    try {
      const pessoasIds: string[] = [];
      const categoriasIds: string[] = [];
      const transacoesIds: string[] = [];

      const pessoas = [
        { nome: 'João Silva', idade: 30 },
        { nome: 'Maria Santos', idade: 25 },
        { nome: 'Pedro Costa', idade: 17 },
      ];

      for (const pessoa of pessoas) {
        const res = await pessoaService.create(pessoa);
        pessoasIds.push(res.data.id);
      }

      const categorias = [
        { descricao: 'Alimentação', finalidade: FinalidadeCategoria.Despesa },
        { descricao: 'Salário', finalidade: FinalidadeCategoria.Receita },
        { descricao: 'Transporte', finalidade: FinalidadeCategoria.Ambas },
      ];

      for (const categoria of categorias) {
        const res = await categoriaService.create(categoria);
        categoriasIds.push(res.data.id);
      }

      const transacoes = [
        { descricao: 'Compra supermercado', valor: 150.50, tipo: TipoTransacao.Despesa, pessoaId: pessoasIds[0], categoriaId: categoriasIds[0] },
        { descricao: 'Salário mensal', valor: 3000, tipo: TipoTransacao.Receita, pessoaId: pessoasIds[1], categoriaId: categoriasIds[1] },
        { descricao: 'Uber', valor: 25.80, tipo: TipoTransacao.Despesa, pessoaId: pessoasIds[0], categoriaId: categoriasIds[2] },
        { descricao: 'Lanche escola', valor: 15, tipo: TipoTransacao.Despesa, pessoaId: pessoasIds[2], categoriaId: categoriasIds[0] },
      ];

      for (const transacao of transacoes) {
        const res = await transacaoService.create(transacao);
        transacoesIds.push(res.data.id);
      }

      const newMockIds = {
        pessoas: [...mockIds.pessoas, ...pessoasIds],
        categorias: [...mockIds.categorias, ...categoriasIds],
        transacoes: [...mockIds.transacoes, ...transacoesIds]
      };
      
      localStorage.setItem(MOCK_IDS_KEY, JSON.stringify(newMockIds));
      setMockIds(newMockIds);
      showToast('Dados mockados criados com sucesso!', 'success');
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      showToast('Erro ao criar dados mockados', 'error');
      setLoading(false);
    }
  };

  const clearMockData = async () => {
    if (mockIds.pessoas.length === 0 && mockIds.categorias.length === 0) {
      showToast('Nenhum dado mockado para limpar', 'error');
      return;
    }
    setShowClearModal(true);
  };

  const confirmClearData = async () => {
    setShowClearModal(false);
    setLoading(true);
    try {
      for (const id of mockIds.pessoas) {
        try {
          await pessoaService.delete(id);
        } catch (err) {
          console.error(`Erro ao deletar pessoa ${id}:`, err);
        }
      }

      for (const id of mockIds.categorias) {
        try {
          await categoriaService.delete(id);
        } catch (err) {
          console.error(`Erro ao deletar categoria ${id}:`, err);
        }
      }

      setMockIds({ pessoas: [], categorias: [], transacoes: [] });
      localStorage.removeItem(MOCK_IDS_KEY);
      showToast('Dados mockados removidos com sucesso!', 'success');
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      showToast('Erro ao remover dados mockados', 'error');
      setLoading(false);
    }
  };

  return (
    <>
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          <span className="material-symbols-outlined">
            {toast.type === 'success' ? 'check_circle' : 'error'}
          </span>
          <span>{toast.message}</span>
        </div>
      )}
      <div style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        display: 'flex',
        gap: '0.5rem',
        zIndex: 1000
      }}>
        <Button
          variant="success"
          icon="add_circle"
          onClick={populateMockData}
          disabled={loading}
          className="shadow-lg"
        >
          Popular Dados
        </Button>
        <Button
          variant="danger"
          icon="delete_sweep"
          onClick={clearMockData}
          disabled={loading}
          className="shadow-lg"
        >
          Limpar Dados
        </Button>
      </div>
      <Modal
        isOpen={showClearModal}
        title="Confirmar Limpeza de Dados"
        onConfirm={confirmClearData}
        onClose={() => setShowClearModal(false)}
        confirmText="Limpar Tudo"
        confirmVariant="danger"
      >
        <p>Você tem certeza que deseja limpar todos os dados mockados?</p>
        <p><strong>Esta ação não pode ser desfeita.</strong></p>
      </Modal>
    </>
  );
};

export default MockDataButtons;
