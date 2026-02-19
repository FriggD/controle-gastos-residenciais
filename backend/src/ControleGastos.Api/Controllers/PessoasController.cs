using ControleGastos.Application.Commands.Pessoas;
using ControleGastos.Application.Queries.Pessoas;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace ControleGastos.Api.Controllers;

/// <summary>
/// Controller para gerenciamento de pessoas.
/// Endpoints: criar, atualizar, deletar e listar pessoas.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class PessoasController : ControllerBase
{
    private readonly IMediator _mediator;

    public PessoasController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Lista todas as pessoas cadastradas.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> ObterTodos()
    {
        var result = await _mediator.Send(new ObterTodasPessoasQuery());
        return Ok(result);
    }

    /// <summary>
    /// Obtém uma pessoa por ID.
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> ObterPorId(Guid id)
    {
        var result = await _mediator.Send(new ObterPessoaPorIdQuery(id));
        return result == null ? NotFound() : Ok(result);
    }

    /// <summary>
    /// Cria uma nova pessoa.
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> Criar([FromBody] CriarPessoaCommand command)
    {
        var result = await _mediator.Send(command);
        return CreatedAtAction(nameof(ObterPorId), new { id = result.Id }, result);
    }

    /// <summary>
    /// Atualiza uma pessoa existente.
    /// </summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> Atualizar(Guid id, [FromBody] AtualizarPessoaCommand command)
    {
        if (id != command.Id)
            return BadRequest("ID da URL não corresponde ao ID do corpo");

        var result = await _mediator.Send(command);
        return Ok(result);
    }

    /// <summary>
    /// Deleta uma pessoa e todas suas transações.
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> Deletar(Guid id)
    {
        await _mediator.Send(new DeletarPessoaCommand(id));
        return NoContent();
    }
}
