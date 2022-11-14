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
    node.style.filter = 'blur(2px) opacity(20%)'

    // TODO try to find way to hide videos
    // node.style.visibility = 'hidden',
    //     node.style.borderCollapse = 'collapse'
}
export const wait = (msec) => {
    return new Promise(resolve => setTimeout(() => resolve(), msec));
};