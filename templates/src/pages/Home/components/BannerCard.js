import React, { useCallback } from 'react';
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

const initialEdges = [
    { id: 'e1-2', source: '1', target: '2', type: 'smoothstep' },
    { id: 'e2-3', source: '2', target: '3', type: 'smoothstep' },
];

const CustomNodeComponent = ({ data }) => {
    return (
        <div style={{ background: 'white', boxShadow: "0px 0px 15px 0px rgba(0, 0, 0, 0.15)", padding: '15px 25px', borderRadius: '10px', width: '250px' }}>
            <Typography component="div" variant="h6" color={theme[palette]['primary']} target="_blank" fontWeight="bolder">
                {data.label}
            </Typography>
            <Typography component="span" variant="subtitle2" target="_blank" fontWeight={600} color="gray">
                {data.technologies}
            </Typography>
            <Handle type="source" position={Position.Right} />
            <Handle type="target" position={Position.Left} />
        </div>
    );
};



const UserTagHistoryCard = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    const nodeTypes = React.useMemo(() => ({ custom: CustomNodeComponent }), []);

    return (
        <ThemeProvider theme={cardtheme}>
            <Card sx={{ width: '100%', height: 520 }}>
                <CardContent>
                    <Grid container style={{ height: 500 }}>
                        {/* <Grid item>
                            <Typography variant="h6" component="div" fontWeight="fontWeightBold">
                                旅遊標籤
                            </Typography>
                        </Grid> */}
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
                    borderRadius: "10px",
                    boxShadow: "0px 0px 15px 0px rgba(0, 0, 0, 0.15)"
                },
            },
        },
    },
});