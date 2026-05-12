export interface Chamado {
  id: number;
  solicitante: string;
  setor: string;
  titulo: string;
  descricao: string;
  prioridade: 'Baixa' | 'Média' | 'Alta' | 'Urgente';
  dataAbertura: string;
  tecnico: string;
  status: 'Aberto' | 'Em atendimento' | 'Concluído' | 'Cancelado';
  observacao: string;
}
