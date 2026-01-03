const mongoose = require("mongoose")

const fileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (v) => {
          return !/[<>:"|?*]/.test(v)
        },
        message: "File name contains invalid characters",
      },
    },
    type: {
      type: String,
      enum: ["folder", "text", "image"],
      required: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
      default: null,
    },
    content: {
      type: String,
      default: "",
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    mimeType: {
      type: String,
      default: "",
    },
    isHidden: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
)

// Index for faster queries
fileSchema.index({ parentId: 1 })
fileSchema.index({ name: 1, parentId: 1 })
fileSchema.index({ createdAt: 1 })

module.exports = mongoose.model("File", fileSchema)
