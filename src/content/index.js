import {CMD_GET_CURRENT_TAB, CMD_TAB_UPDATE} from '../common/consts';
import {wait} from '../common/utils';
import {disconnectAllHome, handleHomePage} from './home';
import {disconnectAllWatch, handleWatchPage} from './watch';
import './promiseAll'
// TODO sometimes videos arent being analyzed
// TODO possibly handle hashtag pages

let isObservingShorts = false;

let prevUrl;
// setInterval(() => console.log(prevUrl), 100)
const handlePage = async (url, init) => {
    if (prevUrl === url) return
    console.log('url changed', 'prevUrl', prevUrl, 'newUrl', url);
    const pathname = new URL(url).pathname;
    if (pathname === '/') {
        if (!init) await wait(2000)
        console.log('handling watch page');
        disconnectAllHome()
        await handleHomePage();
    } else {
        console.log('home queue killed');
        disconnectAllHome()
    }
    if (pathname.startsWith('/watch') && url !== prevUrl) {
        console.log('handling watch page');
        disconnectAllWatch()
        await handleWatchPage()
    } else {
        console.log('watch queue killed',)
        disconnectAllWatch()
    }
    prevUrl = url
    // if (pathname.startsWith('/shorts') && !isObservingShorts && settings[SETTINGS_KEYS.blockOnShorts]) {
    //     isObservingShorts = true;
    //     await handleShortsPage();
    // }
};

// let prevUrl;
// TODO may have some problems with shorts (link changes on every short video scroll)

chrome.runtime.onMessage.addListener((message) => {
    switch (message.cmd) {
        case CMD_TAB_UPDATE:
            if (message?.details?.url) {
                handlePage(message.details.url, false)
                    .catch(e => console.log(e));
            }
            break;
    }
});

chrome.runtime.sendMessage({cmd: CMD_GET_CURRENT_TAB}, (tab) => {
    if (tab.url) {
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









