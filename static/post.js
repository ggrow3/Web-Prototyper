// Open a connection to the "posts" database (creates it if it doesn't exist)
const dbPromise = window.indexedDB.open("posts", 1);

// Create the "posts" object store (if it doesn't exist)
dbPromise.onupgradeneeded = (event) => {
  const db = event.target.result;
  db.createObjectStore("posts", { keyPath: "id", autoIncrement: true });
};

// Handle errors when opening the database
dbPromise.onerror = (event) => {
  console.error("Failed to open database", event.target.error);
};

// Handle successful database open
dbPromise.onsuccess = (event) => {
  const db = event.target.result;
  
  // Add a new post to the database
  const addPost = (text) => {
    const transaction = db.transaction("posts", "readwrite");
    const objectStore = transaction.objectStore("posts");
    const post = { text: text };
    const request = objectStore.add(post);
    request.onsuccess = () => {
      console.log("Post added to database");
      // Refresh the post list
      refreshPosts();
    };
    request.onerror = (event) => {
      console.error("Failed to add post", event.target.error);
    };
  };
  
  // Get all posts from the database and display them in the post list
  const refreshPosts = () => {
    const transaction = db.transaction("posts", "readonly");
    const objectStore = transaction.objectStore("posts");
    const request = objectStore.getAll();
    request.onsuccess = () => {
      const posts = request.result;
      const postList = document.getElementById("post-list");
      // Clear the existing post list
      postList.innerHTML = "";
      // Add each post to the post list
      for (const post of posts) {
        const listItem = document.createElement("li");
        listItem.innerText = post.text;
        postList.appendChild(listItem);
      }
    };
    request.onerror = (event) => {
      console.error("Failed to get posts", event.target.error);
    };
  };
  
  // Add event listener for the "Add Post" button
  const addPostBtn = document.getElementById("add-post-btn");
  addPostBtn.addEventListener("click", () => {
    const postInput = document.getElementById("post-input");
    const postText = postInput.value;
    addPost(postText);
    // Clear the post input
    postInput.value = "";
  });
  
  // Initial refresh of the post list
  refreshPosts();
};