"use client"

import { useState, useEffect } from "react"
import FileContent from "./file-content"
import FolderContent from "./folder-content"
import Breadcrumb from "./breadcrumb"

interface MainPanelProps {
  selectedId: string | null
  onRefresh: () => void
  refreshKey: number
}

function FolderOpenIcon() {
  return <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" />
}

export default function MainPanel({ selectedId, onRefresh, refreshKey }: MainPanelProps) {
  const [item, setItem] = useState<any>(null)
  const [breadcrumb, setBreadcrumb] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchItem = async () => {
      if (!selectedId) {
        setItem(null)
        setBreadcrumb([])
        return
      }

      setLoading(true)
      try {
        const itemResponse = await fetch(`http://localhost:5000/api/files/${selectedId}`)
        const itemData = await itemResponse.json()
        setItem(itemData)

        const pathResponse = await fetch(`http://localhost:5000/api/files/${selectedId}/path`)
        const pathData = await pathResponse.json()
        setBreadcrumb(pathData)
      } catch (error) {
        console.error("Error fetching item:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchItem()
  }, [selectedId, refreshKey])

  if (!selectedId) {
    return (
      <div className="flex-1 bg-white flex flex-col items-center justify-center">
        <FolderOpenIcon />
        <p className="text-gray-500 text-lg">Select a file or folder to view its contents</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex-1 bg-white flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="flex-1 bg-white flex items-center justify-center">
        <div className="text-gray-500">Item not found</div>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-white flex flex-col">
      <div className="border-b border-gray-200 p-4">
        <Breadcrumb path={breadcrumb} />
      </div>

      <div className="flex-1 overflow-auto">
        {item.type === "folder" ? (
          <FolderContent folderId={item._id} onRefresh={onRefresh} refreshKey={refreshKey} />
        ) : (
          <FileContent item={item} onRefresh={onRefresh} />
        )}
      </div>
    </div>
  )
}
