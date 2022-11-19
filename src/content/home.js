import {queue} from 'async-es';
import {SETTINGS_KEYS, SETTINGS_STORAGE_KEY, WHAT_TO_DO_MAP} from '../common/consts';
import {getSettings} from '../utils/common/getSettings';
import {checkIsVideoDataRu} from '../utils/content/containsRussian';
import {applyFilter, removeFilter, wait, waitForNodeLoad} from '../utils/content/utils';
import {CLICKED_VIDEO_ITEM_CLASSNAME, SELECTOR} from './consts';
import {videoStore} from './videoStore';


const blockVideoQueue = queue(async ({videoItem, settings}) => {
    await blockVideoItem(videoItem, settings);
}, 1);

const openPopup = async (videoItem) => {
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
    videoItem.classList.add(CLICKED_VIDEO_ITEM_CLASSNAME)
};

const clickPopupOption = async (videoItem, actionItemMenuNumber) => {
    let popup = document.getElementsByTagName('tp-yt-iron-dropdown')[0];
    // popup.style.opacity = 0;
    try {
        await waitForNodeLoad('ytd-menu-service-item-renderer', popup);
    } catch (e) {
        console.log(e);
        return;
    }
    let menuItems = popup.querySelectorAll('ytd-menu-service-item-renderer');
    await wait(100)
    if (menuItems.length <= actionItemMenuNumber) {
        console.log('failed click')
        document.body.click()
        // popup.style.opacity = 1;
        return;
    }
    const clickEvent = new Event('click', {bubbles: false});
    console.log('clickinggggggg', videoItem, menuItems.length, menuItems);
    menuItems[actionItemMenuNumber].dispatchEvent(clickEvent);
    popup.style.opacity = 1;
    removeFilter(videoItem);
};
//  TODO channel name in shorts is huge with /n /n /n /n /n
const blockVideoItem = async (videoItem, settings) => {
    if (videoItem.classList.contains(CLICKED_VIDEO_ITEM_CLASSNAME)) return
    const whatToDo = settings?.[SETTINGS_KEYS.whatToDo];
    if (whatToDo === WHAT_TO_DO_MAP.blur || !whatToDo) return;
    let actionItemMenuNumber;
    if (whatToDo === WHAT_TO_DO_MAP.notInterested) actionItemMenuNumber = 4;
    if (whatToDo === WHAT_TO_DO_MAP.blockChannel) actionItemMenuNumber = 5;
    if (!actionItemMenuNumber) return;
    const popupOpeningResult =  await openPopup(videoItem);
    await clickPopupOption(videoItem, actionItemMenuNumber);
};

const checkVideoItem = async (videoItem) => {
    if (!videoItem) return false;
    if (getComputedStyle(videoItem).display === 'none') return false;
    let videoTitle;
    let videoLink;
    let videoId;
    if (videoItem.classList.contains('ytd-rich-shelf-renderer')) {
        videoTitle = videoItem.querySelector('#video-title');
        if (!videoTitle) return false
        videoLink = videoTitle.parentElement.parentElement.href
        videoId = videoLink?.split('/shorts/')[1];
    } else {
        videoTitle = videoItem.querySelector('#video-title-link');
        if (!videoTitle) return false
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


const handleVideos = async (container, settings) => {
    console.log('handling videos');
    // console.log('not ru: ', videoStore.getNotRu(), 'ru: ', videoStore.getRu());
    // TODO maby change to more efficient selector
    const videoItems = container.getElementsByTagName('ytd-rich-item-renderer');
    for (const videoItem of videoItems) {
        if (!settings[SETTINGS_KEYS.blockOnHome]) {
            removeFilter(videoItem)
            continue;
        }
        checkVideoItem(videoItem)
            .then(result => {
                if (result) {
                    applyFilter(videoItem, 'home', settings);
                    blockVideoQueue.push({videoItem, settings});
                } else {
                    removeFilter(videoItem);
                }
            })
            .catch(e => console.log(e));
    }
};
// TODO when resizing screen everything breaks
export const handleHomePage = async () => {
    try {
        await waitForNodeLoad(SELECTOR.CONTAINER_HOME);
    } catch (e) {
        console.log(e);
        return;
    }
    const videoItemsContainer = document.querySelector(SELECTOR.CONTAINER_HOME);
    await wait(50);
    let settings = await getSettings();
    await handleVideos(videoItemsContainer, settings);
    chrome.storage.onChanged.addListener(async (changes, areaName) => {
        if (changes[SETTINGS_STORAGE_KEY] && areaName === 'sync') {
            const newSettings = await getSettings()
            if (!newSettings) return
            await handleVideos(videoItemsContainer, newSettings)
            settings = newSettings
        }
    })
    let timeout;
    const videoItemsObserver = new MutationObserver(async function (mutations) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            handleVideos(videoItemsContainer, settings);
        }, 400);
    });
    videoItemsObserver.observe(videoItemsContainer, {childList: true});
};