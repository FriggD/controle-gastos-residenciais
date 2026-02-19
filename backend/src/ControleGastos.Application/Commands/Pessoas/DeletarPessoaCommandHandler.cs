using ControleGastos.Domain.Repositories;
using MediatR;

namespace ControleGastos.Application.Commands.Pessoas;

public class DeletarPessoaCommandHandler : IRequestHandler<DeletarPessoaCommand, Unit>
{
    private readonly IPessoaRepository _repository;

    public DeletarPessoaCommandHandler(IPessoaRepository repository)
    {
        _repository = repository;
    }

    public async Task<Unit> Handle(DeletarPessoaCommand request, CancellationToken cancellationToken)
    {
        await _repository.DeletarAsync(request.Id);
        return Unit.Value;
    }
}
