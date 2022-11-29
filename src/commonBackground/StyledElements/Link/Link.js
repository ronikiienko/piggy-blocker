import React from 'react';
import PropTypes from 'prop-types';
import './Link.css'

export const Link = ({href, text}) => {
    return (
        <a className="link" href={href}>{text}</a>
    );
};

Link.propTypes = {
    href: PropTypes.string,
    text: PropTypes.string
};
