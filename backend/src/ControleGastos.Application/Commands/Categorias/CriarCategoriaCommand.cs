using ControleGastos.Application.DTOs;
using ControleGastos.Domain.Enums;
using MediatR;

namespace ControleGastos.Application.Commands.Categorias;

public record CriarCategoriaCommand(string Descricao, FinalidadeCategoria Finalidade) : IRequest<CategoriaDto>;
