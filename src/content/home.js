import {queue} from 'async-es';
import {checkIsVideoDataRu} from '../common/utils/containsRussian';
import {CHECKED_VIDEO_ITEM_CLASSNAME, SELECTOR} from './consts';
import {handleRussianVideoItem, removeFilter, wait, waitForNodeLoad} from './utils';


const blockVideoQueue = queue(async (videoItem) => {
    await blockVideoItem(videoItem);
}, 1);

const openPopup = async (videoItem) => {
    await waitForNodeLoad('#details #button', videoItem);
    const button = videoItem.querySelector('#details #button');
    if (!button) {
        await openPopup(videoItem);
        return;
    }
    const clickEvent = new Event('click', {bubbles: false});
    button.dispatchEvent(clickEvent);
};

const clickPopupOption = async (videoItem) => {
    let popup = document.getElementsByTagName('tp-yt-iron-dropdown')[0];
    // with timeout popup will be visible
    await waitForNodeLoad('ytd-menu-service-item-renderer', popup);
    let menuItems = popup.querySelectorAll('ytd-menu-service-item-renderer');
    const clickEvent = new Event('click', {bubbles: false});
    menuItems[4].dispatchEvent(clickEvent);
    // menuItems[4].click();
    removeFilter(videoItem);
};

const blockVideoItem = async (videoItem) => {
    await openPopup(videoItem);
    await clickPopupOption(videoItem);
};

const checkVideoItem = async (videoItem) => {
    const videoTitle = videoItem.querySelector('#video-title-link');
    if (!videoTitle) return false;
    if (videoItem.classList.contains(CHECKED_VIDEO_ITEM_CLASSNAME)) return false;
    const titleText = videoTitle.title;
    if (!titleText) return false;
    const channelNameNode = videoItem.querySelector('#channel-name');
    videoItem.classList.add(CHECKED_VIDEO_ITEM_CLASSNAME);
    return checkIsVideoDataRu(titleText, channelNameNode?.innerText);
};

const handleRows = async (rows) => {
    for (const row of rows) {
        if (!(row.tagName === 'YTD-RICH-GRID-ROW')) continue;
        for (const videoItem of row.children[0].children) {
            if (!videoItem) continue;
            if (getComputedStyle(videoItem).display === 'none') continue;
            checkVideoItem(videoItem)
                .then(result => {
                    if (result) {
                        handleRussianVideoItem(videoItem, 'home');
                        // blockVideoQueue.push(videoItem)
                    }
                    return result;
                })
                .catch(e => console.log(e));
            // break;
        }
        // break;
    }
};

export const handleHomePage = async () => {
    await waitForNodeLoad(SELECTOR.CONTAINER_HOME);
    const videoItemsContainer = document.querySelector(SELECTOR.CONTAINER_HOME);
    await wait(50);
    await handleRows(videoItemsContainer.children);
    const videoItemsObserver = new MutationObserver(async function (mutations) {
        for (const mutation of mutations) {
            await handleRows(mutation.addedNodes);
        }
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