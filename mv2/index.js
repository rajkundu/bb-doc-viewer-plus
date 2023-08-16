function getFilenameFromUri(uri) {
    return decodeURI(decodeURI(decodeURI(uri).split("%26").find((s) => s.includes("filename")).split('UTF-8').pop().split('%27%27').pop()));
}

function waitForElement(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

waitForElement('div.toolbar-end-container').then((parent) => {
    var btnSpan = document.createElement('span');
	btnSpan.innerHTML = `
	<a href="" target="bbdoc_${(new Date()).getTime()}"><button class="MuiButtonBaseroot-0-2-10 MuiIconButtonroot-0-2-1" tabindex="0" type="button" aria-label="Open in New Tab" title="Open in New Tab"><span class="MuiIconButtonlabel-0-2-9"><svg focusable="false" aria-hidden="true" role="presentation" viewBox="0 0 512 512" margin="5px">
	<!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
	<style>svg{fill:#ffffff}</style>
	<path d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z"></path>
	</svg>
	</span>
	</button>
	</a>
	`;
	parent.appendChild(btnSpan);

    // Change title of page to filename of document being viewed
    document.title = getFilenameFromUri(window.location.href);
});

let modalSelector = '.ms-Layer';
var modalOpen = false;
const modalObserver = new MutationObserver(mutations => {
    modalOpen = document.querySelectorAll(modalSelector).length > 0;
});
modalObserver.observe(document.body, {
    childList: true,
    subtree: true
});

// Esc = close topmost Blackboard pane
document.addEventListener('keydown', (event) => {
    // Esc pressed and no modals are currently open
    if (event.key === "Escape" && !modalOpen) {
        var closeButtons = [...document.querySelectorAll("button.bb-close")];
        if (closeButtons.length > 0){
            closeButtons.pop().click();
        }
    }
});

// Make files opened in new tab/window open in full view
if (window.location.href.includes('/file/') && window.history.length == 1){
    waitForElement('bb-file-preview iframe').then((iframe) => {
        console.log("REDIRECTING to " + iframe.src);
        window.location.assign(iframe.src);
    });
}
