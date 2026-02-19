using MediatR;

namespace ControleGastos.Application.Commands.Pessoas;

/// <summary>
/// Command para deletar pessoa.
/// Ao deletar, todas as transações da pessoa serão removidas (cascade).
/// </summary>
public record DeletarPessoaCommand(Guid Id) : IRequest<Unit>;
