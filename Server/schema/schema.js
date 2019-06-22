const graphql = require('graphql');
const _ = require('lodash');
const Blogpost = require('../models/blogpost');
const User = require('../models/user');

const { 
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLSchema, 
    GraphQLID,
    GraphQLList } = graphql;

const BlogpostType = new GraphQLObjectType({
    name: 'Blogpost',
    fields: () => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString},
        content: { type: GraphQLString},
        user: {
            type: UserType,
            resolve(parent, args){
               return User.findById(parent.userId);
            }
        }
    })
});

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID },
        firstName: { type: GraphQLString},
        lastName: { type: GraphQLString},
        email: { type: GraphQLString},
        blogPosts: {
            type: new GraphQLList(BlogpostType),
            resolve(parent, args){
               return Blogpost.find({userId: parent.id});
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        blogpost: {
            type: BlogpostType,
            args: {id: { type: GraphQLID}},
            resolve(parent, args){
                return Blogpost.findById(args.id);
            }
        },
        user: {
            type: UserType,
            args: {id: { type: GraphQLID}},
            resolve(parent, args){
              return User.findById(args.id);
            }
        },
        blogPosts : {
            type: new GraphQLList(BlogpostType),
            resolve(parent, args){
              return Blogpost.find({});
            }
        },
        users: {
            type: new GraphQLList(UserType),
            resolve(parent, args){
              return User.find({});
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name:'Mutation',
    fields: {
        addUser: {
            type: UserType,
            args: {
                firstName: { type: GraphQLString},
                lastName: { type: GraphQLString},
                email: { type: GraphQLString}
            },
            resolve(parent, args){
                let user = new User({
                    firstName: args.firstName,
                    lastName: args.lastName,
                    email: args.email
                });
                return user.save();
            }
        },
        addBlogpost: {
            type: BlogpostType,
            args: {
                title: {type: GraphQLString},
                content: {type: GraphQLString},
                userId: {type: GraphQLID}
            },
            resolve(parent, args){
                let blogpost = new Blogpost({
                    title: args.title,
                    content: args.content,
                    userId: args.userId
            });
            return blogpost.save();
        }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});