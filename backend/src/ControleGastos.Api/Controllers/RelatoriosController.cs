using ControleGastos.Application.Queries.Transacoes;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace ControleGastos.Api.Controllers;

/// <summary>
/// Controller para relatórios e consultas de totais.
/// Endpoints: totais por pessoa e por categoria.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class RelatoriosController : ControllerBase
{
    private readonly IMediator _mediator;

    public RelatoriosController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Obtém totais de receitas, despesas e saldo por pessoa.
    /// Retorna também o total geral de todas as pessoas.
    /// </summary>
    [HttpGet("totais-por-pessoa")]
    public async Task<IActionResult> ObterTotaisPorPessoa()
    {
        var (totais, totalGeral) = await _mediator.Send(new ObterTotaisPorPessoaQuery());
        return Ok(new { totais, totalGeral });
    }

    /// <summary>
    /// Obtém totais de receitas, despesas e saldo por categoria (opcional).
    /// Retorna também o total geral de todas as categorias.
    /// </summary>
    [HttpGet("totais-por-categoria")]
    public async Task<IActionResult> ObterTotaisPorCategoria()
    {
        var (totais, totalGeral) = await _mediator.Send(new ObterTotaisPorCategoriaQuery());
        return Ok(new { totais, totalGeral });
    }
}
