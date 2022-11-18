import {CMD_GET_CURRENT_TAB, SETTINGS_KEYS} from '../common/consts';
import {getSettings} from '../utils/common/getSettings';
import {handleHomePage} from './home';
import {handleShortsPage} from './shorts';
import {handleWatchPage} from './watch';

// TODO sometimes videos arent being analyzed
// TODO possibly handle hashtag pages

let isObservingShorts = false;
let isObservingHome = false;
let isObservingWatch = false;

const handlePage = async (url) => {
    const pathname = new URL(url).pathname;
    const settings = await getSettings()
    if (pathname === '/' && !isObservingHome && settings[SETTINGS_KEYS.blockOnHome]) {
        isObservingHome = true;
        console.log('handling home page');
        await handleHomePage();
    }
    if (pathname.startsWith('/watch') && !isObservingWatch && settings[SETTINGS_KEYS.blockOnWatch]) {
        isObservingWatch = true
        console.log('handling watch page');
        await handleWatchPage()
    }
    // if (pathname.startsWith('/shorts') && !isObservingShorts && settings[SETTINGS_KEYS.blockOnShorts]) {
    //     isObservingShorts = true;
    //     await handleShortsPage();
    // }
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message?.url) {
        handlePage(message.url)
            .catch(e => console.log(e));
    }
});

chrome.runtime.sendMessage({cmd: CMD_GET_CURRENT_TAB}, (tab) => {
    if (tab.url) {
        handlePage(tab.url)
            .catch(e => console.log(e));
    }
});

// setInterval(() => {
//     const keydown = new KeyboardEvent('keydown', {key: 'ArrowDown', bubbles: true});
//     document.dispatchEvent(keydown);
//     document.body.scroll(0, 2000);
// }, 3000);

const mutationMinInterval = 200;
let lastMutation;
let mutationWaiter;
const observer = new MutationObserver((mutations) => {
    clearTimeout(mutationWaiter)

    console.log('BLAH', mutations);
});

console.log('FOOBAR');
setTimeout(() => {
    observer.observe(document.body.querySelector('#contents'), {childList: true})
}, 4000)









