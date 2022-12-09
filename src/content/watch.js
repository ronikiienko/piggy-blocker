import {
    BLOCK_REASONS_MAP,
    SETTINGS_KEYS,
    SETTINGS_STORAGE_KEY,
    VIDEOS_DB_KEYS,
    WHAT_TO_DO_MAP,
} from '../common/consts';
import {getSettings} from '../common/getSettings';
import {Queue} from '../common/queue';
import {wait} from '../common/utils';
import {checkIsVideoDataRu} from './containsRussian';
import {addToDb} from './containsRussianStats';
import {applyFilter, removeFilter, waitForNodeLoad} from './utils';
import {clickedStore} from './videoStore';

const blockVideoQueue = new Queue(async ({videoItem, settings, videoId}) => {
    await blockVideoItem(videoItem, settings, videoId);
});
// TODO ekkekekekekek
// let scrollPosition = null;
// blockVideoQueue.onQueueStart(() => {
//     document.body.style.overflow = 'hidden'
//     if (!scrollPosition) scrollPosition = document.documentElement.scrollTop;
// })
// let scrollTimeout;
// blockVideoQueue.onQueueFinish(() => {
//     clearTimeout(scrollTimeout);
//     scrollTimeout = setTimeout(() => {
//         document.body.style.overflow = 'auto'
//         window.scrollTo(0, scrollPosition)
//     }, 2000);
// })


let videoItemsObserver;
export const disconnectAllWatch = () => {
    // console.log('disconnecting from watch')
    videoItemsObserver?.disconnect();
    blockVideoQueue.clear();
    clickedStore.clear();
};
const openPopup = async (videoItem) => {
    try {
        await waitForNodeLoad('#menu #button', videoItem);
    } catch (e) {
        console.log(e);
        return false;
    }
    const button = videoItem.querySelector('#menu #button');
    const clickEvent = new Event('click', {bubbles: false});
    button.dispatchEvent(clickEvent);
    return button
};

const clickPopupOption = async (videoItem, actionItemMenuNumber, popupOpenButton) => {
    if (!videoItem || !actionItemMenuNumber || !popupOpenButton) {
        console.log('could not click popup option');
        return
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
        return
    }
    popup.style.opacity = 0;
    try {
        await waitForNodeLoad('ytd-menu-service-item-renderer', document);
    } catch (e) {
        console.log(e);
        return;
    }
    let menuItems = document.querySelectorAll('ytd-menu-service-item-renderer');

    // console.log('blocking.....', videoItem, menuItems.length, 'listeners:');
    const clickEvent = new Event('click', {bubbles: false});
    if (menuItems?.length <= actionItemMenuNumber) {
        popupOpenButton.dispatchEvent(clickEvent);
        popup.style.opacity = 1;
        return;
    }
    const prevScrollPosition = document.documentElement.scrollTop;

    const container = document.body

    container.style.overflow = 'hidden'
    // container.style.position = 'fixed'
    menuItems[actionItemMenuNumber].dispatchEvent(clickEvent);
    container.style.overflow = 'auto'
    // container.style.position = 'static'

    popup.style.opacity = 1;
    wait(50).then(() => window.scrollTo(0, prevScrollPosition));
    // window.scrollTo(0, prevScrollPosition)
};

const blockVideoItem = async (videoItem, settings, videoId) => {
    if (!videoItem || !settings || !videoId) {
        console.log('could not block video item');
        return
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
        // console.log('element clicked');
        return;
    }
    let actionItemMenuNumber;
    if (whatToDo === WHAT_TO_DO_MAP.notInterested) actionItemMenuNumber = 3;
    if (whatToDo === WHAT_TO_DO_MAP.blockChannel) actionItemMenuNumber = 4;
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
    };
    if (getComputedStyle(videoItem).display === 'none') {
        // console.log('video item display is none', videoItem);
        return false;
    };
    let videoTitle;
    let channelName;
    let videoLink;
    let videoId;
    const titleNode = videoItem.querySelector('h3 > span');
    const channelNameNode = videoItem.querySelector('#metadata #text-container')
    const videoLinkNode = videoItem.querySelector('a:has(> h3)')
    channelName = channelNameNode?.innerText
    videoTitle = titleNode?.innerText;
    videoLink = videoLinkNode?.href;
    videoId = videoLink?.split('watch?v=')[1] || videoLink?.split('/shorts/')[1];
    if (!videoTitle || !channelName || !videoLink || !videoId) {
        console.warn('could not get video data', videoItem, {videoTitle, channelName, videoLink, videoId});
        return false;
    }
    // TODO when scroll down more, takes more time
    // console.time(videoId);
    const checkResult = await checkIsVideoDataRu(videoTitle, channelName, videoId);
    // console.timeEnd(videoId);
    if (checkResult?.reason && checkResult?.reason !== BLOCK_REASONS_MAP.inSessStorage) {
        addToDb({
            [VIDEOS_DB_KEYS.ytId]: videoId || null,
            [VIDEOS_DB_KEYS.title]: videoTitle || null,
            [VIDEOS_DB_KEYS.channelName]: channelName || null,
            [VIDEOS_DB_KEYS.link]: videoLink || null,
            [VIDEOS_DB_KEYS.reason]: checkResult.reason || null,
            [VIDEOS_DB_KEYS.reasonDetails]: checkResult.reasonDetails || null,
            [VIDEOS_DB_KEYS.timeWhenBlocked]: Date.now() || null,
        }, checkResult.isRu);
    }
    return {isRu: checkResult.isRu, id: videoId, title: videoTitle, link: videoLink};
};
const handleVideos = async (container, settings, isAuthorized) => {
    // console.log('handling videos watch', {container, settings, isAuthorized});
    let whatToDo = settings[SETTINGS_KEYS.whatToDo];
    // TODO maby change to more efficient selector
    const videoItems = container.getElementsByTagName('ytd-compact-video-renderer');
    if (!videoItems || !whatToDo) {
        console.log('could find videos', container);
    }
    for (const videoItem of videoItems) {
        if (!settings[SETTINGS_KEYS.blockOnWatch]) {
            removeFilter(videoItem);
            continue;
        }
        checkVideoItem(videoItem)
            .then(result => {
                // console.log('videoItemResult....', videoItem,result);
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
            .catch(console.log);
    }
};
// TODO when opening video while videos are being blocked, problems occure
export const handleWatchPage = async () => {

    // console.clear()
    // console.log('handling watch page')
    try {
        await waitForNodeLoad('ytd-compact-video-renderer')
        await waitForNodeLoad('#masthead-container #buttons' + ' #button');
    } catch (e) {
        console.log(e);
        return;
    }
    const isAuthButtonsContainer = document.body.querySelector('#masthead-container #buttons');
    const authButtonsNumber = isAuthButtonsContainer.children.length;
    const isAuthorized = authButtonsNumber === 3;
    // sometimes containers are different so i get parent
    const videoItemsContainer = document.body.querySelector('ytd-compact-video-renderer').parentElement
    let settings = await getSettings();
    if (!settings || !videoItemsContainer || !authButtonsNumber || !isAuthButtonsContainer || !isAuthorized) {
        console.warn('could not handle home page', {settings, videoItemsContainer, authButtonsNumber, isAuthButtonsContainer, isAuthorized});
        return;
    }
    await handleVideos(videoItemsContainer, settings, isAuthorized);
    chrome.storage.onChanged.addListener(async (changes) => {
        if (changes[SETTINGS_STORAGE_KEY]) {
            const newSettings = await getSettings();
            if (!newSettings) return;
            await handleVideos(videoItemsContainer, newSettings, isAuthorized);
            settings = newSettings;
        }
    });
    let timeout;
    videoItemsObserver = new MutationObserver(async function (mutation) {
        // console.log('mutation, watch page!!!!!!!!!!!!!!1', mutation);
        clearTimeout(timeout);
        // TODO possibly make wait time less
        timeout = setTimeout(() => {
            handleVideos(videoItemsContainer, settings, isAuthorized);
        }, 200);
    })
    videoItemsObserver.observe(videoItemsContainer, {childList: true/*, attributes: true*/});
};