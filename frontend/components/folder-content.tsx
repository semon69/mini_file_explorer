"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2 } from "lucide-react";
import CreateItemModal from "./modals/create-item-modal";
import RenameModal from "./modals/rename-modal";
import { filesAPI } from "@/lib/api";

interface FolderContentProps {
  folderId: string;
  onRefresh: () => void;
  refreshKey: number;
  onSelectItem: any;
}

export default function FolderContent({
  folderId,
  onRefresh,
  refreshKey,
  onSelectItem,
}: FolderContentProps) {
  const [items, setItems] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await filesAPI.getItemsByParentId(folderId);
      setItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [folderId, refreshKey]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      await filesAPI.deleteItem(id);
      fetchItems();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleItemCreated = () => {
    setShowCreateModal(false);
    fetchItems();
  };

  const handleItemRenamed = () => {
    setShowRenameModal(false);
    setSelectedItem(null);
    fetchItems();
  };

  return (
    <div className="p-6">
      {/* Header with Create button */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Folder Contents</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          <Plus className="w-4 h-4" />
          New Item
        </button>
      </div>

      {/* Items List */}
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          This folder is empty
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2">
          {items?.map((item: any) => (
            <div
              key={item._id}
              className="flex items-center justify-between p-3 border border-gray-200 rounded hover:bg-gray-50 transition"
            >
              <div
                onClick={() => onSelectItem(item._id)}
                className="flex items-center gap-3 flex-1"
              >
                <span className="text-xl">
                  {item.type === "folder"
                    ? "📁"
                    : item.type === "image"
                    ? "🖼️"
                    : "📄"}
                </span>
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500">
                    Created {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedItem(item);
                    setShowRenameModal(true);
                  }}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                  title="Rename"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateItemModal
          parentId={folderId}
          onClose={() => setShowCreateModal(false)}
          onItemCreated={handleItemCreated}
        />
      )}

      {showRenameModal && selectedItem && (
        <RenameModal
          item={selectedItem}
          onClose={() => {
            setShowRenameModal(false);
            setSelectedItem(null);
          }}
          onItemRenamed={handleItemRenamed}
        />
      )}
    </div>
  );
}
