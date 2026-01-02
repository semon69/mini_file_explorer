const validateCreateItem = (req, res, next) => {
  const { name, type } = req.body

  if (!name || typeof name !== "string") {
    return res.status(400).json({ message: "Name must be a non-empty string" })
  }

  if (!type || !["folder", "text", "image"].includes(type)) {
    return res.status(400).json({ message: "Type must be 'folder', 'text', or 'image'" })
  }

  next()
}

const validateRenameItem = (req, res, next) => {
  const { name } = req.body

  if (!name || typeof name !== "string") {
    return res.status(400).json({ message: "Name must be a non-empty string" })
  }

  next()
}

const validateUpdateContent = (req, res, next) => {
  const { content } = req.body

  if (content === undefined || typeof content !== "string") {
    return res.status(400).json({ message: "Content must be a string" })
  }

  next()
}

const validateMoveItem = (req, res, next) => {
  const { newParentId } = req.body

  if (newParentId !== undefined && newParentId !== null && typeof newParentId !== "string") {
    return res.status(400).json({ message: "newParentId must be a valid MongoDB ID or null" })
  }

  next()
}

module.exports = {
  validateCreateItem,
  validateRenameItem,
  validateUpdateContent,
  validateMoveItem,
}
