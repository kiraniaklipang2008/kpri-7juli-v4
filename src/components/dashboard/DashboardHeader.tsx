
export function DashboardHeader() {
  return (
    <div className="mb-8 p-8 bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 rounded-2xl shadow-2xl text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10 rounded-2xl"></div>
      <div className="relative z-10">
        <h1 className="text-4xl font-bold mb-3">Dashboard Koperasi</h1>
        <p className="text-emerald-100 text-xl font-medium">Selamat datang di sistem manajemen KPRI Bangun Godong</p>
      </div>
    </div>
  );
}
