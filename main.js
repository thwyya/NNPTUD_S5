const express = require('express')
const app = express()
const port = 3000
let fs = require('fs')


app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.get('/posts', (req, res) => {
    let posts = fs.readFileSync('./db.json');
    posts = JSON.parse(posts).posts;
    
    let queries = req.query;
    let views = queries.views;
    let views_lte = queries.views_lte;
    let views_gte = queries.views_gte;
    let title = queries.title;
    let title_like = queries.title_like;
    
    if(views){
        posts = posts.filter(
            p=>p.views==views
        )
    }
    if(views_lte){
        posts = posts.filter(
            p=>p.views<=views_lte
        )
    }
    if(views_gte){
        posts = posts.filter(
            p=>p.views>=views_gte
        )
    }
    if(title_like){
        posts  = posts.filter(
            p=>p.title.includes(title_like)
        )
    }
    if(title){
        posts  = posts.filter(
            p=>p.title == title
        )
    }
    res.send(posts)
})

app.get('/posts/:id', (req, res) => {
    let posts = JSON.parse(fs.readFileSync('./db.json')).posts; 
    let id = req.params.id;
    let post = posts.find(p => p.id == id);
    if(post){
        res.send(post);
    }else{
        res.status(404).send({
            success:false,
            data:{
                message: "id not found"
            }
        });
    }
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})