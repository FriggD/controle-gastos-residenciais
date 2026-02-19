using ControleGastos.Application.DTOs;
using MediatR;

namespace ControleGastos.Application.Commands.Pessoas;

public record AtualizarPessoaCommand(Guid Id, string Nome, int Idade) : IRequest<PessoaDto>;
