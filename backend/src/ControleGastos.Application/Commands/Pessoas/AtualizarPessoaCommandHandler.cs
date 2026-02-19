using ControleGastos.Application.DTOs;
using ControleGastos.Domain.Repositories;
using MediatR;

namespace ControleGastos.Application.Commands.Pessoas;

public class AtualizarPessoaCommandHandler : IRequestHandler<AtualizarPessoaCommand, PessoaDto>
{
    private readonly IPessoaRepository _repository;

    public AtualizarPessoaCommandHandler(IPessoaRepository repository)
    {
        _repository = repository;
    }

    public async Task<PessoaDto> Handle(AtualizarPessoaCommand request, CancellationToken cancellationToken)
    {
        var pessoa = await _repository.ObterPorIdAsync(request.Id) 
            ?? throw new KeyNotFoundException($"Pessoa com ID {request.Id} não encontrada");
        
        pessoa.Atualizar(request.Nome, request.Idade);
        await _repository.AtualizarAsync(pessoa);
        
        return new PessoaDto(pessoa.Id, pessoa.Nome, pessoa.Idade);
    }
}
