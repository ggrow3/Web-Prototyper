    function parseHTML(htmlString) {
       
        let parser = new DOMParser();

        htmlString = htmlString.replace(/\n/g, '');
        let doc = parser.parseFromString(htmlString, "text/html");

        let body = doc.querySelector("body").innerHTML;

        let container = document.createElement("div");

        // Append the body content to the container
        container.innerHTML = body;

        let scripts = doc.querySelectorAll("script");
        // Loop through the scripts and append each one to the container
        for (let i = 0; i < scripts.length; i++) {
          if (scripts[i].src) {
            // This is an external script, create a new script element and set its src attribute
            let script = document.createElement("script");
            script.src = scripts[i].src;
            container.appendChild(script);
          } else {
            // This is an internal script, append it directly to the container
            let script = document.createElement("script");
            script.innerHTML = scripts[i].innerHTML;
            container.appendChild(script);
          }
        }

        let styles = doc.querySelectorAll("style, link[rel=stylesheet]");
        // Get the contents of the body
      
        // Loop through the styles and append each one to the container
        for (let i = 0; i < styles.length; i++) {
          if (styles[i].tagName === "LINK") {
            // This is an external style, create a new link element and set its href attribute
            let style = document.createElement("link");
            style.rel = "stylesheet";
            style.href = styles[i].href;
            container.appendChild(style);
          } else {
            // This is an internal style, append it directly to the container
            container.appendChild(styles[i].cloneNode(true));
          }
        }

        // Append the container to the body of the page
        document.body.appendChild(container);
      }

    document.addEventListener("DOMContentLoaded", function () {
       
        let submitButton = document.getElementById("submit_button");
        submitButton.addEventListener("click", function () {
            let promptInput = document.getElementById("prompt_input").value;
           
            let request = new XMLHttpRequest();
            request.open("POST", "/gpt3_request", true);
            request.setRequestHeader("Content-Type", "application/json");
            request.onload = function () {
                if (request.status >= 200 && request.status < 400) {
                    parseHTML(JSON.parse(request.response).message);
                }
            };
            request.send(JSON.stringify({ prompt: promptInput }));
        });
    });