import {CMD_GET_CURRENT_TAB} from '../common/consts';
import {checkIsVideoDataRu} from '../utils/containsRussian';
import {CHECKED_VIDEO_ITEM_CLASSNAME} from './consts';
import {handleHomePage} from './home';



// TODO possibly handle hashtag pages

let prevUrl;
const checkIfPageChanged = (url) => {

}
const handlePage = async (url) => {
    const pathname = new URL(url).pathname
    checkIfPageChanged(url)
    if (pathname === '/') {
        await handleHomePage()
    }
    if (pathname.startsWith('/shorts')) {
        console.log('shorts page');
    }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message?.url) {
        handlePage(message.url)
            .catch(e => console.log(e))
    }
});

chrome.runtime.sendMessage({cmd: CMD_GET_CURRENT_TAB}, (tab) => {
    if (tab.url) {
        handlePage(tab.url)
            .catch(e => console.log(e))
    }
})









