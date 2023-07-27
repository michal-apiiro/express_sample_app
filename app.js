const express = require('express');
const app = express();
const mongoose = require('mongoose');

const postsSchema = new mongoose.Schema({
    title: String,
    author: String,
    creation_date: Date,
    content: String
    
});
app.use(express.json())
const sort = {creation_date:1}
const Post = mongoose.model('Post', postsSchema);

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/tutorial');
    app.listen(3000, () => console.log("server started"));
}


app.post("/posts", async (req, res) => {
    const post = new Post({
        // id:shortid(),
        title:req.body.title,
        author:req.body.author,
        creation_date:Date.now(),
        content:req.body.content
    });
    await post.save();
    res.send(post);
});


app.delete("/posts/:postId",async(req,res) => {
    const post = await Post.find({_id:req.params.postId});
    //const post = await Post.findById(req.params.postId)
    if (post == null) {
        await Post.deleteOne({_id:req.postId}); 
        console.log(await Post.deleteOne({_id:req.params.id}));
        res.send("deleted")
    }

    else {
        res.send("Not found")
    }
    

});



app.get("/posts",async(req,res)=> {
    const query = {};

    if (req.query.author != null) {
        query.author = req.query.author;
    }

    if (req.query.title != null) {
        query.title = req.query.title;
    }

    const post = await Post.find(query);

    res.send(post);     
});


app.get("/posts/:postId", async(req,res)=> {
    const post = await Post.find({_id:req.params.postId});
    console.log(post)

    if (post == null) {
        res.sendStatus(404);
    } else {
        res.send(post); 
    }
});

// /forum/:forum_id
// /forum/:forum_id/posts
// /forum/:forum_id/posts?author=michal
// /forum/:forum_id/posts/:post_id
main().catch(err => console.error(err));
