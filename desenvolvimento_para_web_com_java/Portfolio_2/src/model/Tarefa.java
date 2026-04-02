package model;

import java.io.Serializable;

public class Tarefa implements Serializable {

    private int id;
    private String titulo;
    private String descricao;
    private String prioridade;
    private String data;
    private boolean concluida;

    public Tarefa(int id, String titulo, String descricao, String prioridade, String data) {
        this.id = id;
        this.titulo = titulo;
        this.descricao = descricao;
        this.prioridade = prioridade;
        this.data = data;
        this.concluida = false;
    }

    // Getters e Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public String getPrioridade() { return prioridade; }
    public void setPrioridade(String prioridade) { this.prioridade = prioridade; }

    public String getData() { return data; }
    public void setData(String data) { this.data = data; }

    public boolean isConcluida() { return concluida; }
    public void setConcluida(boolean concluida) { this.concluida = concluida; }
}
