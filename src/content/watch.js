import {checkIsVideoDataRu} from '../utils/containsRussian';
import {CHECKED_VIDEO_ITEM_CLASSNAME, SELECTOR} from './consts';
import {waitForContainerLoad} from './utils';


const handleVideoRows = async (container) => {
    console.log('HANDLING WATCH PAGE', Math.random());
    for (let videoItem of container.children) {
        if (videoItem.classList.contains(CHECKED_VIDEO_ITEM_CLASSNAME)) continue;
        const titleSpan = videoItem.querySelector('h3 > span')
        const titleText = titleSpan?.innerText
        if (await checkIsVideoDataRu({title: titleText})) {
            videoItem.style.filter = 'blur(10px) opacity(20%)'
            // videoItem.style.display = 'none'
        }
        videoItem.classList.add(CHECKED_VIDEO_ITEM_CLASSNAME);
    }
};
// TODO make wait function universal and add node selector consts
// const waitForContainerLoad = () => {
//     return new Promise((resolve) => {
//         new MutationObserver(function (mutations) {
//             if (Boolean(document.querySelector(SELECTOR.CONTAINER_WATCH))) {
//                 this.disconnect();
//                 resolve();
//             }
//         }).observe(document.body, {childList: true, subtree: true});
//     });
// };

export const handleWatchPage = async () => {
    console.log('handle watch page');
    await waitForContainerLoad(SELECTOR.CONTAINER_WATCH);
    const videoItemsContainer = document.querySelector(SELECTOR.CONTAINER_WATCH);
    await handleVideoRows(videoItemsContainer);
    const videoItemsObserver = new MutationObserver(async function (mutations) {
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