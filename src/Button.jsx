import styled from 'react-emotion';

import { ShadowItem, TitleFont } from './common-styles';

export default styled('a')`
    ${TitleFont};
    background-color: ${props => props.background};
    padding: 16px 32px;
    color: white;
    display: inline-block;
    margin-top: 8px;
    text-decoration: none;
    text-transform: uppercase;
    /* Todo fix this */
    font-size: 16px;
    line-height: 20px;
    font-weight: bold;
    min-width: 180px;
    text-align: center;
    ${ShadowItem({ radius: 26 })};

    :hover {
        transform: scale(1.05);
        opacity: 0.9;
    }

    :active {
        opacity: 1;
        transform: scale(0.95);
        background: ${props => props.selectedBackground};
    }
`;
