using MediatR;

namespace ControleGastos.Application.Commands.Categorias;

public record DeletarCategoriaCommand(Guid Id) : IRequest<Unit>;
