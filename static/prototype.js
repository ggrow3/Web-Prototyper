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
  
  // Get all posts from the database and display them in the post list
  const refreshPosts = () => {

    const transaction = db.transaction("posts", "readonly");
    const objectStore = transaction.objectStore("posts");
    var url = new URL(window.location.href);
    let prototypeId = url.searchParams.get("id");
    prototypeId = parseInt(prototypeId, 10);

    const request = objectStore.get(prototypeId);
    request.onsuccess = () => {
      const post = request.result;
        
        document.open();
        document.write(post.output);
        document.close();

    };
    request.onerror = (event) => {
      console.error("Failed to get posts", event.target.error);
    };
  };
  
  
  // Initial refresh of the post list
  refreshPosts();
};


