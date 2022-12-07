import React from 'react';
import {VIDEOS_DB_KEYS} from '../../../common/consts';
import {getHoursFromDate} from '../../../common/utils';
import {Link} from '../../../commonBackground/StyledElements/Link/Link';
import './ListItem.css';


export const ListItem = ({listItem}) => {
    return (
        <div className="list-item-container">
            <div className="list-item-block-details">
                <span title="Коли відео було аналізовано">{getHoursFromDate(listItem[VIDEOS_DB_KEYS.timeWhenBlocked])}</span>
                <span
                    title="Причина та деталі детекту (якщо результат гугл то буде написано мову яку гугл задетектив, якщо слова, то слово яке було знайдено)"
                    className="list-item-block-reason"
                >
                    {listItem[VIDEOS_DB_KEYS.reason]}&nbsp;
                    {listItem?.[VIDEOS_DB_KEYS.reasonDetails] ? `(${listItem?.[VIDEOS_DB_KEYS.reasonDetails]})` : ''}
                </span>
            </div>
            <Link
                className="list-item-title-link"
                href={listItem[VIDEOS_DB_KEYS.link]}
                text={listItem[VIDEOS_DB_KEYS.title]}
            />
            <span className="list-item-channel-name">
                - {listItem[VIDEOS_DB_KEYS.channelName] || 'Short video'}
            </span>
        </div>
    );
};