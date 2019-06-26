const graphql = require('graphql')
const Post = require('../models/post')
const User = require('../models/user')
const Comment = require('../models/comment')

const { 
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLSchema, 
    GraphQLID,
    GraphQLNonNull,
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
        },
        comments: {
            type: new GraphQLList(CommentType),
            resolve(parent, args){
                return Comment.find({postId: parent.id});
            }
        }
    })
});

const CommentType = new GraphQLObjectType({
    name: 'Comment',
    fields: () => ({
        id: { type: GraphQLID },
        text: { type: GraphQLString},
        user: {
            type: UserType,
            resolve(parent, args){
               return User.findById(parent.userId);
            }
        },
        post: {
            type: PostType,
            resolve(parent, args){
                return Post.findById(parent.postId);
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
        },
        comments: {
            type: new GraphQLList(CommentType),
            resolve(parent, args){
                return Comment.find({userId: parent.id});
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
                return Post.findById(args.id)
            }
        },
        comment: {
            type: CommentType,
            args: {id: { type: GraphQLID}},
            resolve(parent, args){
              return Comment.findById(args.id)
            }
        },
        user: {
            type: UserType,
            args: {id: { type: GraphQLID}},
            resolve(parent, args){
              return User.findById(args.id)
            }
        },
        posts : {
            type: new GraphQLList(PostType),
            resolve(parent, args){
              return Post.find({})
            }
        },
        comments : {
            type: new GraphQLList(CommentType),
            resolve(parent, args){
              return Comment.find({})
            }
        },
        users: {
            type: new GraphQLList(UserType),
            resolve(parent, args){
              return User.find({})
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
        deleteUser: {
            type: UserType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, {id}){
                return User.findByIdAndRemove(id);
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
        },
        deletePost: {
            type: PostType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, {id}){
                return Post.findByIdAndRemove(id);
            }
        },
        addComment: {
            type: CommentType,
            args: {
                text: {type: GraphQLString},
                userId: {type: GraphQLID},
                postId: {type: GraphQLID}
            },
            resolve(parent, args){
                let comment = new Comment({
                    text: args.text,
                    userId: args.userId,
                    postId: args.postId
                });
                return comment.save();
            }
        },
        deleteComment: {
            type: CommentType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, {id}){
                return Comment.findByIdAndRemove(id);
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});