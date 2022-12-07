import {useLiveQuery} from 'dexie-react-hooks';
import React from 'react';
import ViewportList from 'react-viewport-list';
import {RU_LIST_DB_NAME, VIDEOS_DB_KEYS} from '../../../common/consts';
import {db} from '../../../commonBackground/db';
import {Button} from '../../../commonBackground/StyledElements/Button/Button';
import "./Stats.css"
import {ListItem} from './ListItem';

export const Stats = () => {
    console.log('stats rerender');
    const recentRuList = useLiveQuery(() =>
            db[RU_LIST_DB_NAME]
                .where(VIDEOS_DB_KEYS.timeWhenBlocked)
                .above(Date.now() - 1000 * 60 * 60)
                .reverse()
                .toArray(),
        [],
        []
    )
    const dayRuList = useLiveQuery(() =>
            db[RU_LIST_DB_NAME]
                .where(VIDEOS_DB_KEYS.timeWhenBlocked)
                .above(Date.now() - 1000 * 60 * 60 * 24)
                .reverse()
                .toArray(),
        [],
        []
    )
    const totalRuList = useLiveQuery(() =>
            db[RU_LIST_DB_NAME]
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
                onClick={() => {open(chrome.runtime.getURL('stats/index.html'), "_blank")}}
            >
                Детальна статистика тут
            </Button>
            <div className="overall-stats-container">
                <h2 className="main-title">Знайдено рос. відео:</h2>
                <div className="recent-found-total">За останню годину: {recentRuList.length}</div>
                <div className="recent-found-total">За останню добу: {dayRuList.length}</div>
                <div className="recent-found-total">За весь час: {totalRuList.length}</div>
            </div>
            <div ref={listContainerRef} className="recent-list-container">
                <ViewportList
                    viewportRef={listContainerRef}
                    items={recentRuList}
                >
                    {((listItem) => {
                        return <ListItem key={listItem[VIDEOS_DB_KEYS.ytId]} listItem={listItem}/>
                    })}
                </ViewportList>
            </div>

        </div>
    );
};