const express = require("express")
const router = express.Router()
const fileController = require("../controllers/fileController")
const { validateCreateItem, validateRenameItem, validateUpdateContent, validateMoveItem } =
  require("../middleware/validation")

// Get all root items
router.get("/root", fileController.getRootItems)

// Search files (must come before /:id)
router.get("/search", fileController.searchFiles)

// Get items by parent ID
router.get("/parent/:parentId", fileController.getItemsByParentId)

// Get item by ID
router.get("/:id", fileController.getItemById)

// Get folder stats
router.get("/:id/stats", fileController.getFolderStats)

// Get item path
router.get("/:id/path", fileController.getItemPath)

// Create new item
router.post("/", validateCreateItem, fileController.createItem)

// Rename item
router.put("/:id/rename", validateRenameItem, fileController.renameItem)

// Update file content
router.put("/:id/content", validateUpdateContent, fileController.updateFileContent)

// Move item
router.put("/:id/move", validateMoveItem, fileController.moveItem)

// Delete item
router.delete("/:id", fileController.deleteItem)

module.exports = router
