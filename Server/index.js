const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb+srv://maccie:Octagon112@testcluster-ahfz1.gcp.mongodb.net/test?retryWrites=true&w=majority');
mongoose.connection.once('open', () => {
    console.log('Dbase connection: succes');
});

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

app.listen(4000, () => {
    console.log('listening on port 3000')
})

