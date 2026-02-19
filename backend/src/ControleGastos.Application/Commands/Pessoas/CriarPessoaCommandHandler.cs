using ControleGastos.Application.DTOs;
using ControleGastos.Domain.Entities;
using ControleGastos.Domain.Repositories;
using MediatR;

namespace ControleGastos.Application.Commands.Pessoas;

/// <summary>
/// Handler responsável por processar a criação de pessoa.
/// Cria a entidade e persiste no repositório.
/// </summary>
public class CriarPessoaCommandHandler : IRequestHandler<CriarPessoaCommand, PessoaDto>
{
    private readonly IPessoaRepository _repository;

    public CriarPessoaCommandHandler(IPessoaRepository repository)
    {
        _repository = repository;
    }

    public async Task<PessoaDto> Handle(CriarPessoaCommand request, CancellationToken cancellationToken)
    {
        var pessoa = new Pessoa(request.Nome, request.Idade);
        await _repository.AdicionarAsync(pessoa);
        return new PessoaDto(pessoa.Id, pessoa.Nome, pessoa.Idade);
    }
}
