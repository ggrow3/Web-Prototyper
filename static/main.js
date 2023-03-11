    function parseHTML(htmlString) {
       
        let parser = new DOMParser();

        let htmlFormatted = htmlString.replace(/\n/g, '');
        htmlFormatted = htmlFormatted.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
        let doc = parser.parseFromString(htmlFormatted, "text/html");

        let body = doc.querySelector("body").innerHTML;

        let container = document.createElement("div");

        container.innerHTML = body;

        let scripts = doc.querySelectorAll("script");
     
        for (let i = 0; i < scripts.length; i++) {
          if (scripts[i].src) {
            let script = document.createElement("script");
            script.src = scripts[i].src;
            container.appendChild(script);
          } else {
            let script = document.createElement("script");
            script.innerHTML = scripts[i].innerHTML;
            container.appendChild(script);
          }
        }

        let styles = doc.querySelectorAll("style, link[rel=stylesheet]");
       
        for (let i = 0; i < styles.length; i++) {
          if (styles[i].tagName === "LINK") {
            let style = document.createElement("link");
            style.rel = "stylesheet";
            style.href = styles[i].href;
            container.appendChild(style);
          } else {
            container.appendChild(styles[i].cloneNode(true));
          }
        }

        document.getElementById("prompt_output").value = htmlString;
    
    
      }

    document.addEventListener("DOMContentLoaded", function () {
       
        let submitButton = document.getElementById("submit_button");
        submitButton.addEventListener("click", function () {
            let promptInput = document.getElementById("prompt_input").value;
           document.getElementById("name").value = "";
            let request = new XMLHttpRequest();
            request.open("POST", "/gpt3_request", true);
            request.setRequestHeader("Content-Type", "application/json");
            html_area.value = promptInput;
            
            let loadingGif = document.createElement("img");
            loadingGif.src = "static/Loading_icon.gif";
            loadingGif.id = "loading-gif";

            let prompt_output = document.getElementById("prompt_output");
            prompt_output.parentNode.insertBefore(loadingGif, prompt_output.nextSibling);

          
            request.onload = function () {
                if (request.status >= 200 && request.status < 400) {
                    parseHTML(JSON.parse(request.response).message);
                }
                // Process form data here
               prompt_output.parentNode.removeChild(loadingGif);
            };
            request.send(JSON.stringify({ prompt: promptInput }));
        });
    });