import {BLUR_INTENSITY_MAP, SETTINGS_KEYS} from '../common/consts';


/**
 *
 * @param nodeSelector
 * @param [containerToSearchIn]
 * @param [maxWaitingTime]
 * @returns {Promise<unknown>}
 */
export const waitForNodeLoad = (nodeSelector, containerToSearchIn, maxWaitingTime) => {
    const waitTime = maxWaitingTime ? maxWaitingTime : 10000;
    const whereToSearch = containerToSearchIn ? containerToSearchIn : document.body;

    return new Promise((resolve, reject) => {
        const observer = new MutationObserver(function () {
            // console.log(whereToSearch.querySelector(nodeSelector), nodeSelector);
            // console.log(mutation, 'MUTATION MUTATION', nodeSelector, whereToSearch);
            if (whereToSearch.querySelector(nodeSelector)) {
                this.disconnect();
                resolve();
            }
        });
        if (whereToSearch.querySelector(nodeSelector)) {
            resolve();
        } else {
            observer.observe(whereToSearch, {childList: true, subtree: true});
            setTimeout(() => {
                observer.disconnect();
                reject(`could not find node ${nodeSelector} (time expired)`);
            }, waitTime);
        }
    });
};

/**
 *
 * @param node {HTMLElement}
 * @param context {string}
 * @param settings
 */

export const applyFilter = (node, context, settings) => {
    if (!node || !settings) {
        console.log('could not apply filter (no settings or no node');
        return
    }
    // for (let i = 0; i < 100; i++) {
    //     document.dispatchEvent(new KeyboardEvent('keydown', {'key':'ArrowUp', bubbles: true, cancelable: false}));
    // }
    // node.dispatchEvent(new MouseEvent('mousedown', {'button':'1', bubbles: true, cancelable: false}));

    // node.dispatchEvent(new KeyboardEvent('keydown', {'key': ''}))
    // scroll(0, 5000)
    // if (context === 'watch') {
    //     node.style.display = 'none'
    // }
    // if (context === 'shorts') {
    //     // node.style.display = 'none'
    //     // node.style.display = 'none'
    //     node.dispatchEvent(new Event('click', {bubbles: true}))
    // }
    // if (context === 'home') {
    //     // console.log(node);
    //     const openVideoOptions = node.querySelector('.style-scope.ytd-rich-grid-media#menu')
    //     console.log(node);
    //     console.log(openVideoOptions.parentElement.parentElement);
    // }
    let filter;
    switch (settings?.[SETTINGS_KEYS.blurIntensity]) {
        case BLUR_INTENSITY_MAP.weak:
            filter = 'blur(1px) opacity(40%)';
            break;
        case BLUR_INTENSITY_MAP.normal:
            filter = 'blur(4px) opacity(30%)';
            break;
        case BLUR_INTENSITY_MAP.strong:
            filter = 'blur(12px) opacity(20%)';
            break;
        case BLUR_INTENSITY_MAP.transparent:
            filter = 'opacity(0%)';
            break;
        default:
            filter = 'blur(4px) opacity(30%)';
    }
    node.style.filter = filter;
    // node.style.visibility = 'hidden',
    //     node.style.borderCollapse = 'collapse'
};
export const removeFilter = (node) => {
    if (!node) {
        console.log('could not remove filter from undefined node');
        return
    }
    node.style.filter = 'blur(0px) opacity(100%)';
    // node.style.background = 'none'
};
