import { UnitKerja } from "@/types/unitKerja";
import { getFromLocalStorage, saveToLocalStorage } from "@/utils/localStorage";
import { logAuditEntry } from "./auditService";

const UNIT_KERJA_KEY = "koperasi_unit_kerja";

// Initial unit kerja data including the new one
const initialUnitKerja: UnitKerja[] = [
  {
    id: "UK001",
    nama: "SDN Jatilor 01",
    keterangan: "Sekolah Dasar Negeri Jatilor 01",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "UK002", 
    nama: "SDN Bringin",
    keterangan: "Sekolah Dasar Negeri Bringin",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "UK003",
    nama: "SDN Klampok 01", 
    keterangan: "Sekolah Dasar Negeri Klampok 01",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "UK004",
    nama: "SD Negeri Ketitang", 
    keterangan: "Sekolah Dasar Negeri Ketitang",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

/**
 * Get all unit kerja from local storage
 */
export function getAllUnitKerja(): UnitKerja[] {
  return getFromLocalStorage<UnitKerja[]>(UNIT_KERJA_KEY, initialUnitKerja);
}

/**
 * Get unit kerja by ID
 */
export function getUnitKerjaById(id: string): UnitKerja | undefined {
  const unitKerjaList = getAllUnitKerja();
  return unitKerjaList.find(unitKerja => unitKerja.id === id);
}

/**
 * Generate a new unit kerja ID
 */
export function generateUnitKerjaId(): string {
  const unitKerjaList = getAllUnitKerja();
  const lastId = unitKerjaList.length > 0 
    ? parseInt(unitKerjaList[unitKerjaList.length - 1].id.replace("UK", "")) 
    : 0;
  const newId = `UK${String(lastId + 1).padStart(3, "0")}`;
  return newId;
}

/**
 * Create a new unit kerja - updated to match UI expectations
 */
export function createUnitKerja(nama: string, keterangan?: string): UnitKerja {
  const unitKerjaList = getAllUnitKerja();
  
  const newUnitKerja: UnitKerja = {
    id: generateUnitKerjaId(),
    nama,
    keterangan,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  unitKerjaList.push(newUnitKerja);
  saveToLocalStorage(UNIT_KERJA_KEY, unitKerjaList);
  
  // Log audit entry
  logAuditEntry(
    "CREATE",
    "UNIT_KERJA",
    `Membuat unit kerja baru: ${newUnitKerja.nama} (${newUnitKerja.id})`,
    newUnitKerja.id
  );
  
  // Notify that unit kerja has been updated
  localStorage.setItem('unit_kerja_updated', new Date().toISOString());
  
  return newUnitKerja;
}

/**
 * Update an existing unit kerja - updated to match UI expectations
 */
export function updateUnitKerja(id: string, nama: string, keterangan?: string): UnitKerja | null {
  const unitKerjaList = getAllUnitKerja();
  const index = unitKerjaList.findIndex(uk => uk.id === id);
  
  if (index === -1) {
    return null;
  }
  
  const oldUnitKerja = unitKerjaList[index];
  unitKerjaList[index] = {
    ...unitKerjaList[index],
    nama,
    keterangan,
    updatedAt: new Date().toISOString(),
  };
  
  saveToLocalStorage(UNIT_KERJA_KEY, unitKerjaList);
  
  // Log audit entry
  logAuditEntry(
    "UPDATE",
    "UNIT_KERJA",
    `Memperbarui unit kerja: ${oldUnitKerja.nama} (${id})`,
    id
  );
  
  // Notify that unit kerja has been updated
  localStorage.setItem('unit_kerja_updated', new Date().toISOString());
  
  return unitKerjaList[index];
}

/**
 * Delete a unit kerja by ID
 */
export function deleteUnitKerja(id: string): boolean {
  const unitKerjaList = getAllUnitKerja();
  const unitKerjaToDelete = unitKerjaList.find(uk => uk.id === id);
  const filteredList = unitKerjaList.filter(unitKerja => unitKerja.id !== id);
  
  if (filteredList.length === unitKerjaList.length) {
    return false;
  }
  
  saveToLocalStorage(UNIT_KERJA_KEY, filteredList);
  
  // Log audit entry
  if (unitKerjaToDelete) {
    logAuditEntry(
      "DELETE",
      "UNIT_KERJA",
      `Menghapus unit kerja: ${unitKerjaToDelete.nama} (${id})`,
      id
    );
  }
  
  // Notify that unit kerja has been updated
  localStorage.setItem('unit_kerja_updated', new Date().toISOString());
  
  return true;
}

/**
 * Reset unit kerja data to initial state - add alias for UI compatibility
 */
export function resetUnitKerja(): UnitKerja[] {
  return resetUnitKerjaData();
}

/**
 * Reset unit kerja data to initial state
 */
export function resetUnitKerjaData(): UnitKerja[] {
  saveToLocalStorage(UNIT_KERJA_KEY, initialUnitKerja);
  
  // Log audit entry
  logAuditEntry(
    "DELETE",
    "SYSTEM",
    "Mereset semua data unit kerja ke kondisi awal"
  );
  
  // Notify that unit kerja has been updated
  localStorage.setItem('unit_kerja_updated', new Date().toISOString());
  
  return initialUnitKerja;
}
