import {CMD_GET_CURRENT_TAB, CMD_TAB_UPDATE} from '../common/consts';
import {wait} from '../common/utils';
import {disconnectAllHome, handleHomePage} from './home';
import {handleWatchPage} from './watch';
import './promiseAll'
// TODO sometimes videos arent being analyzed
// TODO possibly handle hashtag pages

let isObservingShorts = false;
// let isObservingHome = false;
let isObservingWatch = false;

const handlePage = async (url, init) => {
    console.log('url changed', url);
    const pathname = new URL(url).pathname;
    if (pathname === '/'/* && !isObservingHome*/) {
        if (!init) await wait(2000)
        disconnectAllHome()
        // isObservingHome = true;
        await handleHomePage();
    } else {
        console.log('queue killed');
        disconnectAllHome()
    }
    if (pathname.startsWith('/watch') && !isObservingWatch) {
        isObservingWatch = true
        console.log('handling watch page');
        await handleWatchPage()
    }
    // if (pathname.startsWith('/shorts') && !isObservingShorts && settings[SETTINGS_KEYS.blockOnShorts]) {
    //     isObservingShorts = true;
    //     await handleShortsPage();
    // }
};


// TODO may have some problems with shorts (link changes on every short video scroll)

let prevUrl;

chrome.runtime.onMessage.addListener((message) => {
    console.log('message', message);
    switch (message.cmd) {
        case CMD_TAB_UPDATE:
            if (message?.details?.url) {
                if (message.details.url === prevUrl) return
                prevUrl = message.details.url
                handlePage(message.details.url, false)
                    .catch(e => console.log(e));
            }
            break;
    }
});

chrome.runtime.sendMessage({cmd: CMD_GET_CURRENT_TAB}, (tab) => {
    if (tab.url) {
        prevUrl = tab.url
        console.log(prevUrl);
        handlePage(tab.url, true)
            .catch(e => console.log(e));
    }
});

// setInterval(() => {
//     const keydown = new KeyboardEvent('keydown', {key: 'ArrowDown', bubbles: true});
//     document.dispatchEvent(keydown);
//     document.body.scroll(0, 2000);
// }, 3000);

// const mutationMinInterval = 200;
// let lastMutation;
// let mutationWaiter;
// const observer = new MutationObserver((mutations) => {
//     clearTimeout(mutationWaiter)
//
//     console.log('BLAH', mutations);
// });
//
// console.log('FOOBAR');
// setTimeout(() => {
//     observer.observe(document.body.querySelector('#contents'), {childList: true})
// }, 4000)









