import React from 'react';
import { useSelector } from "react-redux";
import Timeline from '@mui/lab/Timeline';
import { Grid, Card, Stack, Skeleton, Typography } from '@mui/material';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import theme from 'components/theme';

import TagChip from 'components/TagChip';

const palette = 'home';

const RoadmapTimeLine = () => {
    const { roadmap, asyncStatusRoadmap } = useSelector((store) => store.roadmap);

    return (
        <Timeline
            sx={{
                [`& .${timelineItemClasses.root}:before`]: {
                    flex: 0,
                    padding: 0,
                },
            }}
        >
            {roadmap.nodes.map((node) => (
                <TimelineItem>
                    <TimelineSeparator>
                        <TimelineDot sx={{ bgcolor: theme[palette]['primary'] }} />
                        <TimelineConnector sx={{ bgcolor: theme[palette]['primary'] }} />
                    </TimelineSeparator>
                    <TimelineContent>
                        <Stack direction="row" justifyContent="left" alignItems="center" gap={2}>
                            <Typography variant="h5" fontWeight="bolder" component="div">
                                {node.data.label}
                            </Typography>
                            <Stack direction="row" justifyContent="left" alignItems="center" gap={1}>
                                <TagChip content="資料科學" />
                                <TagChip content="test2" />
                                <TagChip content="test3" />
                            </Stack>
                        </Stack>
                        <Typography pt={2}>{node.data.description}</Typography>
                    </TimelineContent>
                </TimelineItem>
            ))}
            {/* <TimelineItem>
                <TimelineSeparator>
                    <TimelineDot sx={{ bgcolor: theme[palette]['primary'] }} />
                    <TimelineConnector sx={{ bgcolor: theme[palette]['primary'] }} />
                </TimelineSeparator>
                <TimelineContent>Code</TimelineContent>
            </TimelineItem> */}
        </Timeline>
    )
}

export default RoadmapTimeLine
