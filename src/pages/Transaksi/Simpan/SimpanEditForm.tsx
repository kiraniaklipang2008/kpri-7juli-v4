
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getAllAnggota } from "@/services/anggotaService";
import { getTransaksiById, updateTransaksi } from "@/services/transaksiService";
import { SimpananForm } from "@/components/transaksi/SimpananForm";
import { Transaksi } from "@/types";

export default function SimpanEditForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [anggotaList, setAnggotaList] = useState([]);
  const [transaksi, setTransaksi] = useState<Transaksi | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Load anggota list
    const loadedAnggota = getAllAnggota();
    setAnggotaList(loadedAnggota);
    
    // Load transaction data
    if (id) {
      const loadedTransaksi = getTransaksiById(id);
      if (loadedTransaksi && loadedTransaksi.jenis === "Simpan") {
        setTransaksi(loadedTransaksi);
      } else {
        toast({
          title: "Transaksi tidak ditemukan",
          description: "Data simpanan tidak ditemukan atau bukan merupakan transaksi simpanan",
          variant: "destructive"
        });
        navigate("/transaksi/simpan");
      }
    }
    
    setIsLoading(false);
  }, [id, navigate, toast]);
  
  const handleSuccess = () => {
    toast({
      title: "Simpanan berhasil diperbarui",
      description: "Data simpanan telah berhasil diperbarui"
    });
    navigate("/transaksi/simpan");
  };
  
  if (isLoading) {
    return (
      <Layout pageTitle="Memuat...">
        <div className="flex items-center justify-center h-64">
          <p>Memuat data simpanan...</p>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout pageTitle="Edit Simpanan">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/transaksi/simpan">
          <Button variant="outline" size="icon">
            <ArrowLeft size={16} />
          </Button>
        </Link>
        <h1 className="page-title">Edit Transaksi Simpanan</h1>
      </div>
      
      <Card>
        <CardContent className="p-6">
          {transaksi && (
            <SimpananForm 
              anggotaList={anggotaList} 
              initialData={transaksi}
              onSuccess={handleSuccess}
            />
          )}
        </CardContent>
      </Card>
    </Layout>
  );
}
