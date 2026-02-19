namespace ControleGastos.Domain.Entities;

/// <summary>
/// Representa uma pessoa no sistema de controle de gastos.
/// Responsável por armazenar informações básicas da pessoa.
/// </summary>
public class Pessoa
{
    public Guid Id { get; private set; }
    public string Nome { get; private set; }
    public int Idade { get; private set; }
    public ICollection<Transacao> Transacoes { get; private set; }

    private Pessoa() 
    {
        Transacoes = new List<Transacao>();
    }

    public Pessoa(string nome, int idade) : this()
    {
        Id = Guid.NewGuid();
        Nome = nome;
        Idade = idade;
    }

    public void Atualizar(string nome, int idade)
    {
        Nome = nome;
        Idade = idade;
    }

    public bool EhMenorDeIdade() => Idade < 18;
}
