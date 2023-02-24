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
        link.text = post.name;
        // Append the link to the div
        listItem.append(link);

        listButton = document.createElement("button");
        listButton.classList.add("list-button");
        listButton.textContent = "View Code";
        listItem.append(listButton);
        
        listButton.addEventListener('click', function(event) {
          // Do something when the element is clicked
          console.log("Clicked on post");

          document.getElementById("prompt_input").value = post.input;
          document.getElementById("prompt_output").value = post.output;
          event.preventDefault(); 
        });
        postList.appendChild(listItem);

         deleteButton = document.createElement("button");
        deleteButton.classList.add("list-button");
        deleteButton.textContent = "Delete";
        listItem.append(deleteButton);
        
        deleteButton.addEventListener('click', function(event) {
          // Do something when the element is clicked
          // Open the database
var request = indexedDB.open("posts");

// Access the object store and delete the item
request.onsuccess = function(event) {
  var db = event.target.result;
  var transaction = db.transaction("posts", "readwrite");
  var objectStore = transaction.objectStore("posts");
  var deleteRequest = objectStore.delete(post.id);
  
  // Handle success or errors
  deleteRequest.onsuccess = function(event) {
    console.log("Item deleted successfully");
    refreshPosts();
  };
  
  deleteRequest.onerror = function(event) {
    console.log("Error deleting item: " + event.target.error);
  };
};
          event.preventDefault(); 
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
  addPostBtn.addEventListener("click", (event) => {

    const post = {
      input: document.getElementById("prompt_input").value,
      name: document.getElementById("name").value,
      output: document.getElementById("prompt_output").value
    };
      if (post.input === "" || post.name === "" || post.output === "") {
    alert("Please enter all the required fields.");
    event.preventDefault();
    return;
  
  }
    
    addPost(post);
    
  });
  
  // Initial refresh of the post list
  refreshPosts();
};


