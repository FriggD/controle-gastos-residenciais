import { useState, useEffect } from 'react';
import { pessoaService } from '../services/api';
import type { Pessoa } from '../types';
import Modal from '../components/Modal';
import Button from '../components/Button';
import PageHeader from '../components/PageHeader';

const PessoasPage = () => {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; pessoaId: string | null }>({ isOpen: false, pessoaId: null });

  useEffect(() => {
    loadPessoas();
  }, []);

  const loadPessoas = async () => {
    try {
      const response = await pessoaService.getAll();
      setPessoas(response.data);
    } catch (err) {
      setError('Erro ao carregar pessoas');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (editingId) {
        await pessoaService.update(editingId, { nome, idade: parseInt(idade) });
      } else {
        await pessoaService.create({ nome, idade: parseInt(idade) });
      }
      setNome('');
      setIdade('');
      setEditingId(null);
      loadPessoas();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao salvar pessoa');
    }
  };

  const handleEdit = (pessoa: Pessoa) => {
    setNome(pessoa.nome);
    setIdade(pessoa.idade.toString());
    setEditingId(pessoa.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    setDeleteModal({ isOpen: true, pessoaId: id });
  };

  const confirmDelete = async () => {
    if (!deleteModal.pessoaId) return;

    try {
      await pessoaService.delete(deleteModal.pessoaId);
      loadPessoas();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao deletar pessoa');
    } finally {
      setDeleteModal({ isOpen: false, pessoaId: null });
    }
  };

  return (
    <div className="container">
      <PageHeader
        title="Gerenciamento de Pessoas"
        subtitle="Cadastre e gerencie as pessoas do sistema"
        icon="person"
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
          {editingId ? 'Editar Pessoa' : 'Nova Pessoa'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-2">
            <div className="form-group">
              <label>Nome</label>
              <input
                type="text"
                className="form-control"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                maxLength={200}
              />
            </div>
            <div className="form-group">
              <label>Idade</label>
              <input
                type="number"
                className="form-control"
                value={idade}
                onChange={(e) => setIdade(e.target.value)}
                required
                min="1"
              />
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
                setNome('');
                setIdade('');
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
          Pessoas Cadastradas
        </h2>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Idade</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pessoas.length === 0 ? (
                <tr>
                  <td colSpan={3} className="empty-state">
                    <p>Nenhuma pessoa cadastrada ainda</p>
                  </td>
                </tr>
              ) : (
                pessoas.map((pessoa) => (
                  <tr key={pessoa.id}>
                    <td>{pessoa.nome}</td>
                    <td>{pessoa.idade} anos</td>
                    <td>
                      <div className="btn-group">
                        <Button
                          variant="primary"
                          icon="edit"
                          onClick={() => handleEdit(pessoa)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="danger"
                          icon="delete"
                          onClick={() => handleDelete(pessoa.id)}
                        >
                          Deletar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Modal
        isOpen={deleteModal.isOpen}
        title="Confirmar Exclusão"
        onConfirm={confirmDelete}
        onClose={() => setDeleteModal({ isOpen: false, pessoaId: null })}
        confirmText="Excluir"
        confirmVariant="danger"
      >
        <p>Tem certeza que deseja excluir esta pessoa?</p>
        <p><strong>Todas as transações desta pessoa serão deletadas.</strong></p>
      </Modal>
    </div>
  );
};

export default PessoasPage;
