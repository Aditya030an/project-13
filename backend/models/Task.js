const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date },
    completed: { type: Boolean, default: false }
  },
  { timestamps: true } // Automatically adds `createdAt` & `updatedAt`
);

module.exports = mongoose.model("Task", taskSchema);
