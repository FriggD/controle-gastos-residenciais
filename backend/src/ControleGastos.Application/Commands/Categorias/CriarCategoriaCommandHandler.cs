using ControleGastos.Application.DTOs;
using ControleGastos.Domain.Entities;
using ControleGastos.Domain.Repositories;
using MediatR;

namespace ControleGastos.Application.Commands.Categorias;

public class CriarCategoriaCommandHandler : IRequestHandler<CriarCategoriaCommand, CategoriaDto>
{
    private readonly ICategoriaRepository _repository;

    public CriarCategoriaCommandHandler(ICategoriaRepository repository)
    {
        _repository = repository;
    }

    public async Task<CategoriaDto> Handle(CriarCategoriaCommand request, CancellationToken cancellationToken)
    {
        var categoria = new Categoria(request.Descricao, request.Finalidade);
        await _repository.AdicionarAsync(categoria);
        return new CategoriaDto(categoria.Id, categoria.Descricao, categoria.Finalidade);
    }
}
