const graphql = require('graphql')

const userType = new graphql.GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: new graphql.GraphQLNonNull(graphql.GraphQLID) },
    email: { type: new graphql.GraphQLNonNull(graphql.GraphQLString) },
    verified: { type: graphql.GraphQLBoolean },
    name: { type: new graphql.GraphQLNonNull(graphql.GraphQLString) },
    purchases: {
      type: new graphql.GraphQLList(
        new graphql.GraphQLNonNull(graphql.GraphQLID)
      )
    },
    active: { type: new graphql.GraphQLNonNull(graphql.GraphQLBoolean) },
    isCreator: { type: graphql.GraphQLBoolean },
    isAdmin: { type: graphql.GraphQLBoolean },
    avatar: { type: graphql.GraphQLString }
  }
})

const userUpdateInput = new graphql.GraphQLInputObjectType({
  name: 'UserUpdateInput',
  fields: {
    id: { type: new graphql.GraphQLNonNull(graphql.GraphQLID) },
    name: { type: graphql.GraphQLString },
    avatar: { type: graphql.GraphQLString },
    isCreator: { type: graphql.GraphQLBoolean },
    isAdmin: { type: graphql.GraphQLBoolean },
    active: { type: graphql.GraphQLBoolean },
    password: { type: graphql.GraphQLString }
  }
})

const userSearchInput = new graphql.GraphQLInputObjectType({
  name: 'UserSearchInput',
  fields: {
    offset: { type: graphql.GraphQLInt },
    searchText: { type: graphql.GraphQLString }
  }
})

const usersSummaryType = new graphql.GraphQLObjectType({
  name: 'UsersSummary',
  fields: {
    count: { type: new graphql.GraphQLNonNull(graphql.GraphQLInt) },
    verified: { type: new graphql.GraphQLNonNull(graphql.GraphQLInt) },
    admins: { type: new graphql.GraphQLNonNull(graphql.GraphQLInt) },
    creators: { type: new graphql.GraphQLNonNull(graphql.GraphQLInt) }
  }
})

module.exports = {
  userType,
  userUpdateInput,
  userSearchInput,
  usersSummaryType
}
