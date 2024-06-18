import React from 'react';
import { css } from '@emotion/css/macro';
import { motion } from 'framer-motion';
import { Link } from '@mui/material';

import theme from 'components/theme';

const palette = 'home';

const StartButton = () => {
  return (
    <motion.div whileHover={{ scale: 1 }} whileTap={{ scale: 0.9 }}>
      <Link href="./login" underline="none">
        <button className={buttonStyle(theme[palette])}>
          START FREE
        </button>
      </Link>
    </motion.div>
  )
}

export default StartButton

const buttonStyle = (palette) => css`
  position: relative;
  height: 45px;
  width: 180px;
  font-size: 20px;
  font-weight: 500;
  letter-spacing: 1px;
  border-radius: 8px;
  text-transform: uppercase;
  border: 2px solid transparent;
  outline: none;
  cursor: pointer;
  background: transparent;
  overflow: hidden;
  transition: 0.6s;

&:last-child{
  color: ${palette['primary']};
  border-color: ${palette['primary']};
}

&:before, &:after{
  position: absolute;
  content: '';
  left: 0;
  top: 0;
  height: 100%;
  filter: blur(30px);
  opacity: 0.4;
  transition: 0.6s;
}

&:before{
  width: 60px;
  background: rgba(255,255,255,0.6);
  transform: translateX(-130px) skewX(-45deg);
}

&:after{
  width: 30px;
  background: rgba(255,255,255,0.6);
  transform: translateX(-130px) skewX(-45deg);
}

&:hover:before,
&:hover:after{
  opacity: 0.6;
  transform: translateX(320px) skewX(-45deg);
}
&:hover{
  color: ${palette['light']};
}

&:hover:last-child{
  background: ${palette['primary']};
}

`