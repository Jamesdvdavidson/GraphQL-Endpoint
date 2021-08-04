const { ApolloServer } = require('apollo-server')
const ServicesAPI = require('./modules/serviceAPI')
const typeDefs = require('./schemas/schemaGraphQL')
const resolvers = require('./routes/serviceResolvers')

const server = new ApolloServer({
	typeDefs,
	resolvers,
	dataSources: () => ({
		ServicesAPI: new ServicesAPI(),
	}),
	tracing: true,
	introspection: true,
	playground: true
})


server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
	console.log(`🚀 Server ready at ${url}`);
});
