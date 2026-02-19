using ControleGastos.Application.Commands.Categorias;
using ControleGastos.Application.Queries.Categorias;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace ControleGastos.Api.Controllers;

/// <summary>
/// Controller para gerenciamento de categorias.
/// Endpoints: criar e listar categorias.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class CategoriasController : ControllerBase
{
    private readonly IMediator _mediator;

    public CategoriasController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Lista todas as categorias cadastradas.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> ObterTodos()
    {
        var result = await _mediator.Send(new ObterTodasCategoriasQuery());
        return Ok(result);
    }

    /// <summary>
    /// Cria uma nova categoria.
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> Criar([FromBody] CriarCategoriaCommand command)
    {
        var result = await _mediator.Send(command);
        return CreatedAtAction(nameof(ObterTodos), new { id = result.Id }, result);
    }

    /// <summary>
    /// Atualiza uma categoria existente.
    /// </summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> Atualizar(Guid id, [FromBody] AtualizarCategoriaCommand command)
    {
        if (id != command.Id)
            return BadRequest(new { error = "ID da URL não corresponde ao ID do corpo" });

        var result = await _mediator.Send(command);
        return Ok(result);
    }

    /// <summary>
    /// Deleta uma categoria.
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> Deletar(Guid id)
    {
        await _mediator.Send(new DeletarCategoriaCommand(id));
        return NoContent();
    }
}
