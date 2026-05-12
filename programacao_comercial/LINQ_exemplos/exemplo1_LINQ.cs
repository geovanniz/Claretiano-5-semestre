using System;
using System.Collections.Generic;
using System.Linq;

// ============================================================
// Exemplo 1 — LINQ com coleção em memória (List<Aluno>)
// Disciplina: Programação Comercial em C#
// ============================================================

public class Aluno
{
    public string Nome  { get; set; }
    public int    Idade { get; set; }
    public double Nota  { get; set; }
}

class Program
{
    static void Main()
    {
        List<Aluno> alunos = new List<Aluno>
        {
            new Aluno { Nome = "João",  Idade = 20, Nota = 8.0 },
            new Aluno { Nome = "Maria", Idade = 22, Nota = 9.5 },
            new Aluno { Nome = "Ana",   Idade = 19, Nota = 7.0 },
            new Aluno { Nome = "Pedro", Idade = 23, Nota = 6.7 }
        };

        var aprovados = from   aluno in alunos
                        where  aluno.Nota > 7
                        orderby aluno.Nota descending
                        select aluno;

        Console.WriteLine("=== Alunos aprovados (nota > 7) ===");
        foreach (var aluno in aprovados)
        {
            Console.WriteLine($"  {aluno.Nome,-10} | Nota: {aluno.Nota:F1}");
        }

        Console.WriteLine();

        double media = alunos.Average(a => a.Nota);
        Console.WriteLine($"Média geral da turma : {media:F2}");

        int total = alunos.Count(a => a.Nota > 7);
        Console.WriteLine($"Total de aprovados   : {total}");

        var maisNota = alunos.OrderByDescending(a => a.Nota).First();
        Console.WriteLine($"Maior nota           : {maisNota.Nome} ({maisNota.Nota})");
    }
}
