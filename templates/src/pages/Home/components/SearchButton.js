import React from 'react';
import { useSelector } from "react-redux";
import { css } from '@emotion/css/macro';
import { motion } from 'framer-motion';
import { Link } from '@mui/material';

import theme from 'components/theme';
import useGetCrawlerCourse from 'hook/useGetCrawlerCourse';

const palette = 'home';

const StartButton = () => {
    const { handleGetHahowList, handleGetCourseraList, handleGetAllCourses } = useGetCrawlerCourse();
    const { keyword, asyncStatusGetKeyword } = useSelector((store) => store.keyword);

    React.useEffect(() => {
        console.log(keyword);
    }, [keyword]);

    const handleClick = async (event) => {
        event.preventDefault();
        console.log(keyword);
        //handleGetHahowList(keyword);
        //handleGetCourseraList(keyword);
        await handleGetAllCourses(keyword);
    };

    return (
        <motion.div whileHover={{ scale: 1 }} whileTap={{ scale: 0.9 }}>
            <button className={buttonStyle(theme[palette])} onClick={handleClick}>
                Search
            </button>
        </motion.div>
    )
}

export default StartButton

const buttonStyle = (palette) => css`
  position: relative;
  height: 40px;
  width: 120px;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 1px;
  border-radius: 8px;
  text-transform: uppercase;
  color: white; 
  border: 2px solid ${palette['primary']};
  outline: none;
  cursor: pointer;
  background: ${palette['primary']};
  overflow: hidden;
  transition: 0.6s;


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
  transform: scale(1.1);
  color: ${palette['light']};
}

&:hover:last-child{
  background: ${palette['primary']};
}

`