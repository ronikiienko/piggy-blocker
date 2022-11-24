import {SETTINGS_KEYS, SETTINGS_STORAGE_KEY, WHAT_TO_DO_MAP} from '../common/consts';
import {Queue} from '../common/queue';
import {getSettings} from '../utils/common/getSettings';
import {checkIsVideoDataRu} from '../utils/content/containsRussian';
import {applyFilter, removeFilter, wait, waitForNodeLoad} from '../utils/content/utils';
import {CLICKED_VIDEO_ITEM_CLASSNAME, SELECTOR} from './consts';
import {videoStore} from './videoStore';


// const blockVideoQueue = queue(async ({videoItem, settings}) => {
//     await blockVideoItem(videoItem, settings);
// }, 1);
const blockVideoQueue = new Queue(async ({videoItem, settings}) => {
    await blockVideoItem(videoItem, settings);
});

export const getQueueHome = () => {
    return blockVideoQueue.getQueue();
};

export const clearQueueHome = () => {
    blockVideoQueue.clear();
};

const openPopup = async (videoItem) => {
    console.log('opening popup', videoItem);
    try {
        await waitForNodeLoad('#details #button', videoItem);
    } catch (e) {
        console.log(e);
        return false;
    }
    const button = videoItem.querySelector('#details #button');
    if (!button) {
        await openPopup(videoItem);
        return false;
    }
    const clickEvent = new Event('click', {bubbles: false});
    button.dispatchEvent(clickEvent);
    return button;
};

const clickPopupOption = async (videoItem, actionItemMenuNumber, popupOpenButton) => {
    try {
        await waitForNodeLoad('tp-yt-iron-dropdown');
    } catch (e) {
        console.log(e);
        return;
    }
    let popup = document.querySelector('tp-yt-iron-dropdown');
    console.log('popup', popup);
    popup.style.opacity = 0;
    try {
        await waitForNodeLoad('ytd-menu-service-item-renderer', document);
    } catch (e) {
        console.log(e);
        return;
    }
    let menuItems = document.querySelectorAll('ytd-menu-service-item-renderer');
    const clickEvent = new Event('click', {bubbles: false});
    // let menuItemsInnerText = [];
    // for (const menuItem of menuItems) {
    //     menuItemsInnerText.push(menuItem.innerText);
    // }
    const prevScrollPosition = document.documentElement.scrollTop;
    if (menuItems.length <= actionItemMenuNumber) {
        // console.log('NOT CLICKINGGGGG', videoItem, menuItems.length, menuItems, menuItemsInnerText, prevScrollPosition);
        popupOpenButton.dispatchEvent(clickEvent);
        popup.style.opacity = 1;
        return;
    }
    menuItems[actionItemMenuNumber].dispatchEvent(clickEvent);
    popup.style.opacity = 1;
    // console.log('CLICKINGGGGGGG', videoItem, menuItems.length, menuItems, menuItemsInnerText, prevScrollPosition);
    wait(50).then(() => window.scrollTo(0, prevScrollPosition));
    // popupOpenButton.dispatchEvent(clickEvent)
};
//  TODO channel name in shorts is huge with /n /n /n /n /n
const blockVideoItem = async (videoItem, settings) => {
    if (videoItem.classList.contains('ytd-rich-shelf-renderer')) return;
    const whatToDo = settings?.[SETTINGS_KEYS.whatToDo];
    if (whatToDo === WHAT_TO_DO_MAP.blur || !whatToDo) {
        return;
    }
    if (videoItem.classList.contains(CLICKED_VIDEO_ITEM_CLASSNAME)) {
        console.log('element checked');
        return;
    }
    // sometimes when popup is being closed and immediately opened there can be many elements,
    // so possibly need timeout here, but this thing is mostly when not authorized, and i dont launch this function in such instance
    // await wait(300)
    let actionItemMenuNumber;
    if (whatToDo === WHAT_TO_DO_MAP.notInterested) actionItemMenuNumber = 4;
    if (whatToDo === WHAT_TO_DO_MAP.blockChannel) actionItemMenuNumber = 5;
    if (!actionItemMenuNumber) return;
    const popupOpenButton = await openPopup(videoItem);
    if (!popupOpenButton) return;
    await clickPopupOption(videoItem, actionItemMenuNumber, popupOpenButton);
    videoItem.classList.add(CLICKED_VIDEO_ITEM_CLASSNAME);
};

const checkVideoItem = async (videoItem) => {
    // TODO return false if 'dismissed' video
    if (!videoItem) return false;
    if (getComputedStyle(videoItem).display === 'none') return false;
    let videoTitle;
    let videoLink;
    let videoId;
    if (videoItem.classList.contains('ytd-rich-shelf-renderer')) {
        videoTitle = videoItem.querySelector('#video-title');
        if (!videoTitle) return false;
        videoLink = videoTitle.parentElement.parentElement.href;
        videoId = videoLink?.split('/shorts/')[1];
    } else {
        videoTitle = videoItem.querySelector('#video-title-link');
        if (!videoTitle) return false;
        videoLink = videoTitle?.href;
        videoId = videoLink?.split('watch?v=')[1];
    }
    // console.log('video handled');
    if (videoId) {
        const storeCheck = videoStore.check(videoId);
        if (storeCheck !== null) {
            // console.log('useful at all')
            return storeCheck;
        }
    }
    // console.log('not useful at all');
    const titleText = videoTitle.innerText;
    if (!titleText) return false;
    const channelNameNode = videoItem.querySelector('#channel-name');
    const checkResult = await checkIsVideoDataRu(titleText, channelNameNode?.innerText);
    if (videoId) videoStore.addVideo(videoId, checkResult);
    return checkResult;
};


const handleVideos = async (container, settings, isAuthorized) => {
    let whatToDo = settings[SETTINGS_KEYS.whatToDo];
    if (whatToDo === WHAT_TO_DO_MAP.blur) {
        clearQueueHome();
        console.log('options changed', getQueueHome());
    }
    // console.log('not ru: ', videoStore.getNotRu(), 'ru: ', videoStore.getRu());
    // TODO maby change to more efficient selector
    const videoItems = container.getElementsByTagName('ytd-rich-item-renderer');
    let handled = 0;
    for (const videoItem of videoItems) {
        if (!settings[SETTINGS_KEYS.blockOnHome]) {
            removeFilter(videoItem);
            continue;
        }
        checkVideoItem(videoItem)
            .then(isRu => {
                if (isRu) {
                    applyFilter(videoItem, 'home', settings);
                    if (isAuthorized && whatToDo !== WHAT_TO_DO_MAP.blur) blockVideoQueue.push({videoItem, settings});
                } else {
                    removeFilter(videoItem);
                }
            })
            .catch(e => console.log(e));
        handled++;
        // if (handled === 4) break;
    }
};
// TODO when resizing screen everything breaks
export const handleHomePage = async () => {
    try {
        await waitForNodeLoad(SELECTOR.CONTAINER_HOME);
        await waitForNodeLoad(SELECTOR.IS_AUTH_BUTTONS + ' #button');
    } catch (e) {
        console.log(e);
        return;
    }
    const isAuthButtonsContainer = document.body.querySelector('#masthead-container #buttons');
    const authButtonsNumber = isAuthButtonsContainer.children.length;
    const isAuthorized = authButtonsNumber === 3;
    const videoItemsContainer = document.querySelector(SELECTOR.CONTAINER_HOME);
    let settings = await getSettings();
    await handleVideos(videoItemsContainer, settings, isAuthorized);
    chrome.storage.onChanged.addListener(async (changes, areaName) => {
        if (changes[SETTINGS_STORAGE_KEY] && areaName === 'sync') {
            const newSettings = await getSettings();
            if (!newSettings) return;
            await handleVideos(videoItemsContainer, newSettings, isAuthorized);
            settings = newSettings;
        }
    });
    let timeout;
    const videoItemsObserver = new MutationObserver(async function (mutations) {
        console.log('mutation!!!!!!!!!!!!!!1');
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            console.log('new block queue', getQueueHome());
            handleVideos(videoItemsContainer, settings, isAuthorized);
        }, 400);
    });
    videoItemsObserver.observe(videoItemsContainer, {childList: true});
};