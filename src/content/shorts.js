import {checkIsVideoDataRu} from '../utils/containsRussian';
import {CHECKED_VIDEO_ITEM_CLASSNAME, SELECTOR} from './consts';
import {blurNode, waitForContainerLoad} from './utils';


const handleVideoRows = async (container) => {
    console.log('handling rows!!!', Math.random());
    for (let shortVideo of container.children) {
        if (shortVideo.classList.contains(CHECKED_VIDEO_ITEM_CLASSNAME)) continue;
        const titleHeader = shortVideo.querySelector('h2');
        if (!titleHeader) continue;
        const titleText = titleHeader.innerText
        if (await checkIsVideoDataRu({title: titleText})) {
            blurNode(shortVideo)
        }
        shortVideo.classList.add(CHECKED_VIDEO_ITEM_CLASSNAME);
    }
};

export const handleShortsPage = async () => {
    await waitForContainerLoad(SELECTOR.CONTAINER_SHORTS);
    const videoItemsContainer = document.querySelector(SELECTOR.CONTAINER_SHORTS);
    await handleVideoRows(videoItemsContainer);
    const videoItemsObserver = new MutationObserver(async (mutations) => {
        // new video nodes appear every 9 scrolls
        await handleVideoRows(videoItemsContainer)
    });
    videoItemsObserver.observe(videoItemsContainer, {childList: true});
};