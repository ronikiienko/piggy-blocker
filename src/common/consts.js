export const CMD_GET_CURRENT_TAB = 'CMD_GET_CURRENT_TAB';

export const SETTINGS_STORAGE_KEY = 'settings'

export const SETTINGS_KEYS = {
    blockOnHome: 'blockOnHome',
    blockOnWatch: 'blockOnWatch',
    blockOnShorts: 'blockOnShorts',
    whatToDo: 'whatToDo',
    blurIntensity: 'blurIntensity',
    theme: 'theme'
};

export const WHAT_TO_DO_MAP = {
    blur: 'blur',
    notInterested: 'notInterested',
    blockChannel: 'blockChannel',
};
export const BLUR_INTENSITY_MAP =  {
    weak: 'weak',
    normal: 'normal',
    strong: 'strong',
    transparent: 'transparent'
}
export const THEME_MAP = {
    light: 'light',
    dark: 'dark'
}

export const DEFAULT_SETTINGS = {
    blockOnHome: true,
    blockOnWatch: true,
    blockOnShorts: true,
    blurIntensity: 'normal',
    whatToDo: 'blur',
    theme: 'light',
};
