window.addEventListener("load", async () => {
    const body = document.querySelector('body');
    const html = document.querySelector('html');

    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '40vh';
    iframe.style.position = 'fixed';
    iframe.style.bottom = '0';
    iframe.style.left = '0';
    iframe.style.right = '0';
    iframe.style.zIndex = '9999';
    iframe.style.border = 'none';
    iframe.style.transition = 'height 0.3s';
    iframe.style.display = 'none';

    iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-top-navigation');

    html.appendChild(iframe);


    async function injectScriptIntoParent (script) {
        const scriptElement = document.createElement('script');
        scriptElement.src = script;
        document.body.appendChild(scriptElement);
    };
    await injectScriptIntoParent("https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js");

    const toggleBtn = document.createElement('button');
    toggleBtn.style.position = 'fixed';
    toggleBtn.style.bottom = '10px';
    toggleBtn.style.right = '10px';
    toggleBtn.style.zIndex = '9999';
    toggleBtn.style.padding = '10px';
    toggleBtn.style.border = 'none';
    toggleBtn.style.backgroundColor = '#333';
    toggleBtn.style.borderRadius = '8px';
    toggleBtn.style.fontSize = '1.5rem';
    toggleBtn.style.height = '40px';
    toggleBtn.style.width = '40px';
    toggleBtn.style.display = 'flex';   
    toggleBtn.style.alignItems = 'center';
    toggleBtn.style.justifyContent = 'center';
    toggleBtn.style.color = '#fff';
    toggleBtn.style.cursor = 'pointer';
    toggleBtn.style.transition = 'background-color 0.3s';
    toggleBtn.innerHTML = '<ion-icon name="bug-outline"></ion-icon>';
    toggleBtn.addEventListener('click', () => {
        iframe.style.display = iframe.style.display === 'none' ? 'block' : 'none';
        toggleBtn.style.backgroundColor = iframe.style.display === 'none' ? '#333' : '#555';
        html.style.height = iframe.style.display === 'none' ? '100vh' : '60vh';
        html.style.overflow = iframe.style.display === 'none' ? 'hidden' : 'auto';
        body.style.height = iframe.style.display === 'none' ? '100vh' : '60vh';
        body.style.overflow = iframe.style.display === 'none' ? 'hidden' : 'auto';
    });

    html.appendChild(toggleBtn);

    const iframeContent = iframe.contentDocument;

    iframeContent.head.innerHTML = `
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <link rel="preconnect" href="https://rsms.me/" />
    <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />

    <style>
      :root {
        font-family: Inter, sans-serif;
        font-feature-settings: "liga" 1, "calt" 1; /* fix for Chrome */
      }
      @supports (font-variation-settings: normal) {
        :root {
          font-family: InterVariable, sans-serif;
        }
      }
    </style>

    <link
      rel="stylesheet"
      href="https://unpkg.com/franken-ui/dist/css/core.min.css"
    />
    <script>
      const htmlElement = document.documentElement;
      htmlElement.classList.add("dark");
      htmlElement.classList.add("uk-theme-zinc");
    </script>
    
    <link rel="stylesheet" href="https://raw.githubusercontent.com/CoolCoderSJ/portable-console/refs/heads/main/highlight.css">
    `;

    iframeContent.body.innerHTML = `
    <ul class="uk-tab-alt" style="cursor: pointer; border-radius: 0; position: sticky; top: 0; z-index: 999" uk-tab>
        <li class="uk-active" id="consoleTab"><a>Console</a></li>
    </ul>

    <div id="tabContent">
        <div id="elementsContainer" style="display: none;" class="uk-container uk-container-small uk-margin-top"></div>
        <div id="logContainer" class="uk-container uk-container-small uk-margin-top">
        </div>
        <div class="uk-container uk-container-small uk-margin-top my-8" style="display: flex; gap: 6px;">
            <input
                class="uk-input"
                type="text"
                placeholder="JS expression to evaluate..."
            />
            <button class="uk-button uk-button-default" id="evalBtn"><ion-icon name="send"></ion-icon></button>
        </div>
    </div>
    `;

    async function loadScript(src) {
        return new Promise((resolve) => {
            const script = iframeContent.createElement("script");
            script.src = src;
            script.onload = resolve;
            iframeContent.head.appendChild(script);
        });
    }

    // Load all scripts in order
    await loadScript("https://cdn.tailwindcss.com");
    await loadScript("https://unpkg.com/franken-ui/dist/js/core.iife.js");
    await loadScript("https://unpkg.com/@highlightjs/cdn-assets@11.9.0/highlight.min.js");
    await loadScript("https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js");

    const htmlElement = iframeContent.documentElement;
    htmlElement.classList.add('dark');
    htmlElement.classList.add('uk-theme-zinc');

    const iframeBody = iframeContent.body;
    iframeBody.classList.add("bg-background");
    iframeBody.classList.add("text-foreground");


    const logContainer = iframeContent.getElementById('logContainer');
    
    function isDOMElement(obj) {
        if (!obj) return false;
        return obj.nodeType === 1;
    }


    function formatDOMElement(element, depth = 0) {
        originalConsole.log(element.childElementCount);
        try {
            if (element.children.length > 0) {
                let attrsList = [];
                for (const attr of element.attributes) {
                    attrsList.push(`<span class="text-blue-200">${attr.name}</span>=<span class="text-orange-400">"${attr.value}"</span>`);
                }
                attrsList = attrsList.join(' ');
                formattedString += `${'  '.repeat(depth)}<span class="text-blue-400">&lt;${element.tagName.toLowerCase()} ${attrsList}</span>&gt;\n`;
                for (let i = 0; i < element.children.length; i++) {
                    formattedString += formatDOMElement(element.children[i], depth + 1);
                }
                formattedString += `${'  '.repeat(depth)}<span class="text-blue-400">&lt;/${element.tagName.toLowerCase()}&gt;</span>\n`;
                return formattedString;
            }
            else {
                let attrsList = [];
                for (const attr of element.attributes) {
                    attrsList.push(`<span class="text-blue-200">${attr.name}</span>=<span class="text-orange-400">"${attr.value}"</span>`);
                }
                attrsList = attrsList.join(' ');
                formattedString += `${'  '.repeat(depth)}<span class="text-blue-400">&lt;${element.tagName.toLowerCase()} ${attrsList}</span>&gt;`;
                formattedString += `<span class="text-blue-400">${element.textContent}</span>`;
                formattedString += `<span class="text-blue-400">&lt;/${element.tagName.toLowerCase()}&gt;</span>\n`;
                return formattedString;
            }
        } catch (e) {
            originalConsole.error(e);
            return '[DOM Element]';
        }
    }

    function createLogEntry(type, args) {
        const div = iframeContent.createElement('div');
        div.className = `uk-card uk-card-default uk-card-body uk-margin-small py-[10px] ${
            type === 'error' ? 'bg-red-950 text-red-200' : 
            type === 'warn' ? 'bg-amber-950 text-amber-200' :
            'bg-zinc-800 text-gray-200'
        }`;

        const formattedArgs = args.map(arg => {
            if (isDOMElement(arg)) {
                return formatDOMElement(arg);
            } else if (typeof arg === 'object') {
                try {
                    return JSON.stringify(arg, (key, value) => {
                        if (isDOMElement(value)) return `[DOM Element ${value.tagName?.toLowerCase() || ''}]`;
                        return value;
                    }, 2);
                } catch (e) {
                    return String(arg);
                }
            }
            return String(arg);
        });


        div.innerHTML = `<pre class="uk-text-small">[${type.charAt(0).toUpperCase() + type.slice(1)}] ${isDOMElement(args[0]) || typeof args[0] === "object" ? `<br />` : ""}<code class="${isDOMElement(args[0]) || typeof args[0] === "object" ? `` : "no-highlight"}">${formattedArgs.join(' ')}</code></pre>`;
        logContainer.appendChild(div);
        frames[0].window.eval(`document.readyState === "complete" ? hljs.highlightAll() : window.addEventListener("load", () => hljs.highlightAll())`);
        iframeContent.body.scrollTop = iframeContent.body.scrollHeight;
    }

    // Hook console methods
    const originalConsole = {
        log: console.log,
        error: console.error,
        warn: console.warn
    };

    ['log', 'error', 'warn'].forEach(method => {
        window.console[method] = (...args) => {
            originalConsole[method].apply(console, args);
            createLogEntry(method, args);
        };
    });

    window.addEventListener('error', (event) => {
        createLogEntry('error', [event.error.stack]);
    })

    window.addEventListener('unhandledrejection', (event) => {
        createLogEntry('error', [event.reason.stack]);
    })

    // console.log("test log");
    // console.warn("test warn");
    // console.error("test error");

    // const elementsTab = iframeContent.getElementById('elementsTab');
    // const consoleTab = iframeContent.getElementById('consoleTab');
    // console.log(logContainer)

    // consoleTab.addEventListener('click', () => {
    //     elementsTab.classList.remove('uk-active');
    //     consoleTab.classList.add('uk-active');
    //     iframeContent.getElementById('elementsContainer').style.display = 'none';
    //     iframeContent.getElementById('logContainer').style.display = 'block';
    // });

    // elementsTab.addEventListener('click', () => {
    //     console.log('elementsTab clicked');
    //     consoleTab.classList.remove('uk-active');
    //     elementsTab.classList.add('uk-active');
    //     iframeContent.getElementById('logContainer').style.display = 'none';
    //     iframeContent.getElementById('elementsContainer').style.display = 'block';
    // });

    const evalBtn = iframeContent.getElementById('evalBtn');
    const input = iframeContent.querySelector('input');

    const evalInput = () => {
        const div = iframeContent.createElement('div');
        div.className = `uk-card uk-card-default uk-card-body uk-margin-small py-[10px] bg-zinc-800 text-gray-200`;
        div.innerHTML = `<pre class="uk-text-small">[INPUT] ${input.value}</pre>`;
        logContainer.appendChild(div);

        try {
            let result = eval(input.value);
            result ? console.log(result) : null;
        }
        catch (e) {
            console.error(e.stack);
        }
        input.value = '';
    }

    evalBtn.addEventListener('click', () => evalInput());

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            evalInput();
        }
    });

});