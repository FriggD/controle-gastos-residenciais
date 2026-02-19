using ControleGastos.Application.DTOs;
using ControleGastos.Domain.Enums;
using ControleGastos.Domain.Repositories;
using MediatR;

namespace ControleGastos.Application.Queries.Transacoes;

public record ObterTodasTransacoesQuery : IRequest<IEnumerable<TransacaoDto>>;

public class ObterTodasTransacoesQueryHandler : IRequestHandler<ObterTodasTransacoesQuery, IEnumerable<TransacaoDto>>
{
    private readonly ITransacaoRepository _repository;

    public ObterTodasTransacoesQueryHandler(ITransacaoRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<TransacaoDto>> Handle(ObterTodasTransacoesQuery request, CancellationToken cancellationToken)
    {
        var transacoes = await _repository.ObterTodosAsync();
        return transacoes.Select(t => new TransacaoDto(t.Id, t.Descricao, t.Valor, t.Tipo, t.CategoriaId, t.PessoaId));
    }
}

/// <summary>
/// Query para obter totais por pessoa com saldo.
/// Retorna lista de pessoas com receitas, despesas e saldo, mais total geral.
/// </summary>
public record ObterTotaisPorPessoaQuery : IRequest<(IEnumerable<TotalPorPessoaDto> Totais, TotalGeralDto TotalGeral)>;

public class ObterTotaisPorPessoaQueryHandler : IRequestHandler<ObterTotaisPorPessoaQuery, (IEnumerable<TotalPorPessoaDto>, TotalGeralDto)>
{
    private readonly IPessoaRepository _pessoaRepository;
    private readonly ITransacaoRepository _transacaoRepository;

    public ObterTotaisPorPessoaQueryHandler(IPessoaRepository pessoaRepository, ITransacaoRepository transacaoRepository)
    {
        _pessoaRepository = pessoaRepository;
        _transacaoRepository = transacaoRepository;
    }

    public async Task<(IEnumerable<TotalPorPessoaDto>, TotalGeralDto)> Handle(ObterTotaisPorPessoaQuery request, CancellationToken cancellationToken)
    {
        var pessoas = await _pessoaRepository.ObterTodosAsync();
        var transacoes = await _transacaoRepository.ObterTodosAsync();

        var totaisPorPessoa = pessoas.Select(p =>
        {
            var transacoesPessoa = transacoes.Where(t => t.PessoaId == p.Id);
            var receitas = transacoesPessoa.Where(t => t.Tipo == TipoTransacao.Receita).Sum(t => t.Valor);
            var despesas = transacoesPessoa.Where(t => t.Tipo == TipoTransacao.Despesa).Sum(t => t.Valor);
            return new TotalPorPessoaDto(p.Id, p.Nome, receitas, despesas, receitas - despesas);
        }).ToList();

        var totalReceitas = totaisPorPessoa.Sum(t => t.TotalReceitas);
        var totalDespesas = totaisPorPessoa.Sum(t => t.TotalDespesas);
        var totalGeral = new TotalGeralDto(totalReceitas, totalDespesas, totalReceitas - totalDespesas);

        return (totaisPorPessoa, totalGeral);
    }
}

/// <summary>
/// Query para obter totais por categoria (funcionalidade opcional).
/// </summary>
public record ObterTotaisPorCategoriaQuery : IRequest<(IEnumerable<TotalPorCategoriaDto> Totais, TotalGeralDto TotalGeral)>;

public class ObterTotaisPorCategoriaQueryHandler : IRequestHandler<ObterTotaisPorCategoriaQuery, (IEnumerable<TotalPorCategoriaDto>, TotalGeralDto)>
{
    private readonly ICategoriaRepository _categoriaRepository;
    private readonly ITransacaoRepository _transacaoRepository;

    public ObterTotaisPorCategoriaQueryHandler(ICategoriaRepository categoriaRepository, ITransacaoRepository transacaoRepository)
    {
        _categoriaRepository = categoriaRepository;
        _transacaoRepository = transacaoRepository;
    }

    public async Task<(IEnumerable<TotalPorCategoriaDto>, TotalGeralDto)> Handle(ObterTotaisPorCategoriaQuery request, CancellationToken cancellationToken)
    {
        var categorias = await _categoriaRepository.ObterTodosAsync();
        var transacoes = await _transacaoRepository.ObterTodosAsync();

        var totaisPorCategoria = categorias.Select(c =>
        {
            var transacoesCategoria = transacoes.Where(t => t.CategoriaId == c.Id);
            var receitas = transacoesCategoria.Where(t => t.Tipo == TipoTransacao.Receita).Sum(t => t.Valor);
            var despesas = transacoesCategoria.Where(t => t.Tipo == TipoTransacao.Despesa).Sum(t => t.Valor);
            return new TotalPorCategoriaDto(c.Id, c.Descricao, receitas, despesas, receitas - despesas);
        }).ToList();

        var totalReceitas = totaisPorCategoria.Sum(t => t.TotalReceitas);
        var totalDespesas = totaisPorCategoria.Sum(t => t.TotalDespesas);
        var totalGeral = new TotalGeralDto(totalReceitas, totalDespesas, totalReceitas - totalDespesas);

        return (totaisPorCategoria, totalGeral);
    }
}
