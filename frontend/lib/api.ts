const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

interface RequestOptions extends RequestInit {
  params?: Record<string, string>
}

async function apiCall<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, ...fetchOptions } = options

  let url = `${API_BASE_URL}${endpoint}`

  if (params) {
    const searchParams = new URLSearchParams(params)
    url += `?${searchParams.toString()}`
  }

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    },
    ...fetchOptions,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || `API error: ${response.status}`)
  }

  return response.json()
}

// Files API
export const filesAPI = {
  // Get all root items
  getRootItems: () => apiCall("/files/root"),

  // Get items by parent ID
  getItemsByParentId: (parentId: string) => apiCall(`/files/parent/${parentId}`),

  // Get single item
  getItemById: (id: string) => apiCall(`/files/${id}`),

  // Get item path (breadcrumb)
  getItemPath: (id: string) => apiCall(`/files/${id}/path`),

  // Create new item
  createItem: (data: { name: string; type: "folder" | "text" | "image"; parentId?: string; content?: string }) =>
    apiCall("/files", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Rename item
  renameItem: (id: string, name: string) =>
    apiCall(`/files/${id}/rename`, {
      method: "PUT",
      body: JSON.stringify({ name }),
    }),

  // Update file content
  updateFileContent: (id: string, content: string) =>
    apiCall(`/files/${id}/content`, {
      method: "PUT",
      body: JSON.stringify({ content }),
    }),

  // Move item
  moveItem: (id: string, newParentId: string | null) =>
    apiCall(`/files/${id}/move`, {
      method: "PUT",
      body: JSON.stringify({ newParentId }),
    }),

  // Delete item
  deleteItem: (id: string) =>
    apiCall(`/files/${id}`, {
      method: "DELETE",
    }),

  // Get folder statistics
  getFolderStats: (id: string) => apiCall(`/files/${id}/stats`),

  // Search files
  searchFiles: (query: string, parentId?: string) => {
    const params: Record<string, string> = { query }
    if (parentId) params.parentId = parentId
    return apiCall("/files/search", { params })
  },
}
