import React from 'react';
import {CHECKED_VIDEOS_DB_KEYS} from '../../../common/consts';
import {getReadableDate} from '../../../common/utils';
import {Link} from '../../../commonBackground/StyledElements/Link/Link';
import './ListItem.css';


export const ListItem = ({listItem, index}) => {
    return (
        <div className="list-item-container">
            <div className="list-item-block-details">
                <span className="list-item-index">{index + 1}.) </span>
                <span
                    title={chrome.i18n.getMessage('list_item_time_analyzed_help')}>{getReadableDate(listItem[CHECKED_VIDEOS_DB_KEYS.timeWhenBlocked])}</span>
                <span
                    title={chrome.i18n.getMessage('list_item_detect_reason_help')}
                    className="list-item-block-reason"
                >
                    {listItem[CHECKED_VIDEOS_DB_KEYS.reason]}&nbsp;
                    {listItem?.[CHECKED_VIDEOS_DB_KEYS.reasonDetails] ? `(${listItem?.[CHECKED_VIDEOS_DB_KEYS.reasonDetails]})` : ''}
                </span>
                <span title={chrome.i18n.getMessage('list_item_video_id_help')}
                      className="list-item-yt-id">{listItem[CHECKED_VIDEOS_DB_KEYS.ytId]}</span>
            </div>
            <Link
                href={listItem[CHECKED_VIDEOS_DB_KEYS.link]}
                text={listItem[CHECKED_VIDEOS_DB_KEYS.title]}
            />
            <span className="list-item-channel-name">
                - {listItem[CHECKED_VIDEOS_DB_KEYS.channelName] || chrome.i18n.getMessage('list_item_short_video')}
            </span>
        </div>
    );
};