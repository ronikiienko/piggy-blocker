import {
    BLOCK_REASONS_MAP,
    CHECKED_VIDEOS_DB_KEYS,
    SELECTOR,
    SETTINGS_KEYS,
    SETTINGS_STORAGE_KEY,
    WHAT_TO_DO_MAP,
} from '../common/consts';
import {getSettings} from '../common/getSettings';
import {Queue} from '../common/queue';
import {wait} from '../common/utils';
import {checkIsVideoDataRu} from './containsRussian';
import {addToCheckedVideosDb} from './containsRussianStats';
import {applyFilter, removeFilter, waitForNodeLoad} from './utils';
import {clickedStore} from './videoStore';


// const blockVideoQueue = queue(async ({videoItem, settings}) => {
//     await blockVideoItem(videoItem, settings);
// }, 1);
const blockVideoQueue = new Queue(async ({videoItem, settings, videoId}) => {
    await blockVideoItem(videoItem, settings, videoId);
});

// blockVideoQueue.onQueueEmpty((asdfasdf) => {
//
// })
//
// blockVideoQueue.on('finish', () => {
//
// })

export const getQueueHome = () => {
    return blockVideoQueue.getQueue();
};

let videoItemsObserver;

export const disconnectAllHome = () => {
    videoItemsObserver?.disconnect();
    blockVideoQueue.clear();
    clickedStore.clear();
};

const openPopup = async (videoItem) => {
    if (!videoItem) {
        console.log('no video item provided, could not open popup');
        return false;
    }
    try {
        await waitForNodeLoad('#details #button', videoItem);
    } catch (e) {
        console.log(e);
        return false;
    }
    const button = videoItem.querySelector('#details #button');
    const clickEvent = new Event('click', {bubbles: false});
    button.dispatchEvent(clickEvent);
    return button;
};

const clickPopupOption = async (videoItem, actionItemMenuNumber, popupOpenButton) => {
    if (!videoItem || !actionItemMenuNumber || !popupOpenButton) {
        console.log('could not click popup option');
        return;
    }
    try {
        await waitForNodeLoad('tp-yt-iron-dropdown');
    } catch (e) {
        console.log(e);
        return;
    }
    let popup = document.querySelector('tp-yt-iron-dropdown');
    if (!popup) {
        console.log('could not click popup option (could not find popup)');
        return;
    }
    popup.style.opacity = 0;
    try {
        // for some reason when return from other page, searching inside popup not work, so i search in document
        await waitForNodeLoad('ytd-menu-service-item-renderer', document);
    } catch (e) {
        console.log(e);
        return;
    }
    let menuItems = document.querySelectorAll('ytd-menu-service-item-renderer');
    // console.log('blocking.....', videoItem, menuItems.length);

    const clickEvent = new Event('click', {bubbles: false});
    // let menuItemsInnerText = [];
    // for (const menuItem of menuItems) {
    //     menuItemsInnerText.push(menuItem.innerText);
    // }
    const prevScrollPosition = document.documentElement.scrollTop;
    if (menuItems?.length <= actionItemMenuNumber) {
        // console.log('NOT CLICKINGGGGG', videoItem, menuItems.length, menuItems, menuItemsInnerText, prevScrollPosition);
        popupOpenButton.dispatchEvent(clickEvent);
        popup.style.opacity = 1;
        return;
    }
    menuItems[actionItemMenuNumber].dispatchEvent(clickEvent);
    popup.style.opacity = 1;
    // console.log('CLICKINGGGGGGG', videoItem, menuItems.length, menuItems, menuItemsInnerText, prevScrollPosition);
    wait(50).then(() => window.scrollTo(0, prevScrollPosition));
};
//  TODO channel name in shorts is huge with /n /n /n /n /n
const blockVideoItem = async (videoItem, settings, videoId) => {
    if (!videoItem || !settings || !videoId) {
        console.log('could not block video item');
        return;
    }
    if (videoItem.classList.contains('ytd-rich-shelf-renderer')) return;
    const whatToDo = settings?.[SETTINGS_KEYS.whatToDo];
    if (whatToDo === WHAT_TO_DO_MAP.blur || !whatToDo) {
        return;
    }
    if (!videoId) {
        console.log('no video id');
        return;
    }
    if (clickedStore.check(videoId)) {
        // console.log('element checked');
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
    clickedStore.add(videoId);
};

const checkVideoItem = async (videoItem) => {
    if (!videoItem) {
        console.log('no video item', videoItem);
        return false;
    }
    if (getComputedStyle(videoItem).display === 'none') {
        // console.log('video item display is none', videoItem);
        return false;
    }
    let titleNode;
    let videoLink;
    let videoId;
    let channelNameNode;
    let channelName;
    if (videoItem.classList.contains('ytd-rich-shelf-renderer')) {
        titleNode = videoItem.querySelector('#video-title');
        if (!titleNode) return false;
        channelName = null;
        videoLink = titleNode?.parentElement?.parentElement?.href;
        videoId = videoLink?.split('/shorts/')[1];
    } else {
        titleNode = videoItem.querySelector('#video-title-link');
        if (!titleNode) return false;
        channelNameNode = videoItem.querySelector('#channel-name');
        channelName = channelNameNode?.innerText;
        if (!channelName) {
            console.warn('could not get chanel name');
            return false;
        }
        videoLink = titleNode?.href;
        videoId = videoLink?.split('watch?v=')[1];
    }
    const titleText = titleNode?.innerText;
    if (!titleText || !videoLink || !videoId/* || !channelName*/) {
        console.warn('could not get video data', videoItem, {titleNode, channelName, videoLink, videoId});
        return false;
    }
    const checkResult = await checkIsVideoDataRu(titleText, channelName, videoId);
    if (checkResult?.reason && checkResult?.reason !== BLOCK_REASONS_MAP.inSessStorage && videoId) {
        addToCheckedVideosDb({
            [CHECKED_VIDEOS_DB_KEYS.isRu]: checkResult.isRu * 1,
            [CHECKED_VIDEOS_DB_KEYS.ytId]: videoId || null,
            [CHECKED_VIDEOS_DB_KEYS.title]: titleText || null,
            [CHECKED_VIDEOS_DB_KEYS.channelName]: channelName || null,
            [CHECKED_VIDEOS_DB_KEYS.link]: videoLink || null,
            [CHECKED_VIDEOS_DB_KEYS.reason]: checkResult.reason || null,
            [CHECKED_VIDEOS_DB_KEYS.reasonDetails]: checkResult.reasonDetails || null,
            [CHECKED_VIDEOS_DB_KEYS.timeWhenBlocked]: Date.now() || null,
        });
    }
    return {isRu: checkResult.isRu, id: videoId, title: titleText, link: videoLink};
};

/**
 *
 * @param container {HTMLElement}
 * @param settings {Object} User settings
 * @param isAuthorized {boolean} When not authorized, items won't be blocked
 * @returns {Promise<void>}
 */

const handleVideos = async (container, settings, isAuthorized) => {
    let whatToDo = settings[SETTINGS_KEYS.whatToDo];
    const videoItems = container.getElementsByTagName('ytd-rich-item-renderer');
    if (!videoItems || !whatToDo) {
        console.log('could not handle videos', container);
    }
    for (const videoItem of videoItems) {
        if (!settings[SETTINGS_KEYS.blockOnHome]) {
            removeFilter(videoItem);
            continue;
        }
        checkVideoItem(videoItem)
            .then(result => {
                if (result.isRu) {
                    applyFilter(videoItem, 'home', settings);
                    if (isAuthorized && whatToDo !== WHAT_TO_DO_MAP.blur) blockVideoQueue.push({
                        videoItem,
                        settings,
                        videoId: result.id,
                    });
                } else {
                    removeFilter(videoItem);
                }
            })
            .catch(e => console.log(e));
    }
};
export const handleHomePage = async () => {
    // console.log('handling home page');
    try {
        await waitForNodeLoad(SELECTOR.CONTAINER_HOME);
        await waitForNodeLoad('#masthead-container #buttons' + ' #button');
    } catch (e) {
        console.log(e);
        return;
    }
    const isAuthButtonsContainer = document.body.querySelector('#masthead-container #buttons');
    const authButtonsNumber = isAuthButtonsContainer.children.length;
    const isAuthorized = authButtonsNumber === 3;
    const videoItemsContainer = document.querySelector(SELECTOR.CONTAINER_HOME);
    let settings = await getSettings();
    if (!settings || !videoItemsContainer || !authButtonsNumber || !isAuthButtonsContainer || !isAuthorized) {
        console.log('could not handle home page');
        return;
    }
    await handleVideos(videoItemsContainer, settings, isAuthorized);
    chrome.storage.onChanged.addListener(async (changes) => {
        if (changes[SETTINGS_STORAGE_KEY]) {
            blockVideoQueue.clear();
            const newSettings = await getSettings();
            if (!newSettings) return;
            await handleVideos(videoItemsContainer, newSettings, isAuthorized);
            settings = newSettings;
        }
    });
    let timeout;
    videoItemsObserver = new MutationObserver(async function (mutations) {
        // console.log('mutation!!!!!!!!!!!!!!1');
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            handleVideos(videoItemsContainer, settings, isAuthorized);
        }, 400);
    });
    videoItemsObserver.observe(videoItemsContainer, {childList: true});
};