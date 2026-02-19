using ControleGastos.Application.DTOs;
using ControleGastos.Domain.Repositories;
using MediatR;

namespace ControleGastos.Application.Queries.Pessoas;

public record ObterTodasPessoasQuery : IRequest<IEnumerable<PessoaDto>>;

public class ObterTodasPessoasQueryHandler : IRequestHandler<ObterTodasPessoasQuery, IEnumerable<PessoaDto>>
{
    private readonly IPessoaRepository _repository;

    public ObterTodasPessoasQueryHandler(IPessoaRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<PessoaDto>> Handle(ObterTodasPessoasQuery request, CancellationToken cancellationToken)
    {
        var pessoas = await _repository.ObterTodosAsync();
        return pessoas.Select(p => new PessoaDto(p.Id, p.Nome, p.Idade));
    }
}

public record ObterPessoaPorIdQuery(Guid Id) : IRequest<PessoaDto?>;

public class ObterPessoaPorIdQueryHandler : IRequestHandler<ObterPessoaPorIdQuery, PessoaDto?>
{
    private readonly IPessoaRepository _repository;

    public ObterPessoaPorIdQueryHandler(IPessoaRepository repository)
    {
        _repository = repository;
    }

    public async Task<PessoaDto?> Handle(ObterPessoaPorIdQuery request, CancellationToken cancellationToken)
    {
        var pessoa = await _repository.ObterPorIdAsync(request.Id);
        return pessoa == null ? null : new PessoaDto(pessoa.Id, pessoa.Nome, pessoa.Idade);
    }
}
