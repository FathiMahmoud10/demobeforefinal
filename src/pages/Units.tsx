import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Edit, Trash2, PlusCircle } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import AddUnitModal from "@/components/AddUnitModal";

type UnitOfMeasure = {
  id: number;
  name: string;
  description?: string;
};

type UnitListResponse = {
  items: UnitOfMeasure[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
};

const Units = () => {
  const { t, direction } = useLanguage();

  const [openActionId, setOpenActionId] = useState<number | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);

  const [units, setUnits] = useState<UnitOfMeasure[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<UnitOfMeasure | null>(null);

  // ✅ لو عندك proxy خليها فاضية ""
  // ✅ لو هتستدعي مباشر: "https://takamulerp.runasp.net"
  const BASE_URL = "";

  const fetchUnits = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `${BASE_URL}/api/UnitOfMeasure?pageNumber=${pageNumber}&pageSize=${pageSize}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // لو عندك توكن:
            // "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Request failed: ${res.status}`);
      }

      const data: UnitListResponse = await res.json();
      setUnits(data.items || []);
      setTotalCount(data.totalCount || 0);
    } catch (e: any) {
      setError(e?.message || "Failed to load units");
      setUnits([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, pageSize]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        setOpenActionId(null);
        setMenuPosition(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleActionMenu = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();

    if (openActionId === id) {
      setOpenActionId(null);
      setMenuPosition(null);
      return;
    }

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setOpenActionId(id);

    const menuWidth = 160;
    const left = direction === "rtl" ? rect.right - menuWidth : rect.left;

    setMenuPosition({
      top: rect.bottom + 5,
      left: Math.max(10, left),
    });
  };

  const openAddModal = () => {
    setEditingUnit(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (unit: UnitOfMeasure) => {
    setEditingUnit(unit);
    setIsAddModalOpen(true);
  };

  // ✅ ADD (POST)
  const handleAddUnit = async (name: string) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${BASE_URL}/api/UnitOfMeasure`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name,
          description: name, // لو عندك description مختلف عدليه
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Failed to add unit");
      }

      setIsAddModalOpen(false);
      setEditingUnit(null);

      // أفضل: رجعي للصفحة 1 بعد الإضافة (اختياري)
      setPageNumber(1);
      await fetchUnits();
    } catch (e: any) {
      setError(e?.message || "Failed to add unit");
    } finally {
      setLoading(false);
    }
  };

  // ✅ UPDATE (PUT) حسب Swagger: PUT /api/UnitOfMeasure?id=...
  const handleUpdateUnit = async (id: number, name: string) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${BASE_URL}/api/UnitOfMeasure?id=${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name,
          description: name,
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Failed to update unit");
      }

      setIsAddModalOpen(false);
      setEditingUnit(null);
      await fetchUnits();
    } catch (e: any) {
      setError(e?.message || "Failed to update unit");
    } finally {
      setLoading(false);
    }
  };

  // ✅ DELETE (مع Confirm)
  // غالباً: DELETE /api/UnitOfMeasure/{id}
  const handleDeleteUnit = async (id: number) => {
    const msg = t("confirm_delete_unit") || "هل أنت متأكد من حذف الوحدة؟";
    if (!window.confirm(msg)) return;

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${BASE_URL}/api/UnitOfMeasure/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Failed to delete unit");
      }

      setOpenActionId(null);
      setMenuPosition(null);

      // تحديث UI بدون ما تستنى refetch ممكن، بس refetch أدق
      await fetchUnits();
    } catch (e: any) {
      setError(e?.message || "Failed to delete unit");
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 flex items-center gap-1">
        <span>{t("home")}</span>
        <span>/</span>
        <span>{t("products")}</span>
        <span>/</span>
        <span className="text-gray-800 font-medium">{t("units")}</span>
      </div>

      {/* Page Header */}
      <div className="bg-white p-4 rounded-t-xl border-b border-gray-200 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">{t("units")}</h1>

        <button
          onClick={openAddModal}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors flex items-center gap-2 text-sm font-medium"
        >
          <PlusCircle size={18} />
          {t("add_new_unit")}
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-b-xl shadow-sm border border-gray-200 p-4 min-h-[300px]">
        {loading && <div className="text-sm text-gray-500 mb-3">{t("loading") || "Loading..."}</div>}
        {error && <div className="text-sm text-red-600 mb-3">{error}</div>}

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right text-gray-500">
            <thead className="text-xs text-white uppercase bg-primary">
              <tr>
                {/* API مفيهوش code فنعرض id */}
                <th scope="col" className="px-6 py-3 border border-primary-hover">
                  {t("unit_code") || "Unit Code"}
                </th>
                <th scope="col" className="px-6 py-3 border border-primary-hover">
                  {t("unit_name") || "Unit Name"}
                </th>
                <th scope="col" className="px-6 py-3 border border-primary-hover text-center">
                  {t("actions") || "Actions"}
                </th>
              </tr>
            </thead>

            <tbody>
              {!loading && units.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gray-400">
                    {t("no_data") || "No units found"}
                  </td>
                </tr>
              ) : (
                units.map((unit) => (
                  <tr key={unit.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border border-gray-100">
                      {unit.id}
                    </td>
                    <td className="px-6 py-4 border border-gray-100">{unit.name}</td>
                    <td className="px-6 py-4 border border-gray-100 text-center">
                      <button
                        onClick={(e) => toggleActionMenu(unit.id, e)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-md text-xs font-medium hover:bg-primary-hover transition-colors"
                      >
                        <span>{t("actions") || "Actions"}</span>
                        <ChevronDown size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
          <div>
            {t("total") || "Total"}: <span className="font-medium">{totalCount}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={pageNumber <= 1 || loading}
              onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
              className="px-3 py-1 border rounded-md disabled:opacity-50"
            >
              {t("prev") || "Prev"}
            </button>

            <span>
              {pageNumber} / {totalPages}
            </span>

            <button
              disabled={pageNumber >= totalPages || loading}
              onClick={() => setPageNumber((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1 border rounded-md disabled:opacity-50"
            >
              {t("next") || "Next"}
            </button>
          </div>
        </div>

        {/* Modal */}
        <AddUnitModal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingUnit(null);
          }}
          unit={editingUnit}
          onSubmit={(name) => {
            if (editingUnit) {
              handleUpdateUnit(editingUnit.id, name);
            } else {
              handleAddUnit(name);
            }
          }}
        />

        {/* Floating Action Menu */}
        <AnimatePresence>
          {openActionId !== null && menuPosition && (
            <motion.div
              ref={actionMenuRef}
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className={`fixed bg-white rounded-md shadow-lg border border-gray-200 z-50 overflow-hidden w-40 ${
                direction === "rtl" ? "text-right" : "text-left"
              }`}
              style={{ top: menuPosition.top, left: menuPosition.left }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Edit */}
              <button
                onMouseDown={(e) => e.stopPropagation()}
                onClick={() => {
                  const unit = units.find((u) => u.id === openActionId);
                  if (unit) openEditModal(unit);
                  setOpenActionId(null);
                  setMenuPosition(null);
                }}
                className={`w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-100 ${
                  direction === "rtl" ? "justify-end" : "justify-start"
                }`}
              >
                {direction === "rtl" ? (
                  <>
                    <span>{t("edit") || "Edit"}</span>
                    <Edit size={14} className="text-gray-500" />
                  </>
                ) : (
                  <>
                    <Edit size={14} className="text-gray-500" />
                    <span>{t("edit") || "Edit"}</span>
                  </>
                )}
              </button>

              {/* Delete */}
              <button
                onMouseDown={(e) => e.stopPropagation()}
                onClick={() => {
                  if (openActionId !== null) handleDeleteUnit(openActionId);
                }}
                className={`w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 ${
                  direction === "rtl" ? "justify-end" : "justify-start"
                }`}
              >
                {direction === "rtl" ? (
                  <>
                    <span>{t("delete") || "Delete"}</span>
                    <Trash2 size={14} className="text-red-500" />
                  </>
                ) : (
                  <>
                    <Trash2 size={14} className="text-red-500" />
                    <span>{t("delete") || "Delete"}</span>
                  </>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Units;