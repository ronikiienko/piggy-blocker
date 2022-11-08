import {checkIsVideoDataRu} from '../utils/containsRussian';
import {CHECKED_VIDEO_ITEM_CLASSNAME, SELECTOR} from './consts';
import {blurNode, waitForContainerLoad} from './utils';


const handleVideoItem = async (container) => {
    // console.log('HANDLING WATCH PAGE', Math.random());
    for (let videoItem of container.children) {
        if (videoItem.classList.contains(CHECKED_VIDEO_ITEM_CLASSNAME)) continue;
        const titleSpan = videoItem.querySelector('h3 > span')
        const titleText = titleSpan?.innerText
        if (await checkIsVideoDataRu({title: titleText})) {
            blurNode(videoItem)
        }
        videoItem.classList.add(CHECKED_VIDEO_ITEM_CLASSNAME);
    }
};

export const handleWatchPage = async () => {
    console.log('handle watch page');
    await waitForContainerLoad(SELECTOR.CONTAINER_WATCH);
    const videoItemsContainer = document.querySelector(SELECTOR.CONTAINER_WATCH);
    await handleVideoItem(videoItemsContainer);
    const videoItemsObserver = new MutationObserver(async function (mutations) {
        // console.log(mutations[0].addedNodes);
        for (let addedVideo of mutations[0].addedNodes) {
            // if (addedVideo.)
            console.log(addedVideo.tagName);
        }
        // console.log(videoItemsContainer);
        let areNodesAdded = false;
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                areNodesAdded = true;
                break;
            }
        }
        if (!areNodesAdded) return
        await handleVideoItem(videoItemsContainer);
    });
    setTimeout(() => {
        videoItemsObserver.observe(videoItemsContainer, {childList: true, attributes: true});
    }, 500)
};