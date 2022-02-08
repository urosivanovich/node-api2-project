// implement your server here
// require your posts router and connect it here
const express = require('express');
const server = express();

const postsRouter = require('./posts/posts-router')

server.use(express.json())
server.use('/api/posts', postsRouter)


server.use('*', (req, res) => {
    res.status(404).send(`
    <h2>We couldn't find that resources</h2>
    `)
});

module.exports = server;
