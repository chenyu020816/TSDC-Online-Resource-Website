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

const initialNodes = [
    {
        "id": "1",
        "type": "custom",
        "position": {
            "x": 0,
            "y": 0
        },
        "data": {
            "row": 0,
            "label": "基礎數學與統計",
            "technologies": "線性代數、機率、微積分",
            "description": "深度學習需要扎實的數學基礎。學習線性代數可以幫助理解張量操作，機率與統計是理解模型和算法的重要基礎。"
        },
        "connectable": false
    },
    {
        "id": "2",
        "type": "custom",
        "position": {
            "x": 400,
            "y": 0
        },
        "data": {
            "row": 0,
            "label": "程式語言與工具",
            "technologies": "Python、NumPy、Pandas",
            "description": "Python 是深度學習最常用的程式語言。學習 Python 及其數值操作庫 NumPy 和資料分析庫 Pandas 是必不可少的。"
        },
        "connectable": false
    },
    {
        "id": "3",
        "type": "custom",
        "position": {
            "x": 800,
            "y": 0
        },
        "data": {
            "row": 0,
            "label": "深度學習基礎",
            "technologies": "深度學習、神經網路、機器學習",
            "description": "掌握深度學習的基本概念和神經網路結構。理解基本的機器學習概念有助於將它們應用於深度學習中。"
        },
        "connectable": false
    },
    {
        "id": "4",
        "type": "custom",
        "position": {
            "x": 1200,
            "y": 250
        },
        "data": {
            "row": 1,
            "label": "深度學習框架",
            "technologies": "TensorFlow、PyTorch、Keras",
            "description": "熟練掌握主流的深度學習框架如 TensorFlow、PyTorch 或 Keras。這些工具可以幫助快速構建和訓練深度學習模型。"
        },
        "connectable": false
    },
    {
        "id": "5",
        "type": "custom",
        "position": {
            "x": 800,
            "y": 250
        },
        "data": {
            "row": 1,
            "label": "模型優化與調參",
            "technologies": "梯度下降、超參數調優、交叉驗證",
            "description": "學習模型優化技術如梯度下降，並掌握常見的超參數調優方法和交叉驗證技術，以提升模型性能。"
        },
        "connectable": false
    },
    {
        "id": "6",
        "type": "custom",
        "position": {
            "x": 400,
            "y": 250
        },
        "data": {
            "row": 1,
            "label": "應用與實戰",
            "technologies": "自然語言處理 (NLP)、電腦視覺、強化學習",
            "description": "選擇感興趣的應用領域如自然語言處理、電腦視覺或強化學習，並實踐相關項目，將所學的知識應用在實際問題中。"
        },
        "connectable": false
    }
];

const RoadmapTimeLine = () => {
    const { roadmap, asyncStatusRoadmap } = useSelector((store) => store.roadmap);
    const [nodes, setNodes] = React.useState(initialNodes);

    React.useEffect(() => {
        if (asyncStatusRoadmap.loading) return;

        setNodes(roadmap['nodes'])
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
            {nodes.map((node, index) => (
                <TimelineItem key={index}>
                    <TimelineSeparator>
                        <TimelineDot sx={{ bgcolor: theme[palette]['primary'] }} />
                        <TimelineConnector sx={{ bgcolor: theme[palette]['primary'] }} />
                    </TimelineSeparator>
                    <TimelineContent>
                        <Stack direction="row" justifyContent="left" alignItems="center" gap={3}>
                            <Typography variant="h5" fontWeight="bolder" component="div">
                                {node.data.label}
                            </Typography>
                            <Stack direction="row" justifyContent="left" alignItems="center" gap={2}>
                                {node.data.technologies.split("、").map((technique, index) => (
                                    <TagChip content={technique} key={index} />
                                ))}
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
