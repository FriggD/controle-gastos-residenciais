using ControleGastos.Domain.Enums;

namespace ControleGastos.Application.DTOs;

public record PessoaDto(Guid Id, string Nome, int Idade);

public record CategoriaDto(Guid Id, string Descricao, FinalidadeCategoria Finalidade);

public record TransacaoDto(Guid Id, string Descricao, decimal Valor, TipoTransacao Tipo, Guid CategoriaId, Guid PessoaId);

public record TotalPorPessoaDto(Guid PessoaId, string Nome, decimal TotalReceitas, decimal TotalDespesas, decimal Saldo);

public record TotalGeralDto(decimal TotalReceitas, decimal TotalDespesas, decimal Saldo);

public record TotalPorCategoriaDto(Guid CategoriaId, string Descricao, decimal TotalReceitas, decimal TotalDespesas, decimal Saldo);
