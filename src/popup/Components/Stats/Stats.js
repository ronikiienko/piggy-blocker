import {useLiveQuery} from 'dexie-react-hooks';
import React from 'react';
import {RU_LIST_DB_NAME, VIDEOS_DB_KEYS} from '../../../common/consts';
import {db} from '../../../commonBackground/db';
import {Button} from '../../../commonBackground/StyledElements/Button/Button';


export const Stats = () => {
    const recentRuList = useLiveQuery(() =>
            db[RU_LIST_DB_NAME]
                .where(VIDEOS_DB_KEYS.timeWhenBlocked)
                .above(Date.now() - 1000 * 60 * 60)
                .toArray(),
        [],
        []
    )
    return (
        <div>
            <Button
                style={{width: '100%', margin: 'auto', marginTop: '10px'}}
                onClick={() => {open(chrome.runtime.getURL('stats/index.html'), "_blank")}}
            >
                Детальна статистика тут
            </Button>
            <h2>Остання година:</h2>
            <p>Знайдено рос. відео: {recentRuList.length}</p>
        </div>
    );
};