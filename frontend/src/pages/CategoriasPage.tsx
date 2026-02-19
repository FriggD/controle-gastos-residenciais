import { useState, useEffect } from 'react';
import { categoriaService } from '../services/api';
import type { Categoria } from '../types';
import { FinalidadeCategoria } from '../types';
import Button from '../components/Button';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';

const CategoriasPage = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [descricao, setDescricao] = useState('');
  const [finalidade, setFinalidade] = useState<FinalidadeCategoria>(FinalidadeCategoria.Ambas);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; categoriaId: string | null }>({ isOpen: false, categoriaId: null });

  useEffect(() => {
    loadCategorias();
  }, []);

  const loadCategorias = async () => {
    try {
      const response = await categoriaService.getAll();
      setCategorias(response.data);
    } catch (err) {
      setError('Erro ao carregar categorias');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (editingId) {
        await categoriaService.update(editingId, { descricao, finalidade });
      } else {
        await categoriaService.create({ descricao, finalidade });
      }
      setDescricao('');
      setFinalidade(FinalidadeCategoria.Ambas);
      setEditingId(null);
      loadCategorias();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao salvar categoria');
    }
  };

  const handleEdit = (categoria: Categoria) => {
    setDescricao(categoria.descricao);
    setFinalidade(categoria.finalidade);
    setEditingId(categoria.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    setDeleteModal({ isOpen: true, categoriaId: id });
  };

  const confirmDelete = async () => {
    if (!deleteModal.categoriaId) return;

    try {
      await categoriaService.delete(deleteModal.categoriaId);
      loadCategorias();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao deletar categoria');
    } finally {
      setDeleteModal({ isOpen: false, categoriaId: null });
    }
  };

  const getFinalidadeLabel = (finalidade: FinalidadeCategoria) => {
    switch (finalidade) {
      case FinalidadeCategoria.Despesa:
        return 'Despesa';
      case FinalidadeCategoria.Receita:
        return 'Receita';
      case FinalidadeCategoria.Ambas:
        return 'Ambas';
      default:
        return '';
    }
  };

  return (
    <div className="container">
      <PageHeader
        title="Gerenciamento de Categorias"
        subtitle="Cadastre e gerencie as categorias do sistema"
        icon="category"
      />

      {error && (
        <div className="alert alert-error">
          <span className="material-symbols-outlined">error</span>
          {error}
        </div>
      )}

      <div className="card">
        <h2>
          <span className="material-symbols-outlined">{editingId ? 'edit' : 'add'}</span>
          {editingId ? 'Editar Categoria' : 'Nova Categoria'}
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
              <label>Finalidade</label>
              <select
                className="form-control"
                value={finalidade}
                onChange={(e) => setFinalidade(parseInt(e.target.value) as FinalidadeCategoria)}
              >
                <option value={FinalidadeCategoria.Despesa}>Despesa</option>
                <option value={FinalidadeCategoria.Receita}>Receita</option>
                <option value={FinalidadeCategoria.Ambas}>Ambas</option>
              </select>
            </div>
          </div>
          <Button type="submit" variant="primary" icon={editingId ? 'check' : 'add'}>
            {editingId ? 'Atualizar' : 'Cadastrar'}
          </Button>
          {editingId && (
            <Button
              variant="secondary"
              icon="close"
              onClick={() => {
                setEditingId(null);
                setDescricao('');
                setFinalidade(FinalidadeCategoria.Ambas);
              }}
            >
              Cancelar
            </Button>
          )}
        </form>
      </div>

      <div className="card">
        <h2>
          <span className="material-symbols-outlined">list</span>
          Categorias Cadastradas
        </h2>
        <div className="table-container">
          <table className="table">
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Finalidade</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((categoria) => (
              <tr key={categoria.id}>
                <td>{categoria.descricao}</td>
                <td>{getFinalidadeLabel(categoria.finalidade)}</td>
                <td>
                  <div className="btn-group">
                    <Button
                      variant="primary"
                      icon="edit"
                      onClick={() => handleEdit(categoria)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="danger"
                      icon="delete"
                      onClick={() => handleDelete(categoria.id)}
                    >
                      Deletar
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      </div>
      <Modal
        isOpen={deleteModal.isOpen}
        title="Confirmar Exclusão"
        onConfirm={confirmDelete}
        onClose={() => setDeleteModal({ isOpen: false, categoriaId: null })}
        confirmText="Excluir"
        confirmVariant="danger"
      >
        <p>Tem certeza que deseja excluir esta categoria?</p>
        <p><strong>Todas as transações desta categoria poderão ser afetadas.</strong></p>
      </Modal>
    </div>
  );
};

export default CategoriasPage;
