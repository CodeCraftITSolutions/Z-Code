const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student', // Reference to the Student model
      required: true
    },
    contestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contest', // Reference to the Contest model
      required: true
    },
    totalGrade:{
      type: Number,
      default: 0
    },
    createdAt: {
      type: Date,
      default: Date.now // Set the default value to the current date/time
    }
  });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
