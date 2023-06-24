const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  option: {
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      }
    }),
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  },
  total: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  status: {
    type: String,
    default: 'completed'
  }
});

const Purchase = mongoose.model('Purchase', purchaseSchema);

module.exports = Purchase;