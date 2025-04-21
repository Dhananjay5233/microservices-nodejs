const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  amount: Number,
  serviceCharge: Number,
  gst: Number,
  userId: String,
  prevBalance: Number,
  updatedBalance: Number,
  serviceId: String,
  status: { type: String, enum: ['initiated', 'awaited', 'success'], default: 'initiated' }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);