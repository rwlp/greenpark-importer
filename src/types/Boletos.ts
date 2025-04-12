export interface BoletoFromCSV {
    nome: string
    unidade: number
    valor: number
    linha_digitavel: string
}

export interface FiltrosDeBoletos {
    nome?: string;
    valor_inicial?: string;
    valor_final?: string;
    id_lote?: string;
    relatorio?: '1'
}