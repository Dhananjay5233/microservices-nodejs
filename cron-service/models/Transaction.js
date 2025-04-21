const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  amount: Number,
  serviceCharge: Number,
  gst: Number,
  userId: String,
  prevBalance: Number,
  updatedBalance: Number,
  serviceId: String,
  status: String
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);