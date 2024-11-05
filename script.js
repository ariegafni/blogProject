let isAdmin = false;
const correctPassword = "241096";

// טעינת מצב המנהל מ-Local Storage
loadAdminStatus();
loadPostsFromLocalStorage();
displayPosts(posts);

// פונקציה לבדיקת סיסמת מנהל
function checkAdminPassword() {
    const enteredPassword = prompt("Please enter admin password:");
    if (enteredPassword === correctPassword) {
        isAdmin = true;
        localStorage.setItem("isAdmin", "true"); // שמירת מצב מנהל ב-Local Storage
        alert("Welcome, Admin!");
        location.reload(); // רענון הדף והצגת אפשרויות המנהל
    } else {
        alert("Incorrect password. Access denied.");
    }
}

// טעינת מצב המנהל מה-Local Storage
function loadAdminStatus() {
    isAdmin = localStorage.getItem("isAdmin") === "true";
}

// פונקציה להוספת פוסט חדש
function addNewBlog() {
    const title = document.getElementById("postTitle").value;
    const content = document.getElementById("postContent").value;
    const imageFile = document.getElementById("postImage").files[0];

    if (!title || !content) {
        alert("Please enter both title and content.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const newPost = {
            id: Date.now(),
            title: title,
            content: content,
            imageUrl: e.target.result
        };
        posts.push(newPost);
        displayPosts(posts);
        savePostsToLocalStorage(); // שמירת הפוסטים לאחר ההוספה
    };

    if (imageFile) {
        reader.readAsDataURL(imageFile);
    } else {
        const newPost = {
            id: Date.now(),
            title: title,
            content: content,
            imageUrl: ""
        };
        posts.push(newPost);
        displayPosts(posts);
        savePostsToLocalStorage(); // שמירת הפוסטים לאחר ההוספה
    }

    // ניקוי השדות בטופס
    document.getElementById("postTitle").value = "";
    document.getElementById("postContent").value = "";
    document.getElementById("postImage").value = "";
}

// הצגת הפוסטים בדף
function displayPosts(posts) {
    const postsContainer = document.getElementById("postsContainer");
    postsContainer.innerHTML = "";

    posts.forEach((post) => {
        const postDiv = document.createElement("div");
        postDiv.classList.add("post");

        const title = document.createElement("h2");
        title.innerText = post.title;
        postDiv.appendChild(title);

        const content = document.createElement("p");
        content.innerText = post.content;
        postDiv.appendChild(content);

        if (post.imageUrl) {
            const img = document.createElement("img");
            img.src = post.imageUrl;
            img.alt = "Post Image";
            img.style.maxWidth = "200px";
            postDiv.appendChild(img);
        }

        // אפשרויות עריכה ומחיקה למנהל
        if (isAdmin) {
            const editButton = document.createElement("button");
            editButton.innerText = "Edit";
            editButton.onclick = () => editPost(post.id);
            postDiv.appendChild(editButton);

            const deleteButton = document.createElement("button");
            deleteButton.innerText = "Delete";
            deleteButton.onclick = () => deletePost(post.id);
            postDiv.appendChild(deleteButton);
        }

        postsContainer.appendChild(postDiv);
    });
}

// פונקציה לעריכת פוסט
function editPost(postId) {
    const post = posts.find((p) => p.id === postId);
    if (post) {
        const newTitle = prompt("Edit Title:", post.title);
        const newContent = prompt("Edit Content:", post.content);
        if (newTitle) post.title = newTitle;
        if (newContent) post.content = newContent;
        displayPosts(posts);
        savePostsToLocalStorage(); // שמירת השינויים ב-Local Storage
    }
}

// פונקציה למחיקת פוסט
function deletePost(postId) {
    posts = posts.filter((p) => p.id !== postId);
    displayPosts(posts);
    savePostsToLocalStorage(); // שמירת השינויים ב-Local Storage לאחר מחיקה
}

// פונקציה לשמירת הפוסטים ב-Local Storage
function savePostsToLocalStorage() {
    localStorage.setItem("posts", JSON.stringify(posts));
}

// פונקציה לטעינת הפוסטים מ-Local Storage
function loadPostsFromLocalStorage() {
    const storedPosts = localStorage.getItem("posts");
    if (storedPosts) {
        posts = JSON.parse(storedPosts);
    }
}

// כפתור בממשק להפעיל את פונקציית המנהל
document.getElementById("adminLoginButton").onclick = checkAdminPassword;
