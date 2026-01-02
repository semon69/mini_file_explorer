"use client"

import { useState, useEffect, useCallback } from "react"
import TreeView from "./tree-view"
import CreateItemModal from "./modals/create-item-modal"
import { FolderOpen, Plus } from "lucide-react"

interface SidebarProps {
  selectedId: string | null
  onSelectItem: (id: string | null) => void
  refreshKey: number
}

export default function Sidebar({ selectedId, onSelectItem, refreshKey }: SidebarProps) {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const fetchRootItems = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch("http://localhost:5000/api/files/root")
      const data = await response.json()
      setItems(data)
    } catch (error) {
      console.error("Error fetching items:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRootItems()
  }, [fetchRootItems, refreshKey])

  const handleItemCreated = () => {
    setShowCreateModal(false)
    fetchRootItems()
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FolderOpen className="w-5 h-5 text-blue-600" />
          <h1 className="font-bold text-gray-900">File Explorer</h1>
        </div>
      </div>

      <div className="p-3 border-b border-gray-200">
        <button
          onClick={() => setShowCreateModal(true)}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-medium transition"
        >
          <Plus className="w-4 h-4" />
          New Item
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {loading ? (
          <div className="text-center py-4 text-gray-500">Loading...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-4 text-gray-500 text-sm">No items yet</div>
        ) : (
          <TreeView items={items} selectedId={selectedId} onSelectItem={onSelectItem} />
        )}
      </div>

      {showCreateModal && (
        <CreateItemModal parentId={null} onClose={() => setShowCreateModal(false)} onItemCreated={handleItemCreated} />
      )}
    </div>
  )
}
