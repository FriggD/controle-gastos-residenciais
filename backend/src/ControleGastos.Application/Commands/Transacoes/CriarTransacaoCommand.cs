using ControleGastos.Application.DTOs;
using ControleGastos.Domain.Enums;
using MediatR;

namespace ControleGastos.Application.Commands.Transacoes;

public record CriarTransacaoCommand(
    string Descricao, 
    decimal Valor, 
    TipoTransacao Tipo, 
    Guid CategoriaId, 
    Guid PessoaId
) : IRequest<TransacaoDto>;
