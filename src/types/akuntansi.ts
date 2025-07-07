
export interface ChartOfAccount {
  id: string;
  kode: string;
  nama: string;
  jenis: 'ASET' | 'KEWAJIBAN' | 'MODAL' | 'PENDAPATAN' | 'BEBAN';
  kategori: string;
  parentId?: string;
  level: number;
  isGroup: boolean;
  isActive: boolean;
  saldoNormal: 'DEBIT' | 'KREDIT';
  deskripsi?: string;
  createdAt: string;
  updatedAt: string;
}

export interface JurnalEntry {
  id: string;
  nomorJurnal: string;
  tanggal: string;
  deskripsi: string;
  referensi?: string;
  totalDebit: number;
  totalKredit: number;
  status: 'DRAFT' | 'POSTED' | 'REVERSED';
  createdBy: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
  details: JurnalDetail[];
}

export interface JurnalDetail {
  id: string;
  jurnalId: string;
  coaId: string;
  coa?: ChartOfAccount;
  debit: number;
  kredit: number;
  keterangan?: string;
}

export interface BukuBesar {
  coaId: string;
  coa: ChartOfAccount;
  periode: string;
  saldoAwal: number;
  totalDebit: number;
  totalKredit: number;
  saldoAkhir: number;
  transaksi: BukuBesarDetail[];
}

export interface BukuBesarDetail {
  tanggal: string;
  nomorJurnal: string;
  keterangan: string;
  debit: number;
  kredit: number;
  saldo: number;
}

export interface TrialBalance {
  coaId: string;
  kodeAkun: string;
  namaAkun: string;
  debit: number;
  kredit: number;
}

export interface Neraca {
  periode: string;
  aset: NeracaItem[];
  kewajiban: NeracaItem[];
  modal: NeracaItem[];
  totalAset: number;
  totalKewajiban: number;
  totalModal: number;
}

export interface NeracaItem {
  coaId: string;
  kodeAkun: string;
  namaAkun: string;
  jumlah: number;
  level: number;
  isGroup: boolean;
}

export interface LabaRugi {
  periode: string;
  pendapatan: LabaRugiItem[];
  beban: LabaRugiItem[];
  totalPendapatan: number;
  totalBeban: number;
  labaKotor: number;
  labaBersih: number;
}

export interface LabaRugiItem {
  coaId: string;
  kodeAkun: string;
  namaAkun: string;
  jumlah: number;
  level: number;
  isGroup: boolean;
}

export interface ArusKas {
  periode: string;
  operasional: ArusKasItem[];
  investasi: ArusKasItem[];
  pendanaan: ArusKasItem[];
  kasAwal: number;
  kasAkhir: number;
  perubahanKas: number;
}

export interface ArusKasItem {
  deskripsi: string;
  jumlah: number;
  jenis: 'MASUK' | 'KELUAR';
}
