"use client"

import { ChevronRight } from "lucide-react"

interface BreadcrumbProps {
  path: any[]
}

export default function Breadcrumb({ path }: BreadcrumbProps) {
  return (
    <div className="flex items-center gap-2">
      {path.map((item, index) => (
        <div key={item._id} className="flex items-center gap-2">
          {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400" />}
          <span className="text-sm text-gray-700 font-medium">{item.name}</span>
        </div>
      ))}
    </div>
  )
}
