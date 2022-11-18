export const videoStore = {
    ru: new Set(),
    notRu: new Set(),
    addRu: function (id) {
        this.ru.add(id);
    },
    addNotRu: function (id) {
        this.notRu.add(id);
    },
    getRu: function () {
        return this.ru;
    },
    getNotRu: function () {
        return this.notRu;
    },
    /**
     * Check whether video is ru
     * @param {string} id - vide id
     * @returns {null|boolean} - return true if video is ru, false if not ru and null if video not checked yet
     */
    check: function (id) {
        if (this.ru.has(id)) return true;
        if (this.notRu.has(id)) return false;
        return null;
    }
};