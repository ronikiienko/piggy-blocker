export const isRuStore = {
    ru: new Set(),
    notRu: new Set(),
    addVideo: function (id, isRu) {
        if (!id) return
        if (isRu) return this.ru.add(id)
        this.notRu.add(id)
    },
    getRu: function () {
        return this.ru;
    },
    getNotRu: function () {
        return this.notRu;
    },
    /**
     * Check whether video is ru (if video was already checked on this reload)
     * @param {string} id - vide id
     * @returns {null|boolean} - return true if video is ru, false if not ru and null if video not checked yet
     */
    check: function (id) {
        if (!id) return null
        if (this.ru.has(id)) return true;
        if (this.notRu.has(id)) return false;
        return null;
    },

};
export const clickedStore = {
    clicked: new Set(),
    add: function (id) {
        if (!id) return
        this.clicked.add(id)
    },
    getClicked: function () {
        return this.clicked
    },
    check: function (id) {
        if (!id) return false;
        return this.clicked.has(id);
    },
    clear: function () {
        this.clicked.clear()
    }
}