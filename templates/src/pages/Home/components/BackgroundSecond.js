import React from 'react';
import { css } from '@emotion/css/macro';

const BackgroundSecond = () => {
    return (
        <div className={style()}>
            <div></div>
            <div></div>
        </div>
    )
}

export default BackgroundSecond

const style = () => css`
position: absolute;
overflow: hidden;
width: 100%;
height: 100%;
top: 0;
left: 0;
background: linear-gradient(to right, #FEFAF4, #FEFAF4);
display: flex;
flex-grow: 1;
z-index: -1;

div {
    position: absolute;
    border-radius: 100%;
    height: 0;
    opacity: 0.15;
    filter: blur(150px);
    
    &:nth-child(1) {
        background: rgb(254, 206, 111);
        width: 60%;
        padding-top: 60%;
        left: 0%;
        bottom: 0%;
        transform: translateX(-25%) translateY(30%);
    }

    &:nth-child(2) {
        background: rgb(254, 206, 111);
        width: 60%;
        padding-top: 60%;
        right: 0%;
        top: 0%;
        transform: translateX(30%) translateY(-30%);
    }
}

@keyframes move {
    100% {
        transform: translate3d(0, 0, 1px) rotate(360deg);
    }
}

`