import React from 'react';
import store from "redux/store";
import { useSelector } from "react-redux";
import Timeline from '@mui/lab/Timeline';
import { Grid, Box, Stack, Skeleton, Typography } from '@mui/material';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import theme from 'components/theme';
import CourseCardRoadMap from 'pages/Home/components/Course/CourseCardRoadMap';
import useGetCrawlerCourse from 'hook/useGetCrawlerCourse';
import * as resourceAPIs from 'apis/resource';

import TagChip from 'components/TagChip';
import RecommendResourseSlide from 'pages/Home/components/Roadmap/RecommendResourseSlide';

const palette = 'home';

const RoadmapTimeLine = () => {
    const user_id = localStorage.getItem('YFCII_USER_ID');
    const { roadmap, asyncStatusRoadmap } = useSelector((store) => store.roadmap);
    const { keyword, asyncStatusGetKeyword } = useSelector((store) => store.keyword);
    const [nodes, setNodes] = React.useState();

    const roadmap_domain = roadmap['nodes'].map(item => item.data.label);
    const transformedRoadMapData = roadmap['nodes'].map(item => ({
        label: item.data.label,
        technologies: item.data.technologies
    }));

    const handleRecodeRoadmap = () => {
        store.dispatch({ type: "GET_TABLE_LOADING" })
        if (!user_id || !keyword || !roadmap_domain || !transformedRoadMapData) return;
        let json_data = {
            'user_id': user_id,
            'keyword': keyword,
            'roadmap_domain': roadmap_domain,
            'roadmap': transformedRoadMapData
        }
        resourceAPIs.recordUserKeyword(json_data).then((res) => {
            store.dispatch({ type: "GET_TABLE_LOADED", payload: res['data']['data'] })
        })
    }

    React.useEffect(() => {
        if (asyncStatusRoadmap.loading) return;
        handleRecodeRoadmap();
    }, [roadmap])

    return (
        <Timeline
            sx={{
                [`& .${timelineItemClasses.root}:before`]: {
                    flex: 0,
                    padding: 0,
                },
            }}
        >
            {!asyncStatusRoadmap.loading ? (
                roadmap['nodes'].map((node, index) => (
                    <TimelineItem key={index}>
                        <TimelineSeparator>
                            <TimelineDot sx={{ bgcolor: theme[palette]['primary'] }} />
                            <TimelineConnector sx={{ bgcolor: theme[palette]['primary'] }} />
                        </TimelineSeparator>
                        <TimelineContent style={{ width: '100%' }}>
                            <Stack direction="row" justifyContent="left" alignItems="center" gap={3}>
                                {!asyncStatusRoadmap.loading ? (
                                    <Typography variant="h5" fontWeight="bolder" component="div">
                                        {node.data.label}
                                    </Typography>
                                ) : (
                                    <Skeleton variant="rounded" className='button' width={300} height={30} />
                                )}
                                <Stack direction="row" justifyContent="left" alignItems="center" gap={2}>
                                    {!asyncStatusRoadmap.loading ? (
                                        node.data.technologies.split("、").map((technique, index) => (
                                            <TagChip content={technique} key={index} />
                                        ))
                                    ) : (
                                        [1, 2, 3].map((index) => (
                                            <Grid item key={index} >
                                                <Skeleton variant="rounded" className='button' width={80} height={30} />
                                            </Grid>
                                        ))
                                    )}
                                </Stack>
                            </Stack>
                            {!asyncStatusRoadmap.loading ? (
                                <Typography pt={2}>{node.data.description}</Typography>
                            ) : (
                                <Grid item pt={2}>
                                    <Skeleton variant="rounded" className='button' width="100%" height={50} />
                                </Grid>
                            )}
                            <RecommendResourseSlide data={node.data.technologies.split("、")} index={index} />
                        </TimelineContent>
                    </TimelineItem>
                ))
            ) : (
                [1, 2, 3, 4, 5].map((node, index) => (
                    <TimelineItem key={index}>
                        <TimelineSeparator>
                            <TimelineDot sx={{ bgcolor: theme[palette]['primary'] }} />
                            <TimelineConnector sx={{ bgcolor: theme[palette]['primary'] }} />
                        </TimelineSeparator>
                        <TimelineContent style={{ width: '100%' }}>
                            <Stack direction="row" justifyContent="left" alignItems="center" gap={3}>
                                <Skeleton variant="rounded" className='button' width={300} height={30} />
                                <Stack direction="row" justifyContent="left" alignItems="center" gap={2}>
                                    {[1, 2, 3].map((index) => (
                                        <Grid item key={index} >
                                            <Skeleton variant="rounded" className='button' width={80} height={30} />
                                        </Grid>
                                    ))}
                                </Stack>
                            </Stack>
                            <Grid item pt={2}>
                                <Skeleton variant="rounded" className='button' width="100%" height={50} />
                            </Grid>
                            {/* <RecommendResourseSlide data={node} index={index}/> */}
                        </TimelineContent>
                    </TimelineItem>
                ))
            )}
        </Timeline>
    )
}

export default RoadmapTimeLine
