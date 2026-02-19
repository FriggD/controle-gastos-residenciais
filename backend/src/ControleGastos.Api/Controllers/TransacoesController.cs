using ControleGastos.Application.Commands.Transacoes;
using ControleGastos.Application.Queries.Transacoes;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace ControleGastos.Api.Controllers;

/// <summary>
/// Controller para gerenciamento de transações.
/// Endpoints: criar e listar transações.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class TransacoesController : ControllerBase
{
    private readonly IMediator _mediator;

    public TransacoesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Lista todas as transações cadastradas.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> ObterTodos()
    {
        var result = await _mediator.Send(new ObterTodasTransacoesQuery());
        return Ok(result);
    }

    /// <summary>
    /// Cria uma nova transação.
    /// Valida: menor de idade só pode ter despesas e categoria compatível.
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> Criar([FromBody] CriarTransacaoCommand command)
    {
        var result = await _mediator.Send(command);
        return CreatedAtAction(nameof(ObterTodos), new { id = result.Id }, result);
    }
}
