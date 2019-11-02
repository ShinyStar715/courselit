const mongoose = require('mongoose')

const MediaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  originalFileName: { type: String, required: true },
  fileName: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: String, required: true },
  creatorId: { type: mongoose.Schema.Types.ObjectId, required: true },
  altText: { type: String },
  thumbnail: { type: String }
})

MediaSchema.index({
  originalFileName: 'text',
  title: 'text',
  altText: 'text'
})

module.exports = mongoose.model('Media', MediaSchema)
