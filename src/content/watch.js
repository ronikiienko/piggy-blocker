import {checkIsVideoDataRu} from '../common/utils/containsRussian';
import {CHECKED_VIDEO_ITEM_CLASSNAME, SELECTOR} from './consts';
import {handleRussianVideoItem, waitForNodeLoad} from './utils';

const handleVideoItem = async (videoItem) => {
    if (videoItem.classList.contains(CHECKED_VIDEO_ITEM_CLASSNAME)) return
    const titleSpan = videoItem.querySelector('h3 > span');
    const titleText = titleSpan?.innerText;
    checkIsVideoDataRu(titleText)
        .then(result => {
            if (result) {
                handleRussianVideoItem(videoItem, 'watch');
            }
        })
    videoItem.classList.add(CHECKED_VIDEO_ITEM_CLASSNAME);
};

export const handleWatchPage = async () => {
    await waitForNodeLoad(SELECTOR.CONTAINER_WATCH);
    const videoItemsContainer = document.querySelector(SELECTOR.CONTAINER_WATCH);
    for (let videoItem of videoItemsContainer.children) {
        await handleVideoItem(videoItem)
    }
    const videoItemsObserver = new MutationObserver(async function (mutations) {
        for (const mutation of mutations) {
            for (let addedVideo of mutation.addedNodes) {
                if (addedVideo.tagName === 'YTD-COMPACT-VIDEO-RENDERER') {
                    await handleVideoItem(addedVideo);
                }
            }
        }
    })
    videoItemsObserver.observe(videoItemsContainer, {childList: true});
};