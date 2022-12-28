import {useLiveQuery} from 'dexie-react-hooks';
import React from 'react';
import ViewportList from 'react-viewport-list';
import {CHECKED_VIDEOS_DB_KEYS, CHECKED_VIDEOS_DB_NAME, IS_RU_MAP} from '../../../common/consts';
import {db} from '../../../commonBackground/db';
import {Button} from '../../../commonBackground/StyledElements/Button/Button';
import {ListItem} from './ListItem';
import './Stats.css';


export const Stats = () => {
    // TODO use count dexie method instead of toArray
    // console.log('stats rerender');
    const recentRuList = useLiveQuery(() =>
            db[CHECKED_VIDEOS_DB_NAME]
                .where(CHECKED_VIDEOS_DB_KEYS.timeWhenBlocked)
                .above(Date.now() - 1000 * 60 * 60)
                .and(item => item[CHECKED_VIDEOS_DB_KEYS.isRu] === IS_RU_MAP.ru)
                .reverse()
                .toArray(),
        [],
        []
    )
    const dayRuList = useLiveQuery(() =>
            db[CHECKED_VIDEOS_DB_NAME]
                .where(CHECKED_VIDEOS_DB_KEYS.timeWhenBlocked)
                .above(Date.now() - 1000 * 60 * 60 * 24)
                .and(item => item[CHECKED_VIDEOS_DB_KEYS.isRu] === IS_RU_MAP.ru)
                .reverse()
                .toArray(),
        [],
        []
    )
    const totalRuList = useLiveQuery(() =>
            db[CHECKED_VIDEOS_DB_NAME]
                .where(CHECKED_VIDEOS_DB_KEYS.isRu)
                .equals(IS_RU_MAP.ru)
                .reverse()
                .toArray(),
        [],
        []
    )
    const listContainerRef = React.useRef(null)
    return (
        <div>
            <Button
                style={{width: '100%', margin: 'auto', marginTop: '10px'}}
                onClick={() => {
                    open(chrome.runtime.getURL('stats/index.html'), '_blank');
                }}
            >
                {chrome.i18n.getMessage('detailed_stats_link_text')}
            </Button>
            <div className="overall-stats-container">
                <h2 className="main-title">{chrome.i18n.getMessage('popup_detected_videos_header')}</h2>
                <div
                    className="recent-found-total">{chrome.i18n.getMessage('popup_detected_videos_last_hour')} {recentRuList.length}</div>
                <div
                    className="recent-found-total">{chrome.i18n.getMessage('popup_detected_videos_last_day')} {dayRuList.length}</div>
                <div
                    className="recent-found-total">{chrome.i18n.getMessage('popup_detected_videos_all_time')} {totalRuList.length}</div>
            </div>
            <div ref={listContainerRef} className="recent-list-container">
                <ViewportList
                    viewportRef={listContainerRef}
                    items={recentRuList}
                >
                    {((listItem) => {
                        return <ListItem key={listItem[CHECKED_VIDEOS_DB_KEYS.ytId]} listItem={listItem}/>;
                    })}
                </ViewportList>
            </div>

        </div>
    );
};