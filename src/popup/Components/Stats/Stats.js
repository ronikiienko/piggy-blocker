import {useLiveQuery} from 'dexie-react-hooks';
import React from 'react';
import ViewportList from 'react-viewport-list';
import {RU_LIST_DB_NAME, VIDEOS_DB_KEYS} from '../../../common/consts';
import {db} from '../../../commonBackground/db';
import {Button} from '../../../commonBackground/StyledElements/Button/Button';
import "./Stats.css"
import {ListItem} from './ListItem';

export const Stats = () => {
    const recentRuList = useLiveQuery(() =>
            db[RU_LIST_DB_NAME]
                .where(VIDEOS_DB_KEYS.timeWhenBlocked)
                .above(Date.now() - 1000 * 60 * 60)
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
            <h2 className="main-title">Остання година:</h2>
            <span className="recent-found-total">Знайдено рос. відео: {recentRuList.length}</span>
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