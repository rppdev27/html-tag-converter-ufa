export interface DoaFormData {
  title: string;
  subtitle: string;
  arabicDoa: string;
  latin: string;
  meaning: string;
  kandungan: string;
  benefit: string;
  footnote: string;
}

export interface FatwaFormData {
  question: string;
  answer: string;
  reference: string;
}

export type ActiveTab = 'doa' | 'fatwa' | 'additional' | 'arabic-multi-lines' | 'span-reducer';