using ControleGastos.Domain.Enums;

namespace ControleGastos.Domain.Entities;

/// <summary>
/// Representa uma categoria de transação.
/// Define a finalidade (despesa, receita ou ambas).
/// </summary>
public class Categoria
{
    public Guid Id { get; private set; }
    public string Descricao { get; private set; }
    public FinalidadeCategoria Finalidade { get; private set; }
    public ICollection<Transacao> Transacoes { get; private set; }

    private Categoria()
    {
        Transacoes = new List<Transacao>();
    }

    public Categoria(string descricao, FinalidadeCategoria finalidade) : this()
    {
        Id = Guid.NewGuid();
        Descricao = descricao;
        Finalidade = finalidade;
    }

    /// <summary>
    /// Verifica se a categoria aceita o tipo de transação informado.
    /// </summary>
    public bool AceitaTipoTransacao(TipoTransacao tipo)
    {
        return Finalidade == FinalidadeCategoria.Ambas ||
               (Finalidade == FinalidadeCategoria.Despesa && tipo == TipoTransacao.Despesa) ||
               (Finalidade == FinalidadeCategoria.Receita && tipo == TipoTransacao.Receita);
    }

    /// <summary>
    /// Atualiza os dados da categoria.
    /// </summary>
    public void Atualizar(string descricao, FinalidadeCategoria finalidade)
    {
        Descricao = descricao;
        Finalidade = finalidade;
    }
}
