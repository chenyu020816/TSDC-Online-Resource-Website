import React from 'react';
import { css } from '@emotion/css/macro';
import { Box, Grid, Skeleton } from '@mui/material';
import { useSelector } from "react-redux";
import { motion } from 'framer-motion';
import CourseCard from 'pages/Home/components/Course/CourseCard';
import theme from 'components/theme';

const palette = 'home';

const CourseRecommend = ({ courseList, tabs }) => {
    const [activeTab, setActiveTab] = React.useState(tabs[0] ? tabs[0].id : "Hahow");
    const courseDataList = Object.values(courseList).filter(item => item.domain === activeTab)[0];

    React.useEffect(() => {
        console.log(activeTab);
        console.log(courseList);
        console.log(Object.values(courseList).filter(item => item.domain === "Hahow")[0]);
    }, [tabs])

    return (
        <div className={style(theme[palette])}>
            <Grid container pt={7} direction="column" alignItems="center">
                <div className="button-container">
                    {!tabs[0] ? (
                        [1, 2, 3].map((index) => (
                            <Grid item key={index} >
                                <Skeleton variant="rounded" className='button' width={95} height={40} />
                            </Grid>
                        ))
                    ) : (tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={activeTab === tab.id ? 'active' : ''}
                        >
                            {activeTab === tab.id && (
                                <motion.span
                                    layoutId="bubble"
                                    className="bubble"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            {tab.label}
                        </button>
                    )))}
                </div>
            </Grid>
            <Grid container py={5} px={1} component={motion.div}
                variants={containerVariants} initial="hidden" animate="visible">
                {!courseDataList ? (
                    [1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
                        <Grid item key={index} xs={12} sm={6} md={4} xl={3} px={1} pb={1}>
                            <Skeleton variant="rounded" width="100%" height={300} />
                        </Grid>
                    ))
                ) : (courseDataList.courses.map((item, index) => (
                    <Grid item key={index} xs={12} sm={6} md={4} xl={3} px={1} pb={1}
                        component={motion.div}
                        variants={itemVariants(index)}
                    >
                        <CourseCard data={item} />
                    </Grid>
                )))}
            </Grid>
        </div>
    );
};

export default CourseRecommend;

const style = (palette) => css`
    .button-container {
        display: flex;
        gap: 0.5rem;
    }

    button {
        position: relative;
        border-radius: 9999px;
        padding: 0.75rem 1.5rem;
        font-size: 0.875rem;
        font-weight: 500;
        z-index: 11;
        color: ${palette['primary']};
        transition: color 0.2s;
        background: transparent;
        border: none;
        cursor: pointer;
    }

    .button{
        border-radius: 9999px;
    }

    .active {
        color: ${palette['light']};
    }

    .bubble {
        position: absolute;
        inset: 0;
        z-index: -1;
        background: ${palette['primary']};
        border-radius: 9999px;
    }
`;

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = (index) => ({
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3, delay: index * 0.1 } // 根據索引設置延遲
    }
});