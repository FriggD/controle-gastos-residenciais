using ControleGastos.Domain.Entities;

namespace ControleGastos.Domain.Repositories;

public interface IPessoaRepository
{
    Task<Pessoa?> ObterPorIdAsync(Guid id);
    Task<IEnumerable<Pessoa>> ObterTodosAsync();
    Task AdicionarAsync(Pessoa pessoa);
    Task AtualizarAsync(Pessoa pessoa);
    Task DeletarAsync(Guid id);
}

public interface ICategoriaRepository
{
    Task<Categoria?> ObterPorIdAsync(Guid id);
    Task<IEnumerable<Categoria>> ObterTodosAsync();
    Task AdicionarAsync(Categoria categoria);
    Task AtualizarAsync(Categoria categoria);
    Task DeletarAsync(Guid id);
}

public interface ITransacaoRepository
{
    Task<IEnumerable<Transacao>> ObterTodosAsync();
    Task AdicionarAsync(Transacao transacao);
    Task<IEnumerable<Transacao>> ObterPorPessoaAsync(Guid pessoaId);
}
