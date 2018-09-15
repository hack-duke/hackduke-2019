import React from 'react';

import { css } from 'emotion';
import styled from 'react-emotion';
import AnchorLink from 'react-anchor-link-smooth-scroll';
import detectPassiveEvents from 'detect-passive-events';
import memoize from 'memoize-one';

import { MAX_WIDTH, HideOnMobile, TitleFont } from '../common-styles';

const navHeightPx = 72;
const fullShadowScrollOffset = navHeightPx;

const navStyle = css`
    ${HideOnMobile};
    ${TitleFont};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: ${navHeightPx}px;
    z-index: 64;

    :after {
        position: absolute;
        content: '';
        top: 0;
        left: 0;
        right: 0;
        width: 100%;
        height: ${navHeightPx}px;
        background-color: white;
        z-index: -1;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.0333),
            0 0 40px rgba(0, 0, 0, 0.075);
    }
`;

const navBackgroundOpacity = backgroundOpacity => css`
    :after {
        opacity: ${backgroundOpacity};
    }
}
`;

const NavItemsWrapper = styled('div')`
    max-width: ${MAX_WIDTH};
    margin: 0 auto;
    padding-left: 144px;
    height: 100%;
`;

const navItem = ({ active, color }) => css`
    ${TitleFont};
    color: ${active ? color : '#2b2b2b'};
    height: 100%;
    font-size: 1.1em;
    line-height: ${navHeightPx}px;
    font-weight: bold;
    display: inline-block;
    margin-right: 50px;
    text-align: center;
    border-bottom: ${active ? 6 : 0}px solid ${active ? color : 'transparent'};
    transition: color 0.2s, border-bottom 0.2s;
    cursor: pointer;
    text-decoration: none;

    :hover {
        color: ${color};
        border-bottom: 6px solid ${color};
    }
`;

class NavContents extends React.PureComponent {
    render() {
        const { activeItemID, navItems } = this.props;
        return (
            <NavItemsWrapper>
                {navItems.map(({ title, id, titleColor }) => (
                    <AnchorLink
                        offset={navHeightPx / 2}
                        key={id}
                        css={navItem({
                            active: activeItemID === id,
                            color: titleColor
                        })}
                        href={`#${id}`}
                    >
                        {title}
                    </AnchorLink>
                ))}
            </NavItemsWrapper>
        );
    }
}

export default class Navbar extends React.PureComponent {
    state = { activeItemID: this.props.navItems[0].id, scrollOffset: 0 };

    componentDidMount() {
        this.handleScroll();
        window.addEventListener(
            'scroll',
            this.handleScroll,
            detectPassiveEvents.hasSupport ? { passive: true } : false
        );
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    render() {
        const { activeItemID, scrollOffset } = this.state;
        return (
            <div
                // Optimization - only recompute opacity style on scroll
                className={[
                    navStyle,
                    navBackgroundOpacity(
                        Math.min(scrollOffset, fullShadowScrollOffset) /
                            fullShadowScrollOffset
                    )
                ].join(' ')}
            >
                <NavContents activeItemID={activeItemID} {...this.props} />
            </div>
        );
    }

    getItemRefNodes = memoize(navItems =>
        navItems.map(({ id }) => [id, document.getElementById(id)])
    );

    handleScroll = () => {
        this.setState({
            scrollOffset: window.scrollY
        });

        for (const [id, itemRefNode] of [
            ...this.getItemRefNodes(this.props.navItems)
        ].reverse()) {
            const { top } = itemRefNode.getBoundingClientRect();
            if (top < navHeightPx) {
                this.setState({ activeItemID: id });
                break;
            }
        }
    };
}
