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

/* const initialNodes = [
    {
        id: '1',
        type: 'custom',
        position: { x: 0, y: 0 },
        data: {
            label: '基礎數學與統計',
            technologies: '線性代數、微積分、機率論、統計學',
        },
        connectable: false,
    },
    {
        id: '2',
        type: 'custom',
        position: { x: 400, y: 0 },
        data: {
            label: '程式語言基礎',
            technologies: 'Python、R',
        },
        connectable: false,
    },
    {
        id: '3',
        type: 'custom',
        position: { x: 800, y: 0 },
        data: {
            label: '資料處理與清洗',
            technologies: 'Pandas、Numpy、正規表達式、資料清洗技術',
        },
        connectable: false,
    },
];
 */
/* const initialEdges = [
    { 'id': 'e1-2', 'source': '1', 'target': '2', 'type': 'smoothstep' },
    { 'id': 'e2-3', 'source': '2', 'target': '3', 'type': 'smoothstep' },
]; */

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
            "technologies": "線性代數、微積分、機率論、統計學",
            "description": "熟悉數學和統計基礎概念，這些是機器學習算法的基礎。"
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
            "label": "程式語言基礎",
            "technologies": "Python、R",
            "description": "學習Python和R，這些是機器學習中最常用的程式語言。"
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
            "label": "資料處理與清洗",
            "technologies": "Pandas、Numpy",
            "description": "學習如何使用Pandas和Numpy進行資料清洗和處理，以便為模型提供乾淨的數據。"
        },
        "connectable": false
    },
    {
        "id": "4",
        "type": "custom",
        "position": {
            "x": 1200,
            "y": 0
        },
        "data": {
            "row": 0,
            "label": "資料視覺化",
            "technologies": "Matplotlib、Seaborn",
            "description": "掌握資料視覺化技術，用於理解資料分佈和特徵。"
        },
        "connectable": false
    },
    {
        "id": "5",
        "type": "custom",
        "position": {
            "x": 1200,
            "y": 250
        },
        "data": {
            "row": 1,
            "label": "基礎機器學習算法",
            "technologies": "線性回歸、邏輯迴歸、KNN、決策樹",
            "description": "學習基本的監督學習算法，這些是構建更複雜模型的基礎。"
        },
        "connectable": false
    },
    {
        "id": "6",
        "type": "custom",
        "position": {
            "x": 800,
            "y": 250
        },
        "data": {
            "row": 1,
            "label": "無監督學習",
            "technologies": "K-means、主成分分析 (PCA)、協同過濾",
            "description": "理解和應用無監督學習算法，用於資料聚類和降維。"
        },
        "connectable": false
    },
    {
        "id": "7",
        "type": "custom",
        "position": {
            "x": 400,
            "y": 250
        },
        "data": {
            "row": 1,
            "label": "模型評估與優化",
            "technologies": "交叉驗證、F1 Score、混淆矩陣、AUC-ROC",
            "description": "學習如何評估和優化你的模型性能。"
        },
        "connectable": false
    },
    {
        "id": "8",
        "type": "custom",
        "position": {
            "x": 0,
            "y": 250
        },
        "data": {
            "row": 1,
            "label": "進階機器學習算法",
            "technologies": "隨機森林、梯度提升 (GBM)、支持向量機 (SVM)",
            "description": "深入了解並應用更複雜的機器學習算法。"
        },
        "connectable": false
    },
    {
        "id": "9",
        "type": "custom",
        "position": {
            "x": 0,
            "y": 500
        },
        "data": {
            "row": 2,
            "label": "深度學習基礎",
            "technologies": "神經網絡、前饋網絡、反向傳播",
            "description": "理解深度學習的基本概念和神經網絡的基礎。"
        },
        "connectable": false
    },
    {
        "id": "10",
        "type": "custom",
        "position": {
            "x": 400,
            "y": 500
        },
        "data": {
            "row": 2,
            "label": "深度學習框架",
            "technologies": "TensorFlow、Keras、PyTorch",
            "description": "學習使用主流的深度學習框架來建立和訓練模型。"
        },
        "connectable": false
    },
    {
        "id": "11",
        "type": "custom",
        "position": {
            "x": 800,
            "y": 500
        },
        "data": {
            "row": 2,
            "label": "自然語言處理 (NLP)",
            "technologies": "分詞、詞嵌入 (word embeddings)、Transformer、BERT",
            "description": "掌握自然語言處理的基本技術和應用。"
        },
        "connectable": false
    },
    {
        "id": "12",
        "type": "custom",
        "position": {
            "x": 1200,
            "y": 500
        },
        "data": {
            "row": 2,
            "label": "計算機視覺",
            "technologies": "卷積神經網絡 (CNN)、物體檢測 (YOLO, RCNN)、圖像分割",
            "description": "學習計算機視覺的核心技術，用於處理和分析影像數據。"
        },
        "connectable": false
    },
    {
        "id": "13",
        "type": "custom",
        "position": {
            "x": 1200,
            "y": 750
        },
        "data": {
            "row": 3,
            "label": "強化學習",
            "technologies": "Q-Learning、Deep Q-Learning、策略梯度",
            "description": "理解和應用強化學習技術，用於機器學習中的決策問題。"
        },
        "connectable": false
    },
    {
        "id": "14",
        "type": "custom",
        "position": {
            "x": 800,
            "y": 750
        },
        "data": {
            "row": 3,
            "label": "模型部署",
            "technologies": "Flask、FastAPI、Docker、Heroku",
            "description": "學習如何將機器學習模型部署到生產環境中以供實際應用。"
        },
        "connectable": false
    },
    {
        "id": "15",
        "type": "custom",
        "position": {
            "x": 400,
            "y": 750
        },
        "data": {
            "row": 3,
            "label": "實踐專案",
            "technologies": "Kaggle、自定義專案",
            "description": "利用Kaggle等平台進行實際專案練習，熟悉實際應用場景。"
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
    },
    {
        "id": "e6-7",
        "source": "6",
        "target": "7",
        "type": "smoothstep"
    },
    {
        "id": "e7-8",
        "source": "7",
        "target": "8",
        "type": "smoothstep"
    },
    {
        "id": "e8-9",
        "source": "8",
        "target": "9",
        "type": "smoothstep"
    },
    {
        "id": "e9-10",
        "source": "9",
        "target": "10",
        "type": "smoothstep"
    },
    {
        "id": "e10-11",
        "source": "10",
        "target": "11",
        "type": "smoothstep"
    },
    {
        "id": "e11-12",
        "source": "11",
        "target": "12",
        "type": "smoothstep"
    },
    {
        "id": "e12-13",
        "source": "12",
        "target": "13",
        "type": "smoothstep"
    },
    {
        "id": "e13-14",
        "source": "13",
        "target": "14",
        "type": "smoothstep"
    },
    {
        "id": "e14-15",
        "source": "14",
        "target": "15",
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

        console.log(roadmap);
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