import {
    CMD_ADD_NOT_RU_TO_STATS,
    CMD_ADD_TO_BLOCKED_STATS, CMD_ADD_TO_NOT_RU_LIST, CMD_ADD_TO_RU_LIST,
    CMD_GET_CURRENT_TAB,
    CMD_TAB_UPDATE,
} from '../common/consts';
import {addToNotRuList, addToRuList, addToStats} from '../commonBackground/db';


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.cmd) {
        case CMD_GET_CURRENT_TAB:
            chrome.tabs.query({active: true, currentWindow: true})
                .then(tabs => sendResponse(tabs[0]))
                .catch(e => console.log(e));
            break;
        case CMD_ADD_TO_BLOCKED_STATS:
            addToStats(message?.data)
            break;
        case CMD_ADD_TO_RU_LIST:
            addToRuList(message.id)
            break;
        case CMD_ADD_TO_NOT_RU_LIST:
            addToNotRuList(message.id)
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