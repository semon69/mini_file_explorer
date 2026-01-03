"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, Folder, FileText, ImageIcon } from "lucide-react"
import { filesAPI } from "@/lib/api"

interface TreeNodeProps {
  item: any
  isSelected: boolean
  onSelectItem: (id: string) => void
}

export default function TreeNode({ item, isSelected, onSelectItem }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [children, setChildren] = useState<any>([])
  const [childrenLoading, setChildrenLoading] = useState(false)

  const handleExpandToggle = async () => {
    if (item.type !== "folder") return

    if (!isExpanded) {
      setChildrenLoading(true)
      try {
        const data = await filesAPI.getItemsByParentId(item._id)
        setChildren(data)
      } catch (error) {
        console.error("Error fetching children:", error)
      } finally {
        setChildrenLoading(false)
      }
    }
    setIsExpanded(!isExpanded)
  }

  const getIcon = () => {
    switch (item.type) {
      case "folder":
        return <Folder className="w-4 h-4 text-yellow-500" />
      case "text":
        return <FileText className="w-4 h-4 text-blue-500" />
      case "image":
        return <ImageIcon className="w-4 h-4 text-purple-500" />
      default:
        return null
    }
  }

  return (
    <div>
      <div
        onClick={() => onSelectItem(item._id)}
        className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer transition ${
          isSelected ? "bg-blue-100 text-blue-900" : "hover:bg-gray-100 text-gray-700"
        }`}
      >
        {item.type === "folder" && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleExpandToggle()
            }}
            className="p-0"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-600" />
            )}
          </button>
        )}
        {item.type !== "folder" && <div className="w-4" />}
        {getIcon()}
        <span className="flex-1 truncate text-sm">{item.name}</span>
      </div>

      {/* Children */}
      {isExpanded && item.type === "folder" && (
        <div className="ml-4">
          {childrenLoading ? (
            <div className="text-xs text-gray-500 py-1">Loading...</div>
          ) : children.length === 0 ? (
            <div className="text-xs text-gray-400 py-1">Empty folder</div>
          ) : (
            children?.map((child: any) => (
              <TreeNode key={child._id} item={child} isSelected={false} onSelectItem={onSelectItem} />
            ))
          )}
        </div>
      )}
    </div>
  )
}
