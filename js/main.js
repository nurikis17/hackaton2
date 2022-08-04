let API = "http://localhost:8000/users";
let API2 = "http://localhost:8000/posts";
let login = document.querySelector("#regLogin-inp");
let pass = document.querySelector("#regPass-inp");
let passConfirm = document.querySelector("#confirmPass-inp");
let registerBtn = document.querySelector("#registerBtn");
// users script start
let inSystem = "";
async function changeInSystemUser(userName = "") {
  inSystem = userName;
  let inSys = document.querySelector("#user__inSystem");
  if (inSystem) {
    inSys.innerText = `Hello ${inSystem}!`;

    let res = await fetch("http://localhost:8000/posts");
    let data = await res.json();
    let findUser = data.forEach((item) => {
      if (item.user === userName) {
        getPostObj(item.id);
      }
    });
  } else {
    inSys.innerText = "No users in system";
    cardsContainer.innerHTML = "";
  }
}

// create logic

function checkPassword(pass, passConfirm) {
  return pass === passConfirm;
}

async function createUser() {
  let userName = login.value;
  let res = await fetch(API);
  let data = await res.json();
  data.some((item) => item.name === userName);

  if (data.some((item) => item.name === userName)) {
    alert("User already exists");
    return;
  }

  let password = pass.value;
  let passwordConfirm = passConfirm.value;

  if (!checkPassword(password, passwordConfirm)) {
    alert("passwords do not match");
    return;
  }

  let userObj = {
    name: userName,
    password: password,
    isLogin: false,
  };
  await fetch(API, {
    method: "POST",
    body: JSON.stringify(userObj),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });
  alert("user created successfully");
}
registerBtn.addEventListener("click", createUser);

//login logic

async function loginUser() {
  let login = document.querySelector("#login-inp");
  let userName = login.value;
  let res = await fetch(API);
  let data = await res.json();

  if (!data.some((item) => item.name === userName)) {
    alert("user not found");
    return;
  }
  let pass = document.querySelector("#pass-inp");
  let foundName = data.find((item) => item.name === userName);
  console.log(foundName.id);
  console.log(pass.value);
  if (!(foundName.password === pass.value)) {
    alert("Password doesn't match this account");
    return;
  }
  fetch(`http://localhost:8000/users/${foundName.id}`, {
    method: "PATCH",
    body: JSON.stringify({ isLogin: true }),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });
  changeInSystemUser(userName);
}

let loginBtn = document.querySelector("#loginBtn");
loginBtn.addEventListener("click", loginUser);
//logOut logic

let logoutBtn = document.querySelector("#logoutBtn");
logoutBtn.addEventListener("click", logOut);
async function logOut() {
  let res = await fetch(API);
  let data = await res.json();
  data.forEach((item) => {
    fetch(`http://localhost:8000/users/${item.id}`, {
      method: "PATCH",
      body: JSON.stringify({ isLogin: false }),
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });
    changeInSystemUser("");
  });
}
//Users Script End

//posts scrips start

//create post logic
let post = document.querySelector("#post-inp");
let createPostBtn = document.querySelector("#createPostBtn");
let editPostBtn = document.querySelector("#editPostBtn");
let deletePostBtn = document.querySelector("#deletePostBtn");
let cardsContainer = document.querySelector(".card_container");
let inpSearch = document.querySelector("#postEdit-inp");
let postImg = document.querySelector("#post-img-url");

async function getPostObj(id) {
  let postsId = id;
  let res = await fetch(`http://localhost:8000/posts/${id}`);
  let data = await res.json();
  cardsContainer.innerHTML += `
<div class="card">

  <h5 class="card-title">${data.title}</h5>
  <img src="${data.url}" class="card-img-top" alt="...">
  
  <div class="card-body">
  <p class="card-text">Автор: ${data.user}</p>
  </div>

  <ul class="list-group list-group-flush">
  <li class="list-group-item"> <img class="list-group-item_img" src="./images/likes icon.jpeg" width="20" height="20" alt="">${data.likes}</li>
  <li class="list-group-item"> <img class="list-group-item_img" src="./images/comm icon.jpeg" width="20" height="20" alt="">${data.comments}</li>
  <li class="list-group-item"> <img class="list-group-item_img" src="./images/views icon.jpeg" width="20" height="20" alt="">${data.views}</li>
  </ul>


</div>`;
}

async function createPost() {
  if (!inSystem) {
    alert("only authirized users can create posts");
    return;
  }

  let postTitle = post.value;
  let imgUrl = postImg.value;
  let postObj = {
    title: postTitle,
    user: inSystem,
    likes: 0,
    url: imgUrl,
  };
  await fetch(API2, {
    method: "POST",
    body: JSON.stringify(postObj),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });
  alert("posts successffuly created");
  let res = await fetch("http://localhost:8000/posts");
    let data = await res.json();
    let findUser = data.forEach((item) => {
      if (item.user === inSystem) {
        getPostObj(item.id);
      }
})
}

//update post logic

let editPostId = document.querySelector("#postEdit-inp");

async function checkOwnerPost(id) {
  let res = await fetch(`${API2}/${id}`);
  let data = await res.json();
  console.log(data);

  return data.user === inSystem;
}


async function deletePost() {
  if (!inSystem) {
    alert("only authirized users can create posts");
    return;
  }

  let postId = document.querySelector(".change__post_inp").value;
  let flag = await checkOwnerPost(postId);
  if (!flag) {
    alert(
      "there is no post with this id or you are not the author of such a post"
    );
    return;
  }

  await fetch(`http://localhost:8000/posts/${postId}`, {
    method: "DELETE",
  });
  alert("Post successfully Deleted");
}



async function checkOwnerPost(id) {
  let res = await fetch(`${API2}/${id}`);
  let data = await res.json();
  console.log(data);

  return data.user === inSystem;
}

async function updatePost() {
  if (!inSystem) {
    alert("only authirized users can create posts");
    return;
  }
  let postId = editPostId.value;
  let flag = checkOwnerPost(postId);
  console.log(flag);
  if (!flag) {
    alert(
      "there is no post with this id or you are not the author of such a post"
    );
    return;
  }

  let newPostData = document.querySelector(".change__post_inp");
  await fetch(`http://localhost:8000/posts/${postId}`, {
    method: "PATCH",
    body: JSON.stringify({ title: newPostData.value }),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });
  alert("Post successfully updated");
}
