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
  const addPost = (post) => {
    const transaction = db.transaction("posts", "readwrite");
    const objectStore = transaction.objectStore("posts");
 
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
        listItem.classList.add("my-li-class"); 
  
        let link = document.createElement('a');
        link.href = "https://web-prototyper.kevron.repl.co/website-prototype?id=" + post.id;
        link.text = post.name.substring(0,10);
        // Append the link to the div
        listItem.appendChild(link);

        listButton = document.createElement("button");
        listButton.classList.add("list-button");
        listButton.textContent = "View Code";
        listItem.appendChild(listButton);
        
        listButton.addEventListener('click', function() {
          // Do something when the element is clicked
          console.log("Clicked on post");

          document.getElementById("prompt_input").value = post.input;
          document.getElementById("prompt_output").value = post.output;
          
        });
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

    const post = {
      input: document.getElementById("prompt_input").value,
      name: document.getElementById("name").value,
      output: document.getElementById("prompt_output").value
    };
    addPost(post);
    // Clear the post input
  });
  
  // Initial refresh of the post list
  refreshPosts();
};


