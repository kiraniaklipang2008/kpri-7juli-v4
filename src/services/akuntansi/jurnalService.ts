import { JurnalEntry, JurnalDetail } from "@/types/akuntansi";

// Export the types
export type { JurnalEntry, JurnalDetail };

// Mock data storage
let jurnalEntries: JurnalEntry[] = [
  {
    id: "1",
    nomorJurnal: "JU001/2024",
    tanggal: "2024-01-15",
    deskripsi: "Penerimaan simpanan anggota",
    totalDebit: 1000000,
    totalKredit: 1000000,
    status: "POSTED",
    createdBy: "admin",
    createdAt: "2024-01-15T10:00:00.000Z",
    updatedAt: "2024-01-15T10:00:00.000Z",
    details: [
      {
        id: "1",
        jurnalId: "1",
        coaId: "2",
        debit: 1000000,
        kredit: 0,
        keterangan: "Kas masuk"
      },
      {
        id: "2",
        jurnalId: "1",
        coaId: "3",
        debit: 0,
        kredit: 1000000,
        keterangan: "Simpanan anggota"
      }
    ]
  },
  {
    id: "2", 
    nomorJurnal: "JU002/2024",
    tanggal: "2024-01-16",
    deskripsi: "Pencairan pinjaman anggota",
    totalDebit: 5000000,
    totalKredit: 5000000,
    status: "DRAFT",
    createdBy: "admin",
    createdAt: "2024-01-16T14:30:00.000Z",
    updatedAt: "2024-01-16T14:30:00.000Z",
    details: []
  }
];

export const getAllJurnalEntries = (): JurnalEntry[] => {
  return jurnalEntries;
};

export const getJurnalEntryById = (id: string): JurnalEntry | null => {
  return jurnalEntries.find(jurnal => jurnal.id === id) || null;
};

export const createJurnalEntry = (data: Omit<JurnalEntry, 'id' | 'createdAt' | 'updatedAt' | 'nomorJurnal'>): JurnalEntry => {
  const newId = (jurnalEntries.length + 1).toString();
  const now = new Date().toISOString();
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const sequence = String(jurnalEntries.length + 1).padStart(3, '0');
  
  const newJurnal: JurnalEntry = {
    ...data,
    id: newId,
    nomorJurnal: `JU${sequence}/${month}/${year}`,
    createdAt: now,
    updatedAt: now
  };

  jurnalEntries.push(newJurnal);
  return newJurnal;
};

export const updateJurnalEntry = (id: string, data: Partial<JurnalEntry>): JurnalEntry | null => {
  const index = jurnalEntries.findIndex(jurnal => jurnal.id === id);
  if (index === -1) return null;

  const updatedJurnal = {
    ...jurnalEntries[index],
    ...data,
    updatedAt: new Date().toISOString()
  };

  jurnalEntries[index] = updatedJurnal;
  return updatedJurnal;
};

export const deleteJurnalEntry = (id: string): boolean => {
  const index = jurnalEntries.findIndex(jurnal => jurnal.id === id);
  if (index === -1) return false;

  jurnalEntries.splice(index, 1);
  return true;
};

export const postJurnalEntry = (id: string): JurnalEntry | null => {
  const jurnal = getJurnalEntryById(id);
  if (!jurnal || jurnal.status !== 'DRAFT') return null;

  return updateJurnalEntry(id, { status: 'POSTED' });
};

export const reverseJurnalEntry = (id: string): JurnalEntry | null => {
  const jurnal = getJurnalEntryById(id);
  if (!jurnal || jurnal.status !== 'POSTED') return null;

  return updateJurnalEntry(id, { status: 'REVERSED' });
};

export const getJurnalsByDateRange = (startDate: string, endDate: string): JurnalEntry[] => {
  return jurnalEntries.filter(jurnal => 
    jurnal.tanggal >= startDate && jurnal.tanggal <= endDate
  );
};

export const getJurnalsByStatus = (status: JurnalEntry['status']): JurnalEntry[] => {
  return jurnalEntries.filter(jurnal => jurnal.status === status);
};
