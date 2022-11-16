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

let prevPathname;
const checkIfPageChanged = (pathname) => {
    // console.log('prev:', prevPathname, 'current:', pathname);
    if (!prevPathname) return true;
    // shorts have id like /shorts/id which changes on every scrolled video
    if (pathname.startsWith('/shorts')) {
        if (prevPathname.startsWith('/shorts') && pathname.startsWith('/shorts')) return false;
    }
    if (prevPathname === '/' || pathname === '/') return prevPathname !== pathname
    if (prevPathname.startsWith(pathname) || pathname.startsWith(prevPathname)) return false;

    return true;
};
const handlePage = async (url) => {
    const pathname = new URL(url).pathname;
    if (!checkIfPageChanged(pathname)) return;
    prevPathname = pathname;
    const settings = await getSettings()
    if (pathname === '/' && !isObservingHome && settings[SETTINGS_KEYS.blockOnHome]) {
        isObservingHome = true;
        await handleHomePage();
    }
    if (pathname.startsWith('/shorts') && !isObservingShorts && settings[SETTINGS_KEYS.blockOnShorts]) {
        isObservingShorts = true;
        await handleShortsPage();
    }
    if (pathname.startsWith('/watch') && !isObservingWatch && settings[SETTINGS_KEYS.blockOnWatch]) {
        isObservingWatch = true
        await handleWatchPage()
    }
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









