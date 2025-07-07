
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { AnggotaGridView } from "@/components/anggota/AnggotaGridView";
import { useAnggotaList } from "@/hooks/useAnggotaList";
import { AnggotaListFilters } from "@/components/anggota/list/AnggotaListFilters";
import { AnggotaTableView } from "@/components/anggota/list/AnggotaTableView";
import { AnggotaListHeader } from "@/components/anggota/list/AnggotaListHeader";
import { DeleteConfirmDialog, ResetConfirmDialog, ResetSHUDialog } from "@/components/anggota/list/ConfirmationDialogs";

export default function AnggotaList() {
  const {
    searchQuery,
    setSearchQuery,
    filteredAnggota,
    viewMode,
    setViewMode,
    columns,
    handleToggleColumn,
    isConfirmOpen,
    setIsConfirmOpen,
    anggotaToDelete,
    handleDeleteClick,
    handleDeleteConfirm,
    isResetConfirmOpen,
    setIsResetConfirmOpen,
    handleResetDataClick,
    handleResetDataConfirm,
    isResetSHUConfirmOpen,
    setIsResetSHUConfirmOpen,
    handleResetSHUClick,
    handleResetSHUConfirm,
    getTotalSimpanan,
    getTotalPinjaman,
    getTotalSHU,
    getPetugas,
    handleViewDetail,
    handleEdit,
  } = useAnggotaList();

  return (
    <Layout pageTitle="Data Anggota">
      <AnggotaListHeader 
        onResetData={handleResetDataClick}
        onResetSHU={handleResetSHUClick}
      />
      
      <Card>
        <CardContent className="p-0">
          <AnggotaListFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            viewMode={viewMode}
            setViewMode={setViewMode}
            columns={columns}
            onToggleColumn={handleToggleColumn}
          />
          
          {viewMode === "table" ? (
            <AnggotaTableView 
              anggotaList={filteredAnggota}
              columns={columns}
              getTotalSimpanan={getTotalSimpanan}
              getTotalPinjaman={getTotalPinjaman}
              getTotalSHU={getTotalSHU}
              getPetugas={getPetugas}
              onViewDetail={handleViewDetail}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          ) : (
            <div className="p-6">
              <AnggotaGridView 
                anggota={filteredAnggota} 
                onViewDetail={handleViewDetail}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                getTotalSimpanan={getTotalSimpanan}
                getTotalPinjaman={getTotalPinjaman}
              />
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Confirmation Dialogs */}
      <DeleteConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
      
      <ResetConfirmDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={handleResetDataConfirm}
      />
      
      <ResetSHUDialog
        isOpen={isResetSHUConfirmOpen}
        onClose={() => setIsResetSHUConfirmOpen(false)}
        onConfirm={handleResetSHUConfirm}
      />
    </Layout>
  );
}
