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