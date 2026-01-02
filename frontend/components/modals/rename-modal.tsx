"use client"

import { useState } from "react"
import { X } from "lucide-react"

interface RenameModalProps {
  item: any
  onClose: () => void
  onItemRenamed: () => void
}

export default function RenameModal({ item, onClose, onItemRenamed }: RenameModalProps) {
  const [name, setName] = useState(item.name)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleRename = async () => {
    if (!name.trim()) {
      setError("Name is required")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch(`http://localhost:5000/api/files/${item._id}/rename`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      })

      if (response.ok) {
        onItemRenamed()
      } else {
        const data = await response.json()
        setError(data.message || "Failed to rename item")
      }
    } catch (err) {
      setError("An error occurred")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Rename Item</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded transition">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && <div className="p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">{error}</div>}

          <div className="flex gap-2 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleRename}
              disabled={loading || !name.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded font-medium transition"
            >
              {loading ? "Renaming..." : "Rename"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
