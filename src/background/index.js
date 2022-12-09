import {CMD_ADD_TO_NOT_RU_LIST, CMD_ADD_TO_RU_LIST, CMD_TAB_UPDATE} from '../common/consts';
import {addToNotRuList, addToRuList} from '../commonBackground/db';


chrome.runtime.onMessage.addListener((message) => {
    switch (message.cmd) {
        case CMD_ADD_TO_RU_LIST:
            addToRuList(message?.data);
            break;
        case CMD_ADD_TO_NOT_RU_LIST:
            addToNotRuList(message?.data);
            break;
    }
});

// tabs.onUpdated not work because YouTube is SPA,
// different content scripts for different urls for same reason (need to update page to change script)
// popstate in content script not fires
chrome.webNavigation.onHistoryStateUpdated.addListener(async (details) => {
    // console.log('fskadjfkasldjfkasjdfkasjdkfjsdaf');
    if (!details.url.startsWith('https://www.youtube.com/')) return;
    chrome.tabs.sendMessage(details.tabId, {details, cmd: CMD_TAB_UPDATE})
        .catch(e => console.log(e));
});