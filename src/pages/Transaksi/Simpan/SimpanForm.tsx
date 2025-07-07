
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { getAllAnggota } from "@/services/anggotaService";
import { SimpananForm } from "@/components/transaksi/SimpananForm";

export default function SimpleSimpanForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [anggotaList, setAnggotaList] = useState([]);
  
  useEffect(() => {
    // Load anggota from local storage
    const loadedAnggota = getAllAnggota();
    setAnggotaList(loadedAnggota);
  }, []);

  const handleSuccess = () => {
    toast({
      title: "Simpanan berhasil dibuat",
      description: "Data simpanan telah berhasil disimpan"
    });
    navigate("/transaksi/simpan");
  };

  return (
    <Layout pageTitle="Transaksi Simpanan">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/transaksi/simpan">
          <Button variant="outline" size="icon">
            <ArrowLeft size={16} />
          </Button>
        </Link>
        <h1 className="page-title">Buat Transaksi Simpanan</h1>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <SimpananForm anggotaList={anggotaList} onSuccess={handleSuccess} />
        </CardContent>
      </Card>
    </Layout>
  );
}
