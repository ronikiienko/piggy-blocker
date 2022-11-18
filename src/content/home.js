import {queue} from 'async-es';
import {SETTINGS_KEYS, WHAT_TO_DO_MAP} from '../common/consts';
import {getSettings} from '../utils/common/getSettings';
import {checkIsVideoDataRu} from '../utils/content/containsRussian';
import {handleRussianVideoItem, removeFilter, wait, waitForNodeLoad} from '../utils/content/utils';
import {SELECTOR} from './consts';
import {videoStore} from './videoStore';


const blockVideoQueue = queue(async ({videoItem, settings}) => {
    await blockVideoItem(videoItem, settings);
}, 1);

const openPopup = async (videoItem) => {
    try {
        await waitForNodeLoad('#details #button', videoItem);
    } catch (e) {
        console.log(e);
        return;
    }
    const button = videoItem.querySelector('#details #button');
    if (!button) {
        await openPopup(videoItem);
        return;
    }
    const clickEvent = new Event('click', {bubbles: false});
    button.dispatchEvent(clickEvent);
};

const clickPopupOption = async (videoItem, actionItemMenuNumber) => {
    let popup = document.getElementsByTagName('tp-yt-iron-dropdown')[0];
    popup.style.opacity = 0;
    try {
        await waitForNodeLoad('ytd-menu-service-item-renderer', popup);
    } catch (e) {
        console.log(e);
        return;
    }
    let menuItems = popup.querySelectorAll('ytd-menu-service-item-renderer');
    if (menuItems.length <= actionItemMenuNumber || menuItems.length === 1) {
        popup.style.display = 'none';
        popup.style.opacity = 1;
        return;
    }
    const clickEvent = new Event('click', {bubbles: false});
    menuItems[actionItemMenuNumber].dispatchEvent(clickEvent);
    popup.style.opacity = 1;
    removeFilter(videoItem);
};
//  TODO channel name in shorts is huge with /n /n /n /n /n
const blockVideoItem = async (videoItem, settings) => {
    const whatToDo = settings?.[SETTINGS_KEYS.whatToDo];
    if (whatToDo === WHAT_TO_DO_MAP.blur || !whatToDo) return;
    let actionItemMenuNumber;
    if (whatToDo === WHAT_TO_DO_MAP.notInterested) actionItemMenuNumber = 4;
    if (whatToDo === WHAT_TO_DO_MAP.blockChannel) actionItemMenuNumber = 5;
    if (!actionItemMenuNumber) return;
    await openPopup(videoItem);
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
    console.log('not ru: ', videoStore.getNotRu(), 'ru: ', videoStore.getRu());
    const videoItems = container.getElementsByTagName('ytd-rich-item-renderer');
    for (const videoItem of videoItems) {
        checkVideoItem(videoItem)
            .then(result => {
                if (result) {
                    handleRussianVideoItem(videoItem, 'home');
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
    const settings = await getSettings();
    await handleVideos(videoItemsContainer, settings);
    let timeout;
    const videoItemsObserver = new MutationObserver(async function (mutations) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            handleVideos(videoItemsContainer);
        }, 500);
    });
    videoItemsObserver.observe(videoItemsContainer, {childList: true});
};

// const waitForVideoTitleLoad = (videoItemNode) => {
//     return new Promise((resolve, reject) => {
//         const videoTitle = videoItemNode.querySelector('#video-title-link')
//         console.log(videoItemNode);
//         console.log(videoTitle);
//         if (!videoTitle) reject('No title node found')
//         if (videoTitle.title) resolve()
//         new MutationObserver(function (mutations) {
//             console.log(mutations);
//             this.disconnect()
//             resolve()
//         }).observe(videoItemNode.querySelector('#video-title-link'), {childList: true, subtree: true})
//     })
// }

// const getDataFromScripts = () => {
//     const scripts = document.querySelectorAll('script');
//     for (let script of scripts) {
//         const scriptText = script.innerHTML;
// TODO happens too many times
//
//         console.log('aaaaaaaa', scriptText.length);
//         if (!scriptText.includes('"contents":{"twoColumnBrowseResultsRenderer"')) continue;
//         let dataString = scriptText.split('ytInitialData = ')[1];
//         dataString = dataString.substring(0, dataString.length - 1);
//         let dataJson;
//         try {
//             dataJson = JSON.parse(dataString);
//         } catch (e) {
//             console.log(e);
//         }
//         const topLevelVideosArray = dataJson.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.richGridRenderer.contents;
//         let videosDataFromScript = [];
//         for (let topLevelVideoData of topLevelVideosArray) {
//             if (!topLevelVideoData?.richItemRenderer ||
//                 topLevelVideoData?.richItemRenderer?.content?.radioRenderer ||
//                 topLevelVideoData?.richItemRenderer?.content?.adSlotRenderer
//             ) continue;
//             videosDataFromScript.push(topLevelVideoData?.richItemRenderer?.content?.videoRenderer);
//         }
//         console.log(videosDataFromScript);
//         return videosDataFromScript
//     }
// };


// const handleRows = async (rows, settings) => {
//     for (const row of rows) {
//         const videoItems = row.getElementsByTagName('ytd-rich-item-renderer');
//         for (const videoItem of videoItems) {
//             checkVideoItem(videoItem)
//                 .then(result => {
//                     if (result) {
//                         handleRussianVideoItem(videoItem, 'home');
//                         blockVideoQueue.push({videoItem, settings});
//                     }
//                 })
//                 .catch(e => console.log(e));
//         }
//     }
// };