import {CMD_GET_CURRENT_TAB} from '../common/consts';
import {checkIsVideoDataRu} from '../utils/containsRussian';
import {CHECKED_VIDEO_ITEM_CLASSNAME} from './consts';

// const getDataFromScripts = () => {
//     const scripts = document.querySelectorAll('script');
//     for (let script of scripts) {
//         const scriptText = script.innerHTML;
// TODO happens too many times
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


const handleVideoRows = async (container) => {
    for (let videoItemsRow of container.children) {
        for (let videoItem of videoItemsRow.children[0].children) {
            if (videoItem === null) continue;
            const videoTitle = videoItem.querySelector('#video-title-link');
            if (videoTitle === null) continue;
            if (videoItem.classList.contains(CHECKED_VIDEO_ITEM_CLASSNAME)) continue;
            const videoLink = videoTitle.href;
            // const videoId = videoLink.split('watch?v=')[1]
            const titleText = videoTitle.title;
            const checkResult = await checkIsVideoDataRu({title: titleText});
            if (checkResult) videoItem.style.filter = 'blur(10px) opacity(20%)';
            videoItem.classList.add(CHECKED_VIDEO_ITEM_CLASSNAME);
        }
    }
};


const waitForContainerLoad = () => {
    return new Promise((resolve) => {
        new MutationObserver(function (mutations) {
            if (Boolean(document.querySelector('#contents.ytd-rich-grid-renderer'))) {
                this.disconnect();
                resolve();
            }
        }).observe(document.body, {childList: true, subtree: true});
    });
};

const handleMainPage = async () => {

};
const handleWatchPage = async () => {

};
const handleShortsPage = async () => {

};

const handleVideoItems = async () => {
    const tab = await chrome.runtime.sendMessage({cmd: CMD_GET_CURRENT_TAB});
    const url = new URL(tab.url)
    const pathname = url.pathname
    console.log(pathname);
    switch (pathname) {
        case '/':
            await waitForContainerLoad();
            const videoItemsContainer = document.querySelector('#contents.ytd-rich-grid-renderer');
            await handleVideoRows(videoItemsContainer);
            const videoItemsObserver = new MutationObserver(async (mutations) => {
                await handleVideoRows(videoItemsContainer);
            });
            videoItemsObserver.observe(videoItemsContainer, {childList: true});
    }
};
//TODO make content script inject only on youtube
handleVideoItems()
    .then();


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


