import { Injectable } from '@angular/core';
import { Chamado } from '../models/chamado.model';
import { Tecnico } from '../models/tecnico.model';

@Injectable({
  providedIn: 'root'
})
export class DadosService {

  // Arrays principais em memória (sem banco de dados / localStorage)
  chamados: Chamado[] = [];
  tecnicos: Tecnico[] = [];

  constructor() {
    this.popularDadosIniciais();
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // CHAMADOS
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Adiciona um novo chamado ao array em memória.
   * O objeto recebido já deve ter o id gerado via gerarIdChamado().
   */
  adicionarChamado(chamado: Chamado): void {
    this.chamados.push(chamado);
  }

  /**
   * Retorna todos os chamados cadastrados.
   */
  listarChamados(): Chamado[] {
    return this.chamados;
  }

  /**
   * Busca um chamado pelo seu id único.
   * Retorna undefined se não encontrado.
   */
  buscarChamadoPorId(id: number): Chamado | undefined {
    return this.chamados.find(c => c.id === id);
  }

  /**
   * Remove um chamado do array pelo id.
   * Não faz nada se o id não existir.
   */
  excluirChamado(id: number): void {
    this.chamados = this.chamados.filter(c => c.id !== id);
  }

  /**
   * Atualiza o status e a observação de um chamado existente.
   * @param id        Id do chamado a ser atualizado
   * @param status    Novo status ('Aberto' | 'Em atendimento' | 'Concluído' | 'Cancelado')
   * @param observacao Texto de observação sobre o atendimento
   */
  atualizarStatus(id: number, status: string, observacao: string): void {
    const chamado = this.buscarChamadoPorId(id);
    if (chamado) {
      chamado.status = status as Chamado['status'];
      chamado.observacao = observacao;
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // TÉCNICOS
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Adiciona um novo técnico ao array em memória.
   * O objeto recebido já deve ter o id gerado via gerarIdTecnico().
   */
  adicionarTecnico(tecnico: Tecnico): void {
    this.tecnicos.push(tecnico);
  }

  /**
   * Retorna todos os técnicos cadastrados (ativos e inativos).
   */
  listarTecnicos(): Tecnico[] {
    return this.tecnicos;
  }

  /**
   * Retorna apenas os técnicos com situação 'Ativo'.
   * Usado no formulário de abertura de chamado.
   */
  listarTecnicosAtivos(): Tecnico[] {
    return this.tecnicos.filter(t => t.situacao === 'Ativo');
  }

  /**
   * Remove um técnico do array pelo id.
   * Não faz nada se o id não existir.
   */
  excluirTecnico(id: number): void {
    this.tecnicos = this.tecnicos.filter(t => t.id !== id);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // UTILITÁRIOS
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Gera o próximo id disponível para chamados.
   * Baseado no tamanho atual do array + 1.
   */
  gerarIdChamado(): number {
    return this.chamados.length + 1;
  }

  /**
   * Gera o próximo id disponível para técnicos.
   * Baseado no tamanho atual do array + 1.
   */
  gerarIdTecnico(): number {
    return this.tecnicos.length + 1;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // RESUMO
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Retorna a contagem de chamados agrupada por status.
   * Utilizado na tela de Resumo para exibir cards de totais.
   */
  getTotalPorStatus(): { aberto: number; emAtendimento: number; concluido: number; cancelado: number } {
    return {
      aberto:        this.chamados.filter(c => c.status === 'Aberto').length,
      emAtendimento: this.chamados.filter(c => c.status === 'Em atendimento').length,
      concluido:     this.chamados.filter(c => c.status === 'Concluído').length,
      cancelado:     this.chamados.filter(c => c.status === 'Cancelado').length,
    };
  }

  /**
   * Retorna a contagem de chamados agrupada por prioridade.
   * Utilizado na tela de Resumo para exibir distribuição de prioridades.
   */
  getTotalPorPrioridade(): { baixa: number; media: number; alta: number; urgente: number } {
    return {
      baixa:   this.chamados.filter(c => c.prioridade === 'Baixa').length,
      media:   this.chamados.filter(c => c.prioridade === 'Média').length,
      alta:    this.chamados.filter(c => c.prioridade === 'Alta').length,
      urgente: this.chamados.filter(c => c.prioridade === 'Urgente').length,
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // DADOS INICIAIS (seed para testes)
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Pré-popula o serviço com 2 técnicos e 2 chamados de exemplo.
   * Chamado automaticamente no construtor. Não usa banco/localStorage.
   */
  private popularDadosIniciais(): void {
    // ── Técnicos de exemplo ──────────────────────────────────────────────────
    this.tecnicos = [
      {
        id: 1,
        nome: 'Carlos Souza',
        especialidade: 'Hardware',
        contato: '(11) 99999-0001',
        situacao: 'Ativo'
      },
      {
        id: 2,
        nome: 'Ana Lima',
        especialidade: 'Software',
        contato: '(11) 99999-0002',
        situacao: 'Ativo'
      }
    ];

    // ── Chamados de exemplo ──────────────────────────────────────────────────
    this.chamados = [
      {
        id: 1,
        solicitante: 'Maria Oliveira',
        setor: 'RH',
        titulo: 'Computador não liga',
        descricao: 'O computador da recepção não está ligando desde hoje de manhã.',
        prioridade: 'Alta',
        dataAbertura: new Date().toLocaleDateString('pt-BR'),
        tecnico: 'Carlos Souza',
        status: 'Aberto',
        observacao: ''
      },
      {
        id: 2,
        solicitante: 'João Pereira',
        setor: 'Financeiro',
        titulo: 'Sistema ERP lento',
        descricao: 'O sistema ERP está muito lento nas últimas horas.',
        prioridade: 'Média',
        dataAbertura: new Date().toLocaleDateString('pt-BR'),
        tecnico: 'Ana Lima',
        status: 'Em atendimento',
        observacao: 'Verificando logs do servidor.'
      }
    ];
  }
}
