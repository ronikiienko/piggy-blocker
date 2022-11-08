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
 * @param {string} context
 */
export const handleRussianVideoItem = (node, context) => {
    // if (context === 'watch') {
    //     node.style.display = 'none'
    // }
    node.style.filter = 'blur(10px) opacity(20%)'

    // TODO try to find way to hide videos
    // node.style.visibility = 'hidden',
    //     node.style.borderCollapse = 'collapse'
}