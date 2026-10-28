import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  location: {
    name: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    }
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'CANCELLED'],
    default: 'PENDING'
  },
  deleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export const Event = mongoose.model('Event', eventSchema);