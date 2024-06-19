import React from 'react';
import { css } from '@emotion/css/macro';

const Background = () => {
        return (
                <div className={style()}>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                </div>
        )
}

export default Background

const style = () => css`
position: fixed;
width: 100vw;
height: 100vh;
top: 0;
left: 0;
background: #ffffff;
overflow: hidden;
z-index: -1;

span{
    width: 5vmin;
    height: 5vmin;
    border-radius: 9vmin;
    backface-visibility: hidden;
    position: absolute;
    animation: move;
    animation-duration: 42;
    animation-timing-function: linear;
    animation-iteration-count: infinite;  

    &:nth-child(1) {
        color: #a4b2f5;
        top: 34%;
        left: 70%;
        animation-duration: 32s;
        animation-delay: -13s;
        transform-origin: -6vw 2vh;
        box-shadow: 18vmin 0 2.3136943320392507vmin currentColor;
    }

    &:nth-child(2) {
        color: #3161c7;
        top: 42%;
        left: 79%;
        animation-duration: 39s;
        animation-delay: -36s;
        transform-origin: -22vw -16vh;
        box-shadow: 18vmin 0 2.5820599127780817vmin currentColor;
    }

    &:nth-child(3) {
        color: #5276c4;
        top: 56%;
        left: 10%;
        animation-duration: 67s;
        animation-delay: -12s;
        transform-origin: 25vw 17vh;
        box-shadow: -18vmin 0 3.2463495517196406vmin currentColor;
    }

    &:nth-child(4) {
        color: #92b1f3;
        top: 40%;
        left: 7%;
        animation-duration: 37s;
        animation-delay: -48s;
        transform-origin: 20vw 0vh;
        box-shadow: -18vmin 0 3.09482923179933vmin currentColor;
    }

    &:nth-child(5) {
        color: #627baf;
        top: 50%;
        left: 62%;
        animation-duration: 48s;
        animation-delay: -23s;
        transform-origin: 23vw 10vh;
        box-shadow: -18vmin 0 2.837421321323123vmin currentColor;
    }
}

@keyframes move {
    100% {
        transform: translate3d(0, 0, 1px) rotate(360deg);
    }
}

`