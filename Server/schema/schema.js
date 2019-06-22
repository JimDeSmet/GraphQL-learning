const graphql = require('graphql');
const _ = require('lodash');
const Post = require('../models/post');
const User = require('../models/user');

const { 
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLSchema, 
    GraphQLID,
    GraphQLList } = graphql;

const PostType = new GraphQLObjectType({
    name: 'Post',
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
        posts: {
            type: new GraphQLList(PostType),
            resolve(parent, args){
               return Post.find({userId: parent.id});
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        post: {
            type: PostType,
            args: {id: { type: GraphQLID}},
            resolve(parent, args){
                return Post.findById(args.id);
            }
        },
        user: {
            type: UserType,
            args: {id: { type: GraphQLID}},
            resolve(parent, args){
              return User.findById(args.id);
            }
        },
        posts : {
            type: new GraphQLList(PostType),
            resolve(parent, args){
              return Post.find({});
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
        addPost: {
            type: PostType,
            args: {
                title: {type: GraphQLString},
                content: {type: GraphQLString},
                userId: {type: GraphQLID}
            },
            resolve(parent, args){
                let post = new Post({
                    title: args.title,
                    content: args.content,
                    userId: args.userId
            });
            return post.save();
        }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});