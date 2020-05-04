const express = require('express')
const { readFileSync } = require('fs')
const mongoose = require('mongoose')
const { ApolloServer, gql } = require('apollo-server-express')

const typeDefs = gql(
  readFileSync(__dirname.concat('/typeDefs.graphql'), 'utf8')
)

const resolvers = require('./resolvers')

require('dotenv').config()

async function start() {
  // connect db
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log('Connected successfully to database')
  } catch (error) {
    console.error(error)
    process.exit(1)
  }

  const server = new ApolloServer({
    typeDefs,
    resolvers
  })

  const app = express()
  server.applyMiddleware({ app })

  const port = process.env.PORT || 8888
  app.listen(port, () =>
    console.log(`🚀 Server ready at http://localhost:8888${server.graphqlPath}`)
  )
}

start()
