import React, { useCallback } from 'react';
import { useSelector } from "react-redux";
import { Grid, Card, CardContent, Skeleton, Box } from '@mui/material';
import { Typography } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material';
import ReactFlow, {
    addEdge,
    MiniMap,
    Controls,
    Background,
    useReactFlow,
    ReactFlowProvider,
    useNodesState,
    useEdgesState,
    Handle,
    Position,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { ASYNC_STATUS_LOADED, ASYNC_STATUS_LOADING } from 'utils/asyncStatus.constants';
import theme from 'components/theme';

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

const initialEdges = [
    {
        "id": "e1-2",
        "source": "1",
        "target": "2",
        "type": "smoothstep"
    },
    {
        "id": "e2-3",
        "source": "2",
        "target": "3",
        "type": "smoothstep"
    },
    {
        "id": "e3-4",
        "source": "3",
        "target": "4",
        "type": "smoothstep"
    },
    {
        "id": "e4-5",
        "source": "4",
        "target": "5",
        "type": "smoothstep"
    },
    {
        "id": "e5-6",
        "source": "5",
        "target": "6",
        "type": "smoothstep"
    }
];

const CustomNodeComponent = ({ data }) => {
    const isEvenRow = data.row % 2 === 0;

    return (
        <div style={{ background: 'white', boxShadow: "0px 0px 15px 0px rgba(0, 0, 0, 0.15)", padding: '15px 25px', borderRadius: '10px', width: '250px' }}>
            <Typography component="div" variant="h6" color={theme[palette]['primary']} target="_blank" fontWeight="bolder">
                {data.label}
            </Typography>
            <Typography component="span" variant="subtitle2" target="_blank" fontWeight={600} color="gray">
                {data.technologies}
            </Typography>
            <Handle type="source" position={!isEvenRow ? Position.Left : Position.Right} />
            <Handle type="target" position={!isEvenRow ? Position.Right : Position.Left} />
        </div>
    );
};



const UserTagHistoryCard = () => {
    const { roadmap, asyncStatusRoadmap } = useSelector((store) => store.roadmap);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    React.useEffect(() => {
        if (asyncStatusRoadmap.loading) return;

        setNodes(roadmap['nodes'])
        setEdges(roadmap['edges'])
    }, [roadmap])

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    const nodeTypes = React.useMemo(() => ({ custom: CustomNodeComponent }), []);

    return (
        <ThemeProvider theme={cardtheme}>
            <Card sx={{ width: '100%', height: 420 }}>
                <CardContent>
                    <Grid container style={{ height: 400 }}>
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            nodeTypes={nodeTypes}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onConnect={onConnect}
                            nodesConnectable={false}
                            fitView
                        >
                            <Controls />
                            {/* <MiniMap /> */}
                            <Background variant="dots" gap={12} size={1} />
                        </ReactFlow>
                    </Grid>
                </CardContent>
            </Card>
        </ThemeProvider>
    )
}

export default UserTagHistoryCard


const cardtheme = createTheme({
    components: {
        // Name of the component
        MuiCard: {
            styleOverrides: {
                // Name of the slot
                root: {
                    borderRadius: "0px",
                    boxShadow: "0px 0px 15px 0px rgba(0, 0, 0, 0)"
                },
            },
        },
    },
});