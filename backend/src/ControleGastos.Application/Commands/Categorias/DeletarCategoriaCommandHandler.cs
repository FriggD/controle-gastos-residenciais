using ControleGastos.Domain.Repositories;
using MediatR;

namespace ControleGastos.Application.Commands.Categorias;

public class DeletarCategoriaCommandHandler : IRequestHandler<DeletarCategoriaCommand, Unit>
{
    private readonly ICategoriaRepository _categoriaRepository;

    public DeletarCategoriaCommandHandler(ICategoriaRepository categoriaRepository)
    {
        _categoriaRepository = categoriaRepository;
    }

    public async Task<Unit> Handle(DeletarCategoriaCommand request, CancellationToken cancellationToken)
    {
        var categoria = await _categoriaRepository.ObterPorIdAsync(request.Id);
        if (categoria == null)
            throw new Exception("Categoria não encontrada");

        await _categoriaRepository.DeletarAsync(request.Id);
        return Unit.Value;
    }
}
