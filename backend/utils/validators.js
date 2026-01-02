const mongoose = require("mongoose")

const isValidMongoId = (id) => {
  return mongoose.Types.ObjectId.isValid(id)
}

const sanitizeFileName = (name) => {
  // Remove special characters that are problematic for file systems
  return name.replace(/[<>:"|?*]/g, "").trim()
}

const getFileExtension = (fileName) => {
  const lastDot = fileName.lastIndexOf(".")
  if (lastDot === -1) return ""
  return fileName.substring(lastDot + 1).toLowerCase()
}

const getMimeType = (fileName) => {
  const ext = getFileExtension(fileName)
  const mimeTypes = {
    txt: "text/plain",
    md: "text/markdown",
    json: "application/json",
    html: "text/html",
    css: "text/css",
    js: "text/javascript",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    svg: "image/svg+xml",
    webp: "image/webp",
  }
  return mimeTypes[ext] || "application/octet-stream"
}

const isTextFile = (mimeType) => {
  return mimeType.startsWith("text/") || mimeType.includes("json") || mimeType.includes("javascript")
}

const isImageFile = (mimeType) => {
  return mimeType.startsWith("image/")
}

module.exports = {
  isValidMongoId,
  sanitizeFileName,
  getFileExtension,
  getMimeType,
  isTextFile,
  isImageFile,
}
