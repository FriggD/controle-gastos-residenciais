using ControleGastos.Application.Commands.Pessoas;
using ControleGastos.Application.Commands.Categorias;
using ControleGastos.Application.Commands.Transacoes;
using FluentValidation;

namespace ControleGastos.Application.Validators;

public class CriarPessoaCommandValidator : AbstractValidator<CriarPessoaCommand>
{
    public CriarPessoaCommandValidator()
    {
        RuleFor(x => x.Nome)
            .NotEmpty().WithMessage("Nome é obrigatório")
            .MaximumLength(200).WithMessage("Nome deve ter no máximo 200 caracteres");

        RuleFor(x => x.Idade)
            .GreaterThan(0).WithMessage("Idade deve ser maior que zero");
    }
}

public class AtualizarPessoaCommandValidator : AbstractValidator<AtualizarPessoaCommand>
{
    public AtualizarPessoaCommandValidator()
    {
        RuleFor(x => x.Nome)
            .NotEmpty().WithMessage("Nome é obrigatório")
            .MaximumLength(200).WithMessage("Nome deve ter no máximo 200 caracteres");

        RuleFor(x => x.Idade)
            .GreaterThan(0).WithMessage("Idade deve ser maior que zero");
    }
}

public class CriarCategoriaCommandValidator : AbstractValidator<CriarCategoriaCommand>
{
    public CriarCategoriaCommandValidator()
    {
        RuleFor(x => x.Descricao)
            .NotEmpty().WithMessage("Descrição é obrigatória")
            .MaximumLength(400).WithMessage("Descrição deve ter no máximo 400 caracteres");

        RuleFor(x => x.Finalidade)
            .IsInEnum().WithMessage("Finalidade inválida");
    }
}

public class CriarTransacaoCommandValidator : AbstractValidator<CriarTransacaoCommand>
{
    public CriarTransacaoCommandValidator()
    {
        RuleFor(x => x.Descricao)
            .NotEmpty().WithMessage("Descrição é obrigatória")
            .MaximumLength(400).WithMessage("Descrição deve ter no máximo 400 caracteres");

        RuleFor(x => x.Valor)
            .GreaterThan(0).WithMessage("Valor deve ser maior que zero");

        RuleFor(x => x.Tipo)
            .IsInEnum().WithMessage("Tipo inválido");

        RuleFor(x => x.CategoriaId)
            .NotEmpty().WithMessage("Categoria é obrigatória");

        RuleFor(x => x.PessoaId)
            .NotEmpty().WithMessage("Pessoa é obrigatória");
    }
}
