import {checkIsVideoDataRu} from '../utils/containsRussian';
import {CHECKED_VIDEO_ITEM_CLASSNAME, SELECTOR} from './consts';
import {blurNode, waitForContainerLoad} from './utils';


const handleVideoRows = async (container) => {
    console.log('HANDLING HOME PAGE', Math.random());
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
            if (checkResult) blurNode(videoItem);
            videoItem.classList.add(CHECKED_VIDEO_ITEM_CLASSNAME);
        }
    }
};

export const handleHomePage = async () => {
    console.log('handle home page');
    await waitForContainerLoad(SELECTOR.CONTAINER_HOME);
    const videoItemsContainer = document.querySelector(SELECTOR.CONTAINER_HOME);
    await handleVideoRows(videoItemsContainer);
    const videoItemsObserver = new MutationObserver(async function (mutations) {
        // TODO sometimes this fires two times and next line fix this but....
        // TODO review this
        let areNodesAdded = false;
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                areNodesAdded = true;
                break;
            }
        }
        if (!areNodesAdded) return
        console.log(mutations);
        await handleVideoRows(videoItemsContainer);
    });
    setTimeout(() => {
        videoItemsObserver.observe(videoItemsContainer, {childList: true});
    }, 500)
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