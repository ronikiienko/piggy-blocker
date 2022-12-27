export const CMD_TAB_UPDATE = 'CMD_TAB_UPDATE';

export const SETTINGS_STORAGE_KEY = 'settings';

export const SETTINGS_KEYS = {
    blockOnHome: 'blockOnHome',
    blockOnWatch: 'blockOnWatch',
    blockOnShorts: 'blockOnShorts',
    whatToDo: 'whatToDo',
    blurIntensity: 'blurIntensity',
    theme: 'theme',
};

export const UID_STORAGE_KEY = 'uid';

export const WHAT_TO_DO_MAP = {
    blur: 'blur',
    notInterested: 'notInterested',
    blockChannel: 'blockChannel',
};
export const BLUR_INTENSITY_MAP = {
    weak: 'weak',
    normal: 'normal',
    strong: 'strong',
    transparent: 'transparent',
};
export const THEME_MAP = {
    light: 'light',
    dark: 'dark',
};

export const DEFAULT_SETTINGS = {
    blockOnHome: true,
    blockOnWatch: true,
    blockOnShorts: true,
    blurIntensity: 'normal',
    whatToDo: 'blur',
    // TODO use browser theme as default
    theme: 'light',
};
export const SELECTOR = {
    CONTAINER_HOME: '#contents.ytd-rich-grid-renderer',
    CONTAINER_WATCH: '.ytd-watch-next-secondary-results-renderer #contents.ytd-item-section-renderer',
    CONTAINER_SHORTS: '#shorts-inner-container',
};

export const CHECKED_VIDEOS_DB_KEYS = {
    isRu: 'isRu',
    ytId: 'ytId',
    title: 'title',
    link: 'link',
    channelName: 'channelName',
    reason: 'reason',
    reasonDetails: 'reasonDetails',
    timeWhenBlocked: 'timeWhenBlocked',
    synced: 'synced',
};

export const IS_RU_MAP = {
    ru: 1,
    notRu: 0,
};

export const BLOCK_REASONS_MAP = {
    byCharsTitle: 'byCharsTitle',
    byCharsChannelName: 'byCharsChannelName',
    noCyrillic: 'noCyrillic',
    markerWords: 'markerWords',
    google: 'google',
    inSessStorage: 'inSessStorage',
};
export const CMD_ADD_TO_CHECKED_VIDEOS_DB = 'CMD_ADD_TO_CHECKED_VIDEOS_LIST';

export const CHECKED_VIDEOS_DB_NAME = 'RU_CHECKED_VIDEOS';

export const monthNames = ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень',
    'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень',
];
// export const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
//     'July', 'August', 'September', 'October', 'November', 'December',
// ];


export const REASON_FILTER_KEYS = {
    any: 'any',
    byCharsTitle: 'byCharsTitle',
    byCharsChannelName: 'byCharsChannelName',
    markerWords: 'markerWords',
    google: 'google',
    noCyrillic: 'noCyrillic',
};
export const LANGUAGE_FILTER_KEYS = {
    1: '1',
    0: '0',
    any: 'any',
};
export const DEFAULT_FILTERS = {
    dateRange: {fromDate: '', toDate: ''},
    reasonFilter: REASON_FILTER_KEYS.any,
    searchFilter: '',
    languageFilter: LANGUAGE_FILTER_KEYS.any,
};

export const ALARM_SEND_TO_BACKEND = {
    name: 'ALARM_SEND_TO_BACKEND',
    alarmCreateInfo: {
        delayInMinutes: 0.1,
        periodInMinutes: 0.4,
    },
};

export const ADD_VIDEOS_ROUTE_HREF = 'http://localhost:5001/videos';
// export const ADD_VIDEOS_ROUTE_HREF = 'https://pblocker.cap.cmd.pp.ua/videos';

