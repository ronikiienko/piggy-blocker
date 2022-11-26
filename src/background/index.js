import {CMD_ADD_TO_STATS, CMD_GET_CURRENT_TAB, CMD_GET_STATS, CMD_TAB_UPDATE} from '../common/consts';
import {addToStats, getStats} from '../commonBackground/db';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.cmd) {
        case CMD_GET_CURRENT_TAB:
            chrome.tabs.query({active: true, currentWindow: true})
                .then(tabs => sendResponse(tabs[0]))
                .catch(e => console.log(e));
            break;
        case CMD_ADD_TO_STATS:
            addToStats(message?.data)
            break;
        case CMD_GET_STATS:
            getStats(message?.reason)
            break;
    }
    return true;
});

// tabs.onUpdated not work because YouTube is SPA,
// different content scripts for different urls for same reason (need to update page to change script)
// popstate in content script not fires
chrome.webNavigation.onHistoryStateUpdated.addListener(async (details) => {
    if (!details.url.startsWith('https://www.youtube.com/')) return;
    chrome.tabs.sendMessage(details.tabId, {details, cmd: CMD_TAB_UPDATE})
        .catch(e => console.log(e));
});