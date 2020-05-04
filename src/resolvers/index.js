const { GraphQLScalarType } = require('graphql')
const Pomodoro = require('../models/Pomodoro')

const resolvers = {
  Query: {
    allPomodoros: () => Pomodoro.find()
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

      pomodoro.sessions.push({
        id: pomodoro.sessions.length + 1,
        task: input.task,
        startTime: input.startTime,
        endTime: input.endTime
      })
      const updatedPomodoro = await pomodoro.save()

      return updatedPomodoro
    }
  },

  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'A valid date value',
    parseValue: (value) => {
      let date = new Date(value)
      return new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
      )
    },
    serialize: (value) => new Date(value).toISOString(),
    parseLiteral: (ast) => {
      let date = new Date(ast.value)
      return new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
      )
    }
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
