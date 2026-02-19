using ControleGastos.Application.DTOs;
using ControleGastos.Domain.Repositories;
using MediatR;

namespace ControleGastos.Application.Queries.Categorias;

public record ObterTodasCategoriasQuery : IRequest<IEnumerable<CategoriaDto>>;

public class ObterTodasCategoriasQueryHandler : IRequestHandler<ObterTodasCategoriasQuery, IEnumerable<CategoriaDto>>
{
    private readonly ICategoriaRepository _repository;

    public ObterTodasCategoriasQueryHandler(ICategoriaRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<CategoriaDto>> Handle(ObterTodasCategoriasQuery request, CancellationToken cancellationToken)
    {
        var categorias = await _repository.ObterTodosAsync();
        return categorias.Select(c => new CategoriaDto(c.Id, c.Descricao, c.Finalidade));
    }
}
