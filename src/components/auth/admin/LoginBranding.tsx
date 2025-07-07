
import { CreditCard, Shield, TrendingUp, Users } from "lucide-react";

export function LoginBranding() {
  return (
    <div className="hidden lg:flex flex-col justify-center space-y-6 px-6" style={{ marginTop: '30px' }}>
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl flex items-center justify-center shadow-lg">
            <CreditCard className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">
              Koperasi Pegawai<br />
              Republik Indonesia
            </h1>
          </div>
        </div>
        <p className="text-lg text-gray-600 font-medium">
          Platform Digital Manajemen Koperasi Terpadu
        </p>
      </div>
      
      {/* Features Section */}
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">Manajemen Anggota</h3>
            <p className="text-sm text-gray-600">Kelola data anggota dengan sistem terintegrasi dan user-friendly</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">Transaksi Digital</h3>
            <p className="text-sm text-gray-600">Proses simpan, pinjam, dan angsuran secara digital dan real-time</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">Keamanan Terjamin</h3>
            <p className="text-sm text-gray-600">Sistem keamanan berlapis dengan enkripsi data end-to-end</p>
          </div>
        </div>
      </div>
    </div>
  );
}
