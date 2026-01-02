const File = require("../models/File")

class FileService {
  // Create a new file or folder
  async createItem(name, type, parentId = null, content = "", mimeType = "") {
    // Validation
    if (!name || !name.trim()) {
      throw new Error("Name cannot be empty")
    }

    if (!["folder", "text", "image"].includes(type)) {
      throw new Error("Invalid file type")
    }

    // Check if parent folder exists
    if (parentId) {
      const parent = await File.findById(parentId)
      if (!parent) {
        throw new Error("Parent folder not found")
      }
      if (parent.type !== "folder") {
        throw new Error("Parent must be a folder")
      }
    }

    // Check for duplicate names in same parent
    const existingItem = await File.findOne({
      name: name.trim(),
      parentId: parentId || null,
    })

    if (existingItem) {
      throw new Error("Item with this name already exists in this folder")
    }

    const newItem = new File({
      name: name.trim(),
      type,
      parentId: parentId || null,
      content,
      mimeType,
    })

    return await newItem.save()
  }

  // Rename an item
  async renameItem(id, newName) {
    if (!newName || !newName.trim()) {
      throw new Error("Name cannot be empty")
    }

    const item = await File.findById(id)
    if (!item) {
      throw new Error("Item not found")
    }

    // Check for duplicate names in same parent
    const existingItem = await File.findOne({
      name: newName.trim(),
      parentId: item.parentId,
      _id: { $ne: id },
    })

    if (existingItem) {
      throw new Error("Item with this name already exists in this folder")
    }

    item.name = newName.trim()
    item.updatedAt = new Date()
    return await item.save()
  }

  // Get item by ID
  async getItemById(id) {
    const item = await File.findById(id)
    if (!item) {
      throw new Error("Item not found")
    }
    return item
  }

  // Get all children of a folder
  async getChildren(parentId) {
    return await File.find({ parentId: parentId || null }).sort({ type: -1, name: 1 })
  }

  // Update file content
  async updateContent(id, content) {
    const item = await File.findById(id)
    if (!item) {
      throw new Error("Item not found")
    }

    if (item.type === "folder") {
      throw new Error("Cannot update content of a folder")
    }

    item.content = content
    item.updatedAt = new Date()
    return await item.save()
  }

  // Delete item recursively
  async deleteItem(id) {
    const item = await File.findById(id)
    if (!item) {
      throw new Error("Item not found")
    }

    // Recursively delete children if it's a folder
    if (item.type === "folder") {
      await this._deleteRecursive(id)
    }

    return await File.findByIdAndDelete(id)
  }

  // Helper: Recursively delete all children
  async _deleteRecursive(parentId) {
    const children = await File.find({ parentId })

    for (const child of children) {
      if (child.type === "folder") {
        await this._deleteRecursive(child._id)
      }
      await File.findByIdAndDelete(child._id)
    }
  }

  // Get full path of an item
  async getItemPath(id) {
    const item = await File.findById(id)
    if (!item) {
      throw new Error("Item not found")
    }

    const path = []
    let current = item

    while (current) {
      path.unshift({
        _id: current._id,
        name: current.name,
        type: current.type,
      })

      if (current.parentId) {
        current = await File.findById(current.parentId)
      } else {
        current = null
      }
    }

    return path
  }

  // Search files by name
  async searchFiles(query, parentId = null) {
    if (!query || !query.trim()) {
      throw new Error("Search query cannot be empty")
    }

    const searchFilter = {
      name: { $regex: query.trim(), $options: "i" },
    }

    if (parentId) {
      searchFilter.parentId = parentId
    }

    return await File.find(searchFilter).sort({ type: -1, name: 1 })
  }

  // Move item to another folder
  async moveItem(id, newParentId) {
    const item = await File.findById(id)
    if (!item) {
      throw new Error("Item not found")
    }

    if (newParentId) {
      const newParent = await File.findById(newParentId)
      if (!newParent) {
        throw new Error("Destination folder not found")
      }
      if (newParent.type !== "folder") {
        throw new Error("Destination must be a folder")
      }

      // Prevent moving a folder into its own child
      if (item.type === "folder") {
        const isChild = await this._isFolderChild(item._id, newParentId)
        if (isChild) {
          throw new Error("Cannot move a folder into its own child")
        }
      }
    }

    item.parentId = newParentId || null
    item.updatedAt = new Date()
    return await item.save()
  }

  // Helper: Check if a folder is a child of another
  async _isFolderChild(parentId, potentialChildId) {
    let current = await File.findById(potentialChildId)

    while (current) {
      if (current._id.toString() === parentId.toString()) {
        return true
      }
      if (current.parentId) {
        current = await File.findById(current.parentId)
      } else {
        current = null
      }
    }

    return false
  }

  // Get statistics about a folder
  async getFolderStats(folderId) {
    const children = await File.find({ parentId: folderId })
    let totalSize = 0
    let fileCount = 0
    let folderCount = 0

    for (const child of children) {
      if (child.type === "folder") {
        folderCount++
        const stats = await this.getFolderStats(child._id)
        totalSize += stats.totalSize
        fileCount += stats.fileCount
        folderCount += stats.folderCount
      } else {
        fileCount++
        totalSize += child.fileSize
      }
    }

    return {
      fileCount,
      folderCount,
      totalSize,
      childCount: children.length,
    }
  }
}

module.exports = new FileService()
