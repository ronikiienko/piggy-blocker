import {CMD_GET_CURRENT_TAB} from '../common/consts';


console.log('background script');


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.cmd) {
        case CMD_GET_CURRENT_TAB:
            chrome.tabs.query({active: true, currentWindow: true})
                .then(tab => {
                    console.log(tab[0]);
                    sendResponse(tab[0]);
                })
                .catch(() => sendResponse(null))
            return true
    }
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    console.log(tabId);
    console.log(changeInfo);
    console.log(tab);
})
