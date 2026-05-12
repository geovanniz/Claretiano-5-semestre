export interface Tecnico {
  id: number;
  nome: string;
  especialidade: 'Hardware' | 'Software' | 'Rede' | 'Impressora' | 'Sistema interno' | 'Outros';
  contato: string;
  situacao: 'Ativo' | 'Inativo';
}
