using ControleGastos.Application.DTOs;
using ControleGastos.Domain.Entities;
using ControleGastos.Domain.Enums;
using ControleGastos.Domain.Repositories;
using MediatR;

namespace ControleGastos.Application.Commands.Transacoes;

/// <summary>
/// Handler responsável por criar transação.
/// Valida: menor de idade só pode ter despesas e categoria compatível com tipo.
/// </summary>
public class CriarTransacaoCommandHandler : IRequestHandler<CriarTransacaoCommand, TransacaoDto>
{
    private readonly ITransacaoRepository _transacaoRepository;
    private readonly IPessoaRepository _pessoaRepository;
    private readonly ICategoriaRepository _categoriaRepository;

    public CriarTransacaoCommandHandler(
        ITransacaoRepository transacaoRepository,
        IPessoaRepository pessoaRepository,
        ICategoriaRepository categoriaRepository)
    {
        _transacaoRepository = transacaoRepository;
        _pessoaRepository = pessoaRepository;
        _categoriaRepository = categoriaRepository;
    }

    public async Task<TransacaoDto> Handle(CriarTransacaoCommand request, CancellationToken cancellationToken)
    {
        var pessoa = await _pessoaRepository.ObterPorIdAsync(request.PessoaId)
            ?? throw new KeyNotFoundException("Pessoa não encontrada");

        var categoria = await _categoriaRepository.ObterPorIdAsync(request.CategoriaId)
            ?? throw new KeyNotFoundException("Categoria não encontrada");

        // Regra: menor de idade só pode ter despesas
        if (pessoa.EhMenorDeIdade() && request.Tipo == TipoTransacao.Receita)
            throw new InvalidOperationException("Menor de idade não pode ter receitas");

        // Regra: categoria deve aceitar o tipo de transação
        if (!categoria.AceitaTipoTransacao(request.Tipo))
            throw new InvalidOperationException("Categoria não aceita este tipo de transação");

        var transacao = new Transacao(
            request.Descricao,
            request.Valor,
            request.Tipo,
            request.CategoriaId,
            request.PessoaId);

        await _transacaoRepository.AdicionarAsync(transacao);

        return new TransacaoDto(
            transacao.Id,
            transacao.Descricao,
            transacao.Valor,
            transacao.Tipo,
            transacao.CategoriaId,
            transacao.PessoaId);
    }
}
