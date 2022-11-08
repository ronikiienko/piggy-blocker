/**
 *
 * @param {string} containerSelector
 * @returns {Promise<unknown>}
 */

export const waitForContainerLoad = (containerSelector) => {
    return new Promise((resolve) => {
        new MutationObserver(function () {
            if (Boolean(document.querySelector(containerSelector))) {
                this.disconnect();
                resolve();
            }
        }).observe(document.body, {childList: true, subtree: true});
    });
}

/**
 *
 * @param {HTMLElement} node
 */
export const blurNode = (node) => {
    node.style.filter = 'blur(10px) opacity(20%)'
    // node.style.display = 'none'
    // TODO try to find way to hide videos
    // node.style.visibility = 'hidden',
    //     node.style.borderCollapse = 'collapse'
}