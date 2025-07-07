
import {
  PiggyBank,
  Users,
  FileText, 
  Settings, 
  LogOut, 
  ShoppingCart, 
  Package,
  Archive, 
  User, 
  History, 
  Receipt, 
  BarChart, 
  LineChart, 
  Store, 
  ShoppingBag, 
  Shield, 
  Database,
  CreditCard, 
  Cog, 
  UserCheck,
  Truck,
  LayoutDashboard,
  Calculator,
  FileBarChart,
  TrendingUp,
  DollarSign,
  List,
  FileSpreadsheet,
  Upload,
  Book,
  BookOpen,
  Layout,
  ArrowUpFromLine,
  Boxes,
  ShoppingBasket,
  TrendingDown,
  UserCog
} from "lucide-react";

export type MenuItemType = {
  title: string;
  path: string;
  icon: React.ElementType;
  subItems?: { title: string; path: string; icon: React.ElementType }[];
};

export type MenuSectionType = {
  title: string;
  icon: React.ElementType;
  items: MenuItemType[];
  hidden?: boolean; // Add hidden property for temporary hiding
};

export const menuSections: MenuSectionType[] = [
  {
    title: "Menu Utama",
    icon: LayoutDashboard,
    items: [
      { title: "Dashboard", path: "/", icon: LayoutDashboard },
    ]
  },
  {
    title: "Master Data",
    icon: List,
    items: [
      { 
        title: "Unit Kerja", 
        path: "/master/unit-kerja", 
        icon: Package
      },
      { 
        title: "Data Anggota", 
        path: "/master/anggota", 
        icon: Users
      }
    ]
  },
  {
    title: "Koperasi",
    icon: PiggyBank,
    items: [
      { 
        title: "Transaksi", 
        path: "/transaksi", 
        icon: CreditCard, 
        subItems: [
          { title: "Jenis", path: "/transaksi/jenis", icon: List },
          { title: "Pengajuan", path: "/transaksi/pengajuan", icon: FileText },
          { title: "Simpan", path: "/transaksi/simpan", icon: FileText },
          { title: "Pinjam", path: "/transaksi/pinjam", icon: FileText },
          { title: "Penarikan", path: "/transaksi/penarikan", icon: ArrowUpFromLine },
          { title: "Angsuran", path: "/transaksi/angsuran", icon: FileText }
        ] 
      },
      { 
        title: "Arus Keuangan", 
        path: "/keuangan", 
        icon: DollarSign,
        subItems: [
          { title: "Kategori Transaksi", path: "/keuangan/kategori", icon: List },
          { title: "Transaksi Keuangan", path: "/keuangan/transaksi", icon: TrendingUp },
          { title: "Laporan Arus Kas", path: "/keuangan/laporan", icon: FileBarChart }
        ]
      },
      { title: "Laporan", path: "/laporan", icon: FileText }
    ]
  },
  {
    title: "KPRI Mart",
    icon: Store,
    hidden: true, // Temporarily hide this section
    items: [
      { title: "Dashboard POS", path: "/pos", icon: LayoutDashboard },
      { 
        title: "Master Data", 
        path: "/pos/master", 
        icon: Database,
        subItems: [
          { title: "Produk", path: "/pos/produk", icon: Package },
          { title: "Kategori", path: "/pos/kategori", icon: List },
          { title: "Pemasok", path: "/pos/pemasok", icon: Truck },
          { title: "Kasir", path: "/pos/kasir", icon: UserCog }
        ]
      },
      { 
        title: "Transaksi", 
        path: "/pos/transaksi", 
        icon: ShoppingCart,
        subItems: [
          { title: "Penjualan", path: "/pos/penjualan", icon: ShoppingBag },
          { title: "Pembelian", path: "/pos/pembelian", icon: ShoppingBasket },
          { title: "Retur", path: "/pos/retur", icon: TrendingDown }
        ]
      },
      { 
        title: "Laporan", 
        path: "/pos/laporan", 
        icon: FileBarChart,
        subItems: [
          { title: "Penjualan", path: "/pos/laporan/penjualan", icon: TrendingUp },
          { title: "Pembelian", path: "/pos/laporan/pembelian", icon: TrendingDown },
          { title: "Stok", path: "/pos/laporan/stok", icon: Boxes },
          { title: "Laba Rugi", path: "/pos/laporan/laba-rugi", icon: Calculator }
        ]
      },
      { title: "Inventori", path: "/pos/inventori", icon: Archive }
    ]
  },
  {
    title: "Akuntansi",
    icon: Calculator,
    items: [
      { title: "Manajemen Akuntansi", path: "/akuntansi", icon: Layout }
    ]
  },
  {
    title: "Pengaturan",
    icon: Settings,
    items: [
      { title: "Pengaturan Koperasi", path: "/pengaturan", icon: Cog },
      { title: "Pengguna dan Peran", path: "/pengaturan/pengguna-peran", icon: Users },
      { title: "Algoritma SHU & THR", path: "/pengaturan/algoritma", icon: Calculator },
      { title: "Audit Trail", path: "/pengaturan/audit-trail", icon: Shield }
    ]
  },
  {
    title: "Impor Data",
    icon: Upload,
    items: [
      { title: "Impor Anggota", path: "/import/anggota", icon: FileSpreadsheet },
      { title: "Impor Transaksi", path: "/import/transaksi", icon: FileSpreadsheet }
    ]
  }
];
