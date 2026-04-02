const mongoose = require('mongoose');

const RecordSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be positive'],
    },
    type: {
      type: String,
      enum: ['INCOME', 'EXPENSE'],
      required: [true, 'Type (INCOME or EXPENSE) is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// ─── Indexes for optimised filtering queries ──────────────────────────────────
RecordSchema.index({ date: 1 });
RecordSchema.index({ type: 1 });
RecordSchema.index({ category: 1 });

module.exports = mongoose.model('Record', RecordSchema);
