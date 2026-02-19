using ControleGastos.Application.DTOs;
using MediatR;

namespace ControleGastos.Application.Commands.Pessoas;

/// <summary>
/// Command para criar uma nova pessoa.
/// </summary>
public record CriarPessoaCommand(string Nome, int Idade) : IRequest<PessoaDto>;
