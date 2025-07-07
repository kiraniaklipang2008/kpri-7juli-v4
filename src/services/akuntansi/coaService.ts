
import { ChartOfAccount } from "@/types/akuntansi";
import { getFromLocalStorage, saveToLocalStorage } from "@/utils/localStorage";

const COA_STORAGE_KEY = "chart_of_accounts";

// Chart of Accounts following SAK ETAP for Cooperatives
const initialCOA: ChartOfAccount[] = [
  // ASET (1xxx)
  {
    id: "1",
    kode: "1000",
    nama: "ASET",
    jenis: "ASET",
    kategori: "Aset",
    level: 1,
    isGroup: true,
    isActive: true,
    saldoNormal: "DEBIT",
    deskripsi: "Kelompok Aset",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "2",
    kode: "1100",
    nama: "Kas",
    jenis: "ASET",
    kategori: "Aset Lancar",
    parentId: "1",
    level: 2,
    isGroup: false,
    isActive: true,
    saldoNormal: "DEBIT",
    deskripsi: "Kas dan setara kas",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "3",
    kode: "1200",
    nama: "Bank",
    jenis: "ASET",
    kategori: "Aset Lancar",
    parentId: "1",
    level: 2,
    isGroup: false,
    isActive: true,
    saldoNormal: "DEBIT",
    deskripsi: "Rekening bank",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "4",
    kode: "1300",
    nama: "Piutang Anggota",
    jenis: "ASET",
    kategori: "Aset Lancar",
    parentId: "1",
    level: 2,
    isGroup: false,
    isActive: true,
    saldoNormal: "DEBIT",
    deskripsi: "Piutang pinjaman kepada anggota",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // KEWAJIBAN (2xxx)
  {
    id: "5",
    kode: "2000",
    nama: "KEWAJIBAN",
    jenis: "KEWAJIBAN",
    kategori: "Kewajiban",
    level: 1,
    isGroup: true,
    isActive: true,
    saldoNormal: "KREDIT",
    deskripsi: "Kelompok Kewajiban",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "6",
    kode: "2100",
    nama: "Utang Simpanan Sukarela",
    jenis: "KEWAJIBAN",
    kategori: "Kewajiban Jangka Pendek",
    parentId: "5",
    level: 2,
    isGroup: false,
    isActive: true,
    saldoNormal: "KREDIT",
    deskripsi: "Kewajiban simpanan sukarela anggota",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // MODAL/EKUITAS (3xxx)
  {
    id: "7",
    kode: "3000",
    nama: "EKUITAS",
    jenis: "MODAL",
    kategori: "Ekuitas",
    level: 1,
    isGroup: true,
    isActive: true,
    saldoNormal: "KREDIT",
    deskripsi: "Kelompok Ekuitas Koperasi",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "8",
    kode: "3100",
    nama: "Simpanan Pokok",
    jenis: "MODAL",
    kategori: "Ekuitas Anggota",
    parentId: "7",
    level: 2,
    isGroup: false,
    isActive: true,
    saldoNormal: "KREDIT",
    deskripsi: "Simpanan pokok anggota sesuai SAK ETAP",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "9",
    kode: "3200",
    nama: "Simpanan Wajib",
    jenis: "MODAL",
    kategori: "Ekuitas Anggota",
    parentId: "7",
    level: 2,
    isGroup: false,
    isActive: true,
    saldoNormal: "KREDIT",
    deskripsi: "Simpanan wajib anggota sesuai SAK ETAP",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "10",
    kode: "3300",
    nama: "Cadangan Umum",
    jenis: "MODAL",
    kategori: "Cadangan",
    parentId: "7",
    level: 2,
    isGroup: false,
    isActive: true,
    saldoNormal: "KREDIT",
    deskripsi: "Cadangan umum koperasi",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "11",
    kode: "3400",
    nama: "SHU Belum Dibagi",
    jenis: "MODAL",
    kategori: "SHU",
    parentId: "7",
    level: 2,
    isGroup: false,
    isActive: true,
    saldoNormal: "KREDIT",
    deskripsi: "SHU yang belum dibagikan berdasarkan RAT",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // PENDAPATAN (4xxx)
  {
    id: "12",
    kode: "4000",
    nama: "PENDAPATAN",
    jenis: "PENDAPATAN",
    kategori: "Pendapatan",
    level: 1,
    isGroup: true,
    isActive: true,
    saldoNormal: "KREDIT",
    deskripsi: "Kelompok Pendapatan",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "13",
    kode: "4100",
    nama: "Pendapatan Jasa Pinjaman",
    jenis: "PENDAPATAN",
    kategori: "Pendapatan Operasional",
    parentId: "12",
    level: 2,
    isGroup: false,
    isActive: true,
    saldoNormal: "KREDIT",
    deskripsi: "Pendapatan bunga/jasa dari pinjaman anggota",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // BEBAN (5xxx)
  {
    id: "14",
    kode: "5000",
    nama: "BEBAN",
    jenis: "BEBAN",
    kategori: "Beban",
    level: 1,
    isGroup: true,
    isActive: true,
    saldoNormal: "DEBIT",
    deskripsi: "Kelompok Beban",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "15",
    kode: "5100",
    nama: "Beban Operasional",
    jenis: "BEBAN",
    kategori: "Beban Operasional",
    parentId: "14",
    level: 2,
    isGroup: false,
    isActive: true,
    saldoNormal: "DEBIT",
    deskripsi: "Beban operasional koperasi",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const getAllChartOfAccounts = (): ChartOfAccount[] => {
  return getFromLocalStorage<ChartOfAccount[]>(COA_STORAGE_KEY, initialCOA);
};

export const getChartOfAccountById = (id: string): ChartOfAccount | null => {
  const accounts = getAllChartOfAccounts();
  return accounts.find(account => account.id === id) || null;
};

export const getChartOfAccountByKode = (kode: string): ChartOfAccount | null => {
  const accounts = getAllChartOfAccounts();
  return accounts.find(account => account.kode === kode) || null;
};

export const createChartOfAccount = (data: Omit<ChartOfAccount, 'id' | 'createdAt' | 'updatedAt'>): ChartOfAccount => {
  const accounts = getAllChartOfAccounts();
  const newId = (accounts.length + 1).toString();
  const now = new Date().toISOString();
  
  const newAccount: ChartOfAccount = {
    ...data,
    id: newId,
    createdAt: now,
    updatedAt: now
  };
  
  accounts.push(newAccount);
  saveToLocalStorage(COA_STORAGE_KEY, accounts);
  return newAccount;
};

export const updateChartOfAccount = (id: string, data: Partial<ChartOfAccount>): ChartOfAccount | null => {
  const accounts = getAllChartOfAccounts();
  const index = accounts.findIndex(account => account.id === id);
  
  if (index === -1) return null;
  
  const updatedAccount = {
    ...accounts[index],
    ...data,
    updatedAt: new Date().toISOString()
  };
  
  accounts[index] = updatedAccount;
  saveToLocalStorage(COA_STORAGE_KEY, accounts);
  return updatedAccount;
};

export const deleteChartOfAccount = (id: string): boolean => {
  const accounts = getAllChartOfAccounts();
  const index = accounts.findIndex(account => account.id === id);
  
  if (index === -1) return false;
  
  accounts.splice(index, 1);
  saveToLocalStorage(COA_STORAGE_KEY, accounts);
  return true;
};
