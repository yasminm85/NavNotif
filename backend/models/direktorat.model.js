const mongoose = require('mongoose');

const DirektoratSchema = new mongoose.Schema({
  _id: { type: String, required: true }, 
  name: { type: String, required: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Direktorat', DirektoratSchema);
