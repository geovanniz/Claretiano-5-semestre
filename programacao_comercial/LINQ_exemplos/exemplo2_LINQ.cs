using System;
using System.Collections.Generic;
using System.Linq;
using MySql.Data.MySqlClient;

// ============================================================
// Exemplo 2 — LINQ integrado com MySQL
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
        string connStr = "Server=localhost;Database=Escola;Uid=alunoadm;Pwd=123456;";

        List<Aluno> alunos = new List<Aluno>();

        try
        {
            using (MySqlConnection conn = new MySqlConnection(connStr))
            {
                conn.Open();
                Console.WriteLine("Conexão com o banco estabelecida com sucesso.\n");

                string sql = "SELECT nome, idade, nota FROM alunos";
                MySqlCommand cmd = new MySqlCommand(sql, conn);

                using (MySqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        alunos.Add(new Aluno
                        {
                            Nome  = reader.GetString("nome"),
                            Idade = reader.GetInt32("idade"),
                            Nota  = reader.GetDouble("nota")
                        });
                    }
                }
            }
        }
        catch (MySqlException ex)
        {
            Console.WriteLine($"Erro de conexão com o banco: {ex.Message}");
            Console.WriteLine("Verifique a string de conexão e se o servidor MySQL está em execução.");
            return;
        }

        Console.WriteLine($"Alunos carregados do banco: {alunos.Count}");
        Console.WriteLine();


        var aprovados = from   aluno in alunos
                        where  aluno.Nota > 7
                        orderby aluno.Nota descending
                        select aluno;

        Console.WriteLine("=== Alunos aprovados (nota > 7) ===");
        foreach (var aluno in aprovados)
        {
            Console.WriteLine($"  {aluno.Nome,-10} | Idade: {aluno.Idade} | Nota: {aluno.Nota:F1}");
        }

        Console.WriteLine();

        double media = alunos.Average(a => a.Nota);
        Console.WriteLine($"Média geral da turma : {media:F2}");

        int totalAprovados = alunos.Count(a => a.Nota > 7);
        Console.WriteLine($"Total de aprovados   : {totalAprovados}");

        var destaque = alunos.OrderByDescending(a => a.Nota).First();
        Console.WriteLine($"Melhor nota          : {destaque.Nome} ({destaque.Nota})");
    }
}
