import {CMD_GET_CURRENT_TAB} from '../common/consts';


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.cmd) {
        case CMD_GET_CURRENT_TAB:
            chrome.tabs.query({active: true, currentWindow: true})
                .then(tabs => sendResponse(tabs[0]))
                .catch(e => console.log(e));
    }
    return true;
});


// tabs.onUpdated not work because YouTube is SPA,
// different content scripts for different urls for same reason (need to update page to change script)
// popstate in content script not fires

chrome.webNavigation.onHistoryStateUpdated.addListener(async (details) => {
    if (!details.url.includes('https://www.youtube.com/')) return
    chrome.tabs.sendMessage(details.tabId, details)
        .catch(e => console.log(e));
});