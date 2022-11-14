import {checkIsVideoDataRu} from '../common/utils/containsRussian';
import {CHECKED_VIDEO_ITEM_CLASSNAME, SELECTOR} from './consts';
import {handleRussianVideoItem, wait, waitForContainerLoad} from './utils';

const blockVideoItem = (videoItem, blockChannel) => {
    setTimeout(async () => {
        const button = videoItem.querySelector('#details #button')
        console.log(button);
        // #details #button
        // console.log(container);
        const clickEvent = new Event('click', {bubbles: false})
        button.dispatchEvent(clickEvent)
        // let popups = document.getElementsByTagName("tp-yt-iron-dropdown");
        // popups[0].style.opacity = 0
        // let menuItems = popups[0].querySelectorAll("ytd-menu-service-item-renderer");
        // menuItems[4].click()
        // popups[0].style.opacity = 1
        // console.log('menuItems', menuItems);
        // const notInterested = popupContainer.querySelector('.style-scope ytd-menu-popup-renderer')
        // console.log('popupContainer', popupContainer);
    }, 6000)
}
//
// const blockVideoItems = async (rows, checkResults) => {
//     let handled = 0;
//     for (const row of rows) {
//         if (!(row.tagName === 'YTD-RICH-GRID-ROW')) continue;
//         for (const videoItem of row.children[0].children) {
//             handled++
//             if (checkResults[handled] === true) {
//                 blockVideoItem(videoItem, false)
//             }
//         }
//     }
// };

const handleVideoItem = async (videoItem) => {
    const videoTitle = videoItem.querySelector('#video-title-link');
    console.log(videoTitle);
    if (!videoTitle) return false;
    // blockVideoItem(videoItem)

    // new MutationObserver(function (mutations) {
    //     for (const mutation of mutations) {
    //         for (const addedNode of mutation.addedNodes) {
    //             console.log(addedNode);
    //         }
    //     }
    // }).observe(videoItem, {childList: true, subtree: true})
    // setTimeout(() => {
    //     const container = videoItem.querySelector('#details').children[2].children[0]
    //     // const button = container.querySelector('#button')
    //     console.log(container);
    //     // const clickEvent = new Event('click', {bubbles: false})
    //     // button.dispatchEvent(clickEvent)
    // }, 5000)
    if (videoItem.classList.contains(CHECKED_VIDEO_ITEM_CLASSNAME)) return false;
    const titleText = videoTitle.title;
    if (!titleText) return false
    videoItem.classList.add(CHECKED_VIDEO_ITEM_CLASSNAME);
    return checkIsVideoDataRu({title: titleText})
};

const handleRows = async (rows) => {
    for (const row of rows) {
        if (!(row.tagName === 'YTD-RICH-GRID-ROW')) continue;
        for (const videoItem of row.children[0].children) {
            if (!videoItem) continue
            if (getComputedStyle(videoItem).display === 'none') continue
            // TODO sometimes handleVideoItem is not a func error (probably when ad item appears)
            handleVideoItem(videoItem)
                .then(result => {
                    console.log('Result is ', result);
                    if (result) {
                        handleRussianVideoItem(videoItem, 'home');
                    }
                    return result
                })
                .catch(e => console.log(e))
            // break;
        }
        // break;
    }
};

export const handleHomePage = async () => {
    await waitForContainerLoad(SELECTOR.CONTAINER_HOME);
    const videoItemsContainer = document.querySelector(SELECTOR.CONTAINER_HOME);
    await wait(50);
    await handleRows(videoItemsContainer.children);
    const videoItemsObserver = new MutationObserver(async function (mutations) {
        console.log(mutations);
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