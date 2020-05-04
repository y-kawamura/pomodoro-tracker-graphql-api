const { GraphQLScalarType } = require('graphql')
const Pomodoro = require('../models/Pomodoro')
const { toDate } = require('../lib')

const resolvers = {
  Query: {
    allPomodoros: () => Pomodoro.find(),
    todayPomodoro: () => Pomodoro.findOne({ day: toDate(new Date()) })
  },

  Mutation: {
    async addPomodoro(parent, { input }) {
      // find or create
      let pomodoro = await Pomodoro.findOne({ day: input.day })
      if (!pomodoro) {
        pomodoro = await new Pomodoro({
          day: input.day
        }).save()
      }

      const newSession = {
        id: pomodoro.sessions.length + 1,
        task: input.task,
        startTime: input.startTime,
        endTime: input.endTime
      }

      pomodoro.sessions.push(newSession)
      await pomodoro.save()

      return newSession
    }
  },

  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'A valid date value',
    parseValue: (value) => toDate(new Date(value)),
    serialize: (value) => new Date(value).toISOString(),
    parseLiteral: (ast) => toDate(new Date(ast.value))
  }),

  DateTime: new GraphQLScalarType({
    name: 'DateTime',
    description: 'A valid date time value',
    parseValue: (value) => new Date(value),
    serialize: (value) => new Date(value).toISOString(),
    parseLiteral: (ast) => new Date(ast.value)
  })
}

module.exports = resolvers
