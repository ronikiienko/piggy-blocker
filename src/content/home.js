import {checkIsVideoDataRu} from '../utils/containsRussian';
import {CHECKED_VIDEO_ITEM_CLASSNAME, SELECTOR} from './consts';
import {handleRussianVideoItem, waitForContainerLoad} from './utils';


const handleVideoItem = async (videoItem) => {
    if (videoItem === null) return;
    const videoTitle = videoItem.querySelector('#video-title-link');
    if (videoTitle === null) return;
    if (videoItem.classList.contains(CHECKED_VIDEO_ITEM_CLASSNAME)) return;
    const videoLink = videoTitle.href;
    // const videoId = videoLink.split('watch?v=')[1]
    const titleText = videoTitle.title;
    const checkResult = await checkIsVideoDataRu({title: titleText});
    if (checkResult) handleRussianVideoItem(videoItem);
    videoItem.classList.add(CHECKED_VIDEO_ITEM_CLASSNAME);
};

const handleRows = (rows) => {
    for (const addedRow of rows) {
        if (!(addedRow.tagName === 'YTD-RICH-GRID-ROW')) continue;
        for (const videoItem of addedRow.children[0].children) {
            handleVideoItem(videoItem)
                .then(result => {
                    if (result) {
                        handleRussianVideoItem(videoItem, 'home');
                    }
                });
        }

    }
}

export const handleHomePage = async () => {
    await waitForContainerLoad(SELECTOR.CONTAINER_HOME);
    const videoItemsContainer = document.querySelector(SELECTOR.CONTAINER_HOME);
    setTimeout(() => {
        handleRows(videoItemsContainer.children)
    }, 50)
    const videoItemsObserver = new MutationObserver(async function (mutations) {
        for (const mutation of mutations) {
            handleRows(mutation.addedNodes)
        }
    });
    setTimeout(() => {
        videoItemsObserver.observe(videoItemsContainer, {childList: true});
    }, 500);
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