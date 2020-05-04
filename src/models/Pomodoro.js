const mongoose = require('mongoose')

const pomodoroSchema = new mongoose.Schema({
  day: {
    type: Date,
    required: true
  },
  sessions: {
    type: [
      {
        id: {
          type: Number,
          required: true
        },
        task: {
          type: String,
          default: ''
        },
        startTime: {
          type: Date,
          required: true
        },
        endTime: {
          type: Date,
          required: true
        }
      }
    ],
    default: []
  }
})

const Pomodoro = mongoose.model('Pomodoro', pomodoroSchema)

module.exports = Pomodoro
