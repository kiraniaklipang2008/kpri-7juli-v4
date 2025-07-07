
import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, RefreshCcw } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { getAllUnitKerja, createUnitKerja, updateUnitKerja, deleteUnitKerja, resetUnitKerja } from "@/services/unitKerjaService";
import { UnitKerja } from "@/types/unitKerja";
import { useUnitKerja } from "@/hooks/useUnitKerja";

export default function UnitKerjaList() {
  const { unitKerjaList, refreshUnitKerja } = useUnitKerja();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [nama, setNama] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const resetForm = () => {
    setEditId(null);
    setNama("");
    setKeterangan("");
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsDialogOpen(true);
  };
  
  const handleOpenEdit = (unit: UnitKerja) => {
    setEditId(unit.id);
    setNama(unit.nama);
    setKeterangan(unit.keterangan || "");
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (nama.trim() === "") {
      toast({title: "Nama Unit Kerja wajib diisi", variant: "destructive"});
      return;
    }
    
    if (editId) {
      updateUnitKerja(editId, nama, keterangan);
      toast({title: "Unit Kerja diupdate"});
    } else {
      createUnitKerja(nama, keterangan);
      toast({title: "Unit Kerja ditambahkan"});
    }
    
    setIsDialogOpen(false);
    refreshUnitKerja();
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Yakin hapus Unit Kerja ini?")) {
      deleteUnitKerja(id);
      toast({title: "Unit Kerja dihapus"});
      refreshUnitKerja();
    }
  };

  const handleReset = () => {
    if (window.confirm("Reset Unit Kerja ke default?")) {
      resetUnitKerja();
      refreshUnitKerja();
      toast({title: "Unit Kerja direset"});
    }
  };

  // Filter units based on search query
  const filteredUnits = unitKerjaList.filter(unit =>
    unit.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    unit.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout pageTitle="Unit Kerja">
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-title">Daftar Unit Kerja</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset} className="gap-2">
            <RefreshCcw size={16} /> Reset Default
          </Button>
          <Button onClick={handleOpenAdd} className="gap-2">
            <Plus size={16} /> Tambah
          </Button>
        </div>
      </div>
      
      {/* Search field */}
      <div className="mb-4">
        <Input 
          placeholder="Cari unit kerja..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="text-sm text-muted-foreground mb-2">
            {filteredUnits.length} dari {unitKerjaList.length} unit kerja
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Keterangan</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUnits.map(unit => (
                <TableRow key={unit.id}>
                  <TableCell>{unit.id}</TableCell>
                  <TableCell>{unit.nama}</TableCell>
                  <TableCell>{unit.keterangan || "-"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="icon" variant="outline" onClick={() => handleOpenEdit(unit)}>
                        <Edit size={16}/>
                      </Button>
                      <Button size="icon" variant="destructive" onClick={() => handleDelete(unit.id)}>
                        <Trash2 size={16}/>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredUnits.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6">
                    {searchQuery ? "Tidak ada hasil pencarian" : "Belum ada data"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Dialog Form */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editId ? "Edit Unit Kerja" : "Tambah Unit Kerja"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Nama Unit Kerja" value={nama} onChange={e => setNama(e.target.value)} />
            <Input placeholder="Keterangan" value={keterangan} onChange={e => setKeterangan(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button>
            <Button onClick={handleSave}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
