"use client"

import { useState } from "react"
import Sidebar from "@/components/sidebar"
import MainPanel from "@/components/main-panel"
import "./styles.css"

export default function Home() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="flex h-screen bg-slate-100 bg-red-500">
      <Sidebar selectedId={selectedId} onSelectItem={setSelectedId} refreshKey={refreshKey} />
      <MainPanel selectedId={selectedId} onRefresh={handleRefresh} refreshKey={refreshKey} />
    </div>
  )
}
