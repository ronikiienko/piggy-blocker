import {checkIsVideoDataRu} from '../utils/containsRussian';
import {CHECKED_VIDEO_ITEM_CLASSNAME, SELECTOR} from './consts';
import {handleRussianVideoItem, waitForContainerLoad} from './utils';


const handleVideoItem = async (videoItem) => {
    if (videoItem.classList.contains(CHECKED_VIDEO_ITEM_CLASSNAME)) return;
    const titleHeader = videoItem.querySelector('h2');
    if (!titleHeader) return;
    const titleText = titleHeader.innerText;
    if (await checkIsVideoDataRu({title: titleText})) {
        handleRussianVideoItem(videoItem, 'shorts');
    }
    videoItem.classList.add(CHECKED_VIDEO_ITEM_CLASSNAME);
};

export const handleShortsPage = async () => {
    console.log('handling Shorts!~!!!!')
    await waitForContainerLoad(SELECTOR.CONTAINER_SHORTS);
    const videoItemsContainer = document.querySelector(SELECTOR.CONTAINER_SHORTS);
    for (const videoItem of videoItemsContainer.children) {
        if (videoItem.tagName !== 'YTD-REEL-VIDEO-RENDERER') continue;
        await handleVideoItem(videoItem);
    }
    const videoItemsObserver = new MutationObserver(async (mutations) => {
        for (const mutation of mutations) {
            const videoItem = mutation.addedNodes[1]
            console.log('hihi', videoItem);
            if (videoItem.tagName !== 'YTD-REEL-VIDEO-RENDERER') continue
            await handleVideoItem(videoItem)
        }
    });
    setTimeout(() => {
        videoItemsObserver.observe(videoItemsContainer, {childList: true});
    }, 500)
};