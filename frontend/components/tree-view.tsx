"use client"
import TreeNode from "./tree-node"

interface TreeViewProps {
  items: any[]
  selectedId: string | null
  onSelectItem: (id: string) => void
}

export default function TreeView({ items, selectedId, onSelectItem }: TreeViewProps) {
  return (
    <div className="space-y-1">
      {items.map((item) => (
        <TreeNode key={item._id} item={item} isSelected={selectedId === item._id} onSelectItem={onSelectItem} />
      ))}
    </div>
  )
}
