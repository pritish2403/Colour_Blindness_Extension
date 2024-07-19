// This part remains from your existing code to handle service worker lifecycle events.
self.addEventListener('install', (event) => {
    event.waitUntil(
        (async () => {
            console.log('Service Worker installed.');
        })()
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        (async () => {
            await self.clients.claim();
            console.log('Service Worker activated.');
        })()
    );
});

self.addEventListener('message', (event) => {
    console.log('Received message from content script or popup:', event.data);
    if (event.data === 'execute') {
        execute();
    }
});

function execute() {
    console.log('Executing background task.');
}

// Add this part to handle navigation events specifically for images
chrome.webNavigation.onCommitted.addListener(function(details) {
    if (details.frameId === 0 && /\.(jpg|jpeg|png|gif)$/i.test(details.url)) {
        chrome.scripting.executeScript({
            target: { tabId: details.tabId },
            files: ['jquery.min.js', 'js/ntc.js', 'colorblinding.js', 'colorDetector.js', 'popup.js']
        }).then(() => {
            console.log('Scripts injected successfully into image tab.');
        }).catch(err => {
            console.error('Failed to inject scripts:', err);
        });
    }
}, {url: [{urlMatches : 'https://*/*'}, {urlMatches : 'http://*/*'}]});
