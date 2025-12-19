const mongoose = require('mongoose');

const DivisiSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  direktoratId: { type: String, ref: 'Direktorat', required: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Divisi', DivisiSchema);
