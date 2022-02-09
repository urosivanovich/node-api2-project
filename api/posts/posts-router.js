// implement your posts router here
const router = require('express').Router()

const { json } = require('express/lib/response')
// const express = require('express)
// const router = express.Router()

const Posts = require('./posts-model')

router.get('/', (req, res) => {
    Posts.find(req.query)
    .then(posts => {
        res.status(200).json(posts)
    })
    .catch(err => {
        res.status(500).json({
            message: 'The posts information could not be retrieved',
            error: err.message
        })
    })
})

router.get('/:id', (req, res) => {
    Posts.findById(req.params.id)
    .then(post => {
        if(!post) {
            res.status(404).json({
                message: 'The post with the specified ID does not exist'
            })
        } else {res.status(200).json(post)}
    })
    .catch(err => {
        res.status(500).json({
            message: 'The post information could not be retrieved',
            error: err.message
        })
    })
})

router.post('/', (req, res) => {
    const { title, contents} = req.body
    if(!title || !contents) {
        res.status(400).json({
            message: 'Please provide title and contents for the post'
        }) 
    } else {
        Posts.insert(req.body)
        .then(newPost => {
            res.status(201).json({...newPost, ...req.body})
        })
        .catch(err => {
            res.status(500).json({
                message: 'There was an error while saving the post to the database',
                error: err.message
            })
        })
    }
}) 

router.put('/:id', (req, res) => {
    const { id } = req.params
    const { title, contents } = req.body
    if(title && contents) {
        Posts.update(id, req.body)
        .then(updated => {
            if(updated){
                res.status(200).json({id: updated, ...req.body})
            }else{
                res.status(404).json({
                    message: 'The post with the specified ID does not exist'
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                message: 'The post information could not be modified',
                error: err.message
            })
        })
    } else {
        res.status(400).json({
            message: 'Please provide title and contents for the post'
        })
    }
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params
    try {
        const post = await Posts.findById(id)
        if(!post) {
            res.status(404).json({
                message: 'The post with the specified ID does not exist'
            })
        } else {
            await Posts.remove(id)
            res.status(200).json(post)
        }
    } catch(err) {
        res.status(500).json({
            message: 'The post could not be removed'
        })
    }

})

router.get('/:id/comments', (req, res) => {
    const { id } = req.params
    Posts.findPostComments(id)
    .then(comments => {
        console.log(comments)
        if(comments.length > 0) {
            res.status(200).json(comments)
        } else {
            res.status(404).json({
                message: 'The post with the specified ID does not exist'
            })
        }
    })
    .catch(err => {
        res.status(500).json({
            message: 'The post could not be removed',
            error: err.message
        })
    })
})
   


module.exports = router 