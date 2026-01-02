const File = require("../models/File")
const FileService = require("../services/fileService")
const { isValidMongoId, getMimeType } = require("../utils/validators")

// Get all root folders/files
exports.getRootItems = async (req, res) => {
  try {
    const items = await FileService.getChildren(null)
    res.json(items)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get items by parent ID (children of a folder)
exports.getItemsByParentId = async (req, res) => {
  try {
    const { parentId } = req.params

    if (!isValidMongoId(parentId)) {
      return res.status(400).json({ message: "Invalid parent ID" })
    }

    const items = await FileService.getChildren(parentId)
    res.json(items)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

// Get single item by ID
exports.getItemById = async (req, res) => {
  try {
    const { id } = req.params

    if (!isValidMongoId(id)) {
      return res.status(400).json({ message: "Invalid ID" })
    }

    const item = await FileService.getItemById(id)
    res.json(item)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

// Create a new file or folder
exports.createItem = async (req, res) => {
  try {
    const { name, type, parentId, content } = req.body

    let mimeType = ""
    if (type === "text") {
      mimeType = getMimeType(name)
    } else if (type === "image") {
      mimeType = getMimeType(name)
    }

    const item = await FileService.createItem(name, type, parentId, content, mimeType)
    res.status(201).json(item)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Rename a file or folder
exports.renameItem = async (req, res) => {
  try {
    const { id } = req.params
    const { name } = req.body

    if (!isValidMongoId(id)) {
      return res.status(400).json({ message: "Invalid ID" })
    }

    const item = await FileService.renameItem(id, name)
    res.json(item)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Update file content
exports.updateFileContent = async (req, res) => {
  try {
    const { id } = req.params
    const { content } = req.body

    if (!isValidMongoId(id)) {
      return res.status(400).json({ message: "Invalid ID" })
    }

    const item = await FileService.updateContent(id, content)
    res.json(item)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Delete a file or folder
exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params

    if (!isValidMongoId(id)) {
      return res.status(400).json({ message: "Invalid ID" })
    }

    await FileService.deleteItem(id)
    res.json({ message: "Item deleted successfully" })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

// Get the full path of an item
exports.getItemPath = async (req, res) => {
  try {
    const { id } = req.params

    if (!isValidMongoId(id)) {
      return res.status(400).json({ message: "Invalid ID" })
    }

    const path = await FileService.getItemPath(id)
    res.json(path)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

// Search files by name
exports.searchFiles = async (req, res) => {
  try {
    const { query, parentId } = req.query

    if (parentId && !isValidMongoId(parentId)) {
      return res.status(400).json({ message: "Invalid parent ID" })
    }

    const results = await FileService.searchFiles(query, parentId)
    res.json(results)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Move item to another folder
exports.moveItem = async (req, res) => {
  try {
    const { id } = req.params
    const { newParentId } = req.body

    if (!isValidMongoId(id)) {
      return res.status(400).json({ message: "Invalid ID" })
    }

    if (newParentId && !isValidMongoId(newParentId)) {
      return res.status(400).json({ message: "Invalid parent ID" })
    }

    const item = await FileService.moveItem(id, newParentId)
    res.json(item)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Get folder statistics
exports.getFolderStats = async (req, res) => {
  try {
    const { id } = req.params

    if (!isValidMongoId(id)) {
      return res.status(400).json({ message: "Invalid ID" })
    }

    const stats = await FileService.getFolderStats(id)
    res.json(stats)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}
