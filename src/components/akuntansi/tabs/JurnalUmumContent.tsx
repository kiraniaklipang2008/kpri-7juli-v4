
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2,
  Download,
  Calendar,
  BookOpen,
  RefreshCw
} from "lucide-react";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { useToast } from "@/components/ui/use-toast";
import { 
  getAllJurnalEntries, 
  deleteJurnalEntry,
  JurnalEntry 
} from "@/services/akuntansi/jurnalService";
import { batchSyncTransactionsToAccounting } from "@/services/akuntansi/accountingSyncService";

export default function JurnalUmumContent() {
  const { toast } = useToast();
  const [jurnalEntries, setJurnalEntries] = useState<JurnalEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<JurnalEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<"ALL" | "DRAFT" | "POSTED" | "REVERSED">("ALL");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Load journal entries
  const loadJurnalEntries = () => {
    setIsLoading(true);
    try {
      const entries = getAllJurnalEntries();
      // Sort by date descending (newest first)
      entries.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
      setJurnalEntries(entries);
    } catch (error) {
      console.error("Error loading journal entries:", error);
      toast({
        title: "Gagal memuat data",
        description: "Terjadi kesalahan saat memuat jurnal umum",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter entries based on search and status
  const filterEntries = () => {
    let filtered = [...jurnalEntries];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(entry => 
        entry.nomorJurnal.toLowerCase().includes(query) ||
        entry.deskripsi.toLowerCase().includes(query) ||
        (entry.referensi && entry.referensi.toLowerCase().includes(query))
      );
    }

    // Filter by status
    if (selectedStatus !== "ALL") {
      filtered = filtered.filter(entry => entry.status === selectedStatus);
    }

    setFilteredEntries(filtered);
  };

  // Handle delete confirmation
  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      const success = deleteJurnalEntry(deleteId);
      if (success) {
        toast({
          title: "Jurnal berhasil dihapus",
          description: `Entry jurnal telah dihapus dari sistem`,
        });
        loadJurnalEntries();
      } else {
        toast({
          title: "Gagal menghapus jurnal",
          description: "Entry jurnal tidak ditemukan atau sedang digunakan",
          variant: "destructive",
        });
      }
    }
    setIsDeleteDialogOpen(false);
    setDeleteId(null);
  };

  // Handle auto sync
  const handleAutoSync = async () => {
    setIsSyncing(true);
    try {
      const result = batchSyncTransactionsToAccounting();
      toast({
        title: "Auto-sync berhasil",
        description: `${result.success} transaksi disinkronkan, ${result.failed} gagal`,
      });
      loadJurnalEntries(); // Refresh after sync
    } catch (error) {
      toast({
        title: "Gagal melakukan auto-sync",
        description: "Terjadi kesalahan saat sinkronisasi transaksi",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const variants = {
      "DRAFT": "bg-yellow-100 text-yellow-800",
      "POSTED": "bg-green-100 text-green-800",
      "REVERSED": "bg-red-100 text-red-800"
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800"}>
        {status}
      </Badge>
    );
  };

  // Calculate totals for filtered entries
  const calculateTotals = () => {
    return filteredEntries.reduce(
      (acc, entry) => ({
        totalDebit: acc.totalDebit + entry.totalDebit,
        totalKredit: acc.totalKredit + entry.totalKredit,
        count: acc.count + 1
      }),
      { totalDebit: 0, totalKredit: 0, count: 0 }
    );
  };

  // Effects
  useEffect(() => {
    loadJurnalEntries();
  }, []);

  useEffect(() => {
    filterEntries();
  }, [jurnalEntries, searchQuery, selectedStatus]);

  const totals = calculateTotals();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Jurnal Umum
          </h3>
          <p className="text-muted-foreground">
            Kelola semua entri jurnal akuntansi
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleAutoSync}
            disabled={isSyncing}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
            Auto-Sync
          </Button>
          
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Tambah Jurnal
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Entries</p>
                <p className="text-2xl font-bold">{totals.count}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Debit</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(totals.totalDebit)}
                </p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-bold">D</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Kredit</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(totals.totalKredit)}
                </p>
              </div>
              <div className="h-8 w-8 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-red-600 font-bold">K</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter & Pencarian</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input 
                  placeholder="Cari berdasarkan nomor jurnal, deskripsi, atau referensi..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select 
                className="px-3 py-2 border rounded-md text-sm"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as any)}
              >
                <option value="ALL">Semua Status</option>
                <option value="DRAFT">Draft</option>
                <option value="POSTED">Posted</option>
                <option value="REVERSED">Reversed</option>
              </select>
              
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Journal Entries Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Jurnal Entries</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin" />
              <span className="ml-2">Memuat data...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No. Jurnal</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Deskripsi</TableHead>
                    <TableHead>Referensi</TableHead>
                    <TableHead className="text-right">Debit</TableHead>
                    <TableHead className="text-right">Kredit</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-24">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEntries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                        {searchQuery || selectedStatus !== "ALL" 
                          ? "Tidak ada data jurnal yang sesuai filter" 
                          : "Belum ada entri jurnal"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEntries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell className="font-medium">{entry.nomorJurnal}</TableCell>
                        <TableCell>{formatDate(entry.tanggal)}</TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {entry.deskripsi}
                        </TableCell>
                        <TableCell>{entry.referensi || "-"}</TableCell>
                        <TableCell className="text-right font-medium text-green-600">
                          {formatCurrency(entry.totalDebit)}
                        </TableCell>
                        <TableCell className="text-right font-medium text-red-600">
                          {formatCurrency(entry.totalKredit)}
                        </TableCell>
                        <TableCell>{getStatusBadge(entry.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteClick(entry.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus entry jurnal ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
