using ControleGastos.Domain.Enums;

namespace ControleGastos.Domain.Entities;

/// <summary>
/// Representa uma transação financeira (despesa ou receita).
/// Valida regras de negócio como menor de idade só pode ter despesas.
/// </summary>
public class Transacao
{
    public Guid Id { get; private set; }
    public string Descricao { get; private set; }
    public decimal Valor { get; private set; }
    public TipoTransacao Tipo { get; private set; }
    public Guid CategoriaId { get; private set; }
    public Categoria Categoria { get; private set; }
    public Guid PessoaId { get; private set; }
    public Pessoa Pessoa { get; private set; }

    private Transacao() { }

    public Transacao(string descricao, decimal valor, TipoTransacao tipo, Guid categoriaId, Guid pessoaId)
    {
        Id = Guid.NewGuid();
        Descricao = descricao;
        Valor = valor;
        Tipo = tipo;
        CategoriaId = categoriaId;
        PessoaId = pessoaId;
    }
}
