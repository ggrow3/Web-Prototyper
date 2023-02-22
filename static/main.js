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
        document.getElementById("responseHtml").innerHTML = "<h2>Website Prototype</h2>";
        document.getElementById("responseHtml").appendChild(container);
    
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