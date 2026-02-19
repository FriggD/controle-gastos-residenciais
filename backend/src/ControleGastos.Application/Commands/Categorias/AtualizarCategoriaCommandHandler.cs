using ControleGastos.Application.DTOs;
using ControleGastos.Domain.Repositories;
using MediatR;

namespace ControleGastos.Application.Commands.Categorias;

public class AtualizarCategoriaCommandHandler : IRequestHandler<AtualizarCategoriaCommand, CategoriaDto>
{
    private readonly ICategoriaRepository _categoriaRepository;

    public AtualizarCategoriaCommandHandler(ICategoriaRepository categoriaRepository)
    {
        _categoriaRepository = categoriaRepository;
    }

    public async Task<CategoriaDto> Handle(AtualizarCategoriaCommand request, CancellationToken cancellationToken)
    {
        var categoria = await _categoriaRepository.ObterPorIdAsync(request.Id);
        if (categoria == null)
            throw new Exception("Categoria não encontrada");

        categoria.Atualizar(request.Descricao, request.Finalidade);
        await _categoriaRepository.AtualizarAsync(categoria);

        return new CategoriaDto(categoria.Id, categoria.Descricao, categoria.Finalidade);
    }
}
