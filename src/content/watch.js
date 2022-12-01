import {
    BLOCK_REASONS_MAP,
    SELECTOR,
    SETTINGS_KEYS,
    SETTINGS_STORAGE_KEY,
    VIDEOS_DB_KEYS,
    WHAT_TO_DO_MAP,
} from '../common/consts';
import {getSettings} from '../common/getSettings';
import {checkIsVideoDataRu} from './containsRussian';
import {addToDb} from './containsRussianStats';
import {applyFilter, removeFilter, waitForNodeLoad} from './utils';
import {isRuStore} from './videoStore';


const handleVideoItem = async (videoItem) => {
    console.log(videoItem);
    // if (videoItem.classList.contains(CHECKED_VIDEO_ITEM_CLASSNAME)) return
    const titleSpan = videoItem.querySelector('h3 > span');
    const titleText = titleSpan?.innerText;
    checkIsVideoDataRu(titleText)
        .then(result => {
            if (result) {
                applyFilter(videoItem, 'watch');
            }
        });
    // videoItem.classList.add(CHECKED_VIDEO_ITEM_CLASSNAME);
};


const checkVideoItem = async (videoItem) => {
    if (!videoItem) return false;
    if (getComputedStyle(videoItem).display === 'none') return false;
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
    videoId = videoLink?.split('watch?v=')[1];
    if (!videoTitle || !channelName || !videoLink || !videoId) {
        console.warn('could not get video data', videoItem);
        return false;
    }

    const checkResult = await checkIsVideoDataRu(videoTitle, channelName, videoId);
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
    console.log('handling videos');
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
                if (result.isRu) {
                    applyFilter(videoItem, 'home', settings);
                } else {
                    removeFilter(videoItem);
                }
            })
            .catch(console.log);
    }
};

export const handleWatchPage = async () => {
    try {
        await waitForNodeLoad(SELECTOR.CONTAINER_WATCH);
        await waitForNodeLoad(SELECTOR.IS_AUTH_BUTTONS + ' #button');
    } catch (e) {
        console.log(e);
        return;
    }
    const isAuthButtonsContainer = document.body.querySelector('#masthead-container #buttons');
    const authButtonsNumber = isAuthButtonsContainer.children.length;
    const isAuthorized = authButtonsNumber === 3;
    const videoItemsContainer = document.querySelector(SELECTOR.CONTAINER_WATCH);
    let settings = await getSettings();
    if (!settings || !videoItemsContainer || !authButtonsNumber || !isAuthButtonsContainer) {
        console.log('could not handle home page');
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
    const videoItemsObserver = new MutationObserver(async function () {
        console.log('mutation!!!!!!!!!!!!!!1');
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            handleVideos(videoItemsContainer, settings, isAuthorized);
        }, 400);
    })
    videoItemsObserver.observe(videoItemsContainer, {childList: true});
};