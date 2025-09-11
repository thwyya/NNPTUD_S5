LoadData();
//GET: domain:port//posts
//GET: domain:port/posts/id
async function LoadData() {
    let data = await fetch('http://localhost:3000/posts');
    let posts = await data.json();
    for (const post of posts) {
        let body = document.getElementById("body");
        body.innerHTML += convertDataToHTML(post);
    }
}
function LoadDataA() {
    fetch('http://localhost:3000/posts').then(
        function (data) {
            return data.json()
        }
    ).then(
        function (posts) {
            for (const post of posts) {
                let body = document.getElementById("body");
                body.innerHTML += convertDataToHTML(post);
            }
        }
    )
}

function convertDataToHTML(post) {
    let result = "<tr>";
    result += "<td>" + post.id + "</td>";
    result += "<td>" + post.title + "</td>";
    result += "<td>" + post.views + "</td>";
    result += "<td><input type='submit' value='Delete' onclick='Delete("+post.id+")'></input></td>";
    result += "</tr>";
    return result;
}



//POST: domain:port//posts + body
function SaveData(){
    let id = document.getElementById("id").value;
    let title = document.getElementById("title").value;
    let view = document.getElementById("view").value;
    fetch("http://localhost:3000/posts/"+id).then(
        function(data){
            if(data.ok){
                let dataObj = {
                    title:title,
                    views:view
                }
                fetch('http://localhost:3000/posts/'+id,
                {
                    method:'PUT',
                    body:JSON.stringify(dataObj),
                    headers:{
                        "Content-Type":"application/json"
                    }

                }).then(
                    function(data){
                        console.log(data);
                    }
                )
            }else{
                let dataObj = {
                    id:id,
                    title:title,
                    views:view
                }
                fetch('http://localhost:3000/posts',
                {
                    method:'POST',
                    body:JSON.stringify(dataObj),
                    headers:{
                        "Content-Type":"application/json"
                    }

                }).then(
                    function(data){
                        console.log(data);
                    }
                )
            }
        }
    )


    
}
//PUT: domain:port//posts/id + body

//DELETE: domain:port//posts/id
function Delete(id){
    fetch('http://localhost:3000/posts/'+id,{
        method:'Delete'
    }).then(
        function(){
            console.log("Delete thanh cong");
        }
    )
}