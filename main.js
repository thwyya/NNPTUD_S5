LoadData();
//GET: domain:port//posts
//GET: domain:port/posts/id
async function LoadData() {
    let data = await fetch('http://localhost:3000/posts');
    let posts = await data.json();
    let body = document.getElementById("body");
    body.innerHTML = "";
    for (const post of posts) {
        if (!post.isDelete) { 
            body.innerHTML += convertDataToHTML(post);
        }
    }
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

async function getMaxID(){
    let res = await fetch('http://localhost:3000/posts');
    let posts = await res.json();
    if (posts.length === 0) return 0;
    let ids = posts.map(e => Number(e.id));
    return Math.max(...ids);
}



//POST: domain:port//posts + body
async function SaveData(){
    let id = document.getElementById("id").value.trim();
    let title = document.getElementById("title").value.trim();
    let view = parseInt(document.getElementById("view").value.trim(), 10) || 0;

    if (id) {
        // PUT (cập nhật)
        let resGet = await fetch("http://localhost:3000/posts/" + id);
        if (resGet.ok) {
            let oldData = await resGet.json();
            let dataObj = {
                id: id,
                title: title,
                views: view,
                isDelete: oldData.isDelete || false
            };

            let res = await fetch("http://localhost:3000/posts/" + id, {
                method: "PUT",
                body: JSON.stringify(dataObj),
                headers: {
                    "Content-Type": "application/json"
                }
            });
            console.log("PUT status:", res.status);
        }
    } else {
        // POST (thêm mới, id tự tăng)
        let newId = await getMaxID() + 1;
        let dataObj = {
            id: newId.toString(),
            title: title,
            views: view,
            isDelete: false
        };

        let res = await fetch("http://localhost:3000/posts", {
            method: "POST",
            body: JSON.stringify(dataObj),
            headers: {
                "Content-Type": "application/json"
            }
        });
        console.log("POST status:", res.status);
    }

    LoadData();
    document.getElementById("id").value = "";
    document.getElementById("title").value = "";
    document.getElementById("view").value = "";
}
//PUT: domain:port//posts/id + body

//DELETE: domain:port//posts/id
async function Delete(id){
    let res = await fetch('http://localhost:3000/posts/' + id);
    if (res.ok) {
        let obj = await res.json();
        obj.isDelete = true;

        let result = await fetch('http://localhost:3000/posts/' + id, {
            method: 'PUT',
            body: JSON.stringify(obj),
            headers: {
                "Content-Type": "application/json"
            }
        });
        console.log("Soft delete status:", result.status);
        LoadData();
    }
}