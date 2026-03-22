import { useState, useCallback, useEffect } from 'react';
import { 
    ReactFlow, 
    useNodesState,
    useEdgesState,
    addEdge,
    Background, 
    Controls 
} from '@xyflow/react';
import { Box, Button, TextField, Typography, Stack } from '@mui/material';
import '@xyflow/react/dist/style.css';
import { ContentLayout } from '@/components/layout';

import ExampleCustomNode from '@patient-flows/components/ui/ExampleCustomNode';
import {RegistrationNode, ReactivationNode, DeactivationNode} from '@patient-flows/components/ui/LifecycleNodes';
import { DiagnosisNode, TreatmentNode, AppointmentNode, ClinicalDocumentNode} from '@patient-flows/components/ui/ClinicalEventNode';
const nodeTypes = {
  textUpdater: ExampleCustomNode, 
  REGISTRATION: RegistrationNode,
  DEACTIVATION: DeactivationNode,
  REACTIVATION: ReactivationNode,
  DIAGNOSIS: DiagnosisNode,
  TREATMENT: TreatmentNode,
  APPOINTMENT: AppointmentNode,
  CLINICAL_DOCUMENT: ClinicalDocumentNode,
};

const initialNodes = [
  {
    id: 'node-1',
    type: 'textUpdater',
    position: { x: 0, y: 0 },
    data: { value: 123 },
  },
];

export default function PatientFlow({ flow }) {
    const [nodes, setNodes, onNodesChange] = useNodesState(flow?.nodes || []);
    const [edges, setEdges, onEdgesChange] = useEdgesState(flow?.edges || []);
    
    // We only store the ID of the selected node, and derive the rest from the `nodes` array.
    // This prevents our sidebar state from falling out of sync with the canvas state

    const [selectedNodeId, setSelectedNodeId] = useState(null);
    const selectedNode = nodes.find(n => n.id === selectedNodeId) || null;
    useEffect(() => {
        setNodes((nds)=>
            nds.map(
                (nd) => {
                    return {
                        ...nd,
                        data: {
                            title: "asdfjpaoisdfj"
                        }
                    }
                }
            )
        )
        if (flow) {
            setNodes(flow.nodes);
            setEdges(flow.edges || []);
        }
    }, [flow, setNodes, setEdges]);

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    const onNodeClick = useCallback((event, node) => {
        setSelectedNodeId(node.id);
    }, []);

    const onPaneClick = useCallback(() => {
        setSelectedNodeId(null);
    }, []);

    const handleLabelChange = (e) => {
        const newLabel = e.target.value;
        
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === selectedNodeId) {
                    return { ...node, data: { ...node.data, label: newLabel } };
                }
                return node;
            })
        );
    };

    const handleSave = () => {
        console.log("Ready to save to backend:", { nodes, edges });
        // TODO: save changes 
    };

    return (
        <ContentLayout>
            <Box sx={{ display: 'flex', gap: 2, height: '600px', width: '100%' }}>
                <Box sx={{ flexGrow: 1, border: '1px solid black', position: 'relative' }}>
                    <Button 
                        onClick={handleSave} 
                        variant="contained" 
                        sx={{ position: 'absolute', top: 10, right: 10, zIndex: 4 }}
                    >
                        Guardar Flujo
                    </Button>
                    
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onNodeClick={onNodeClick}
                        onPaneClick={onPaneClick}
                        nodeTypes={nodeTypes}
                        fitView
                    >
                        <Background color="#ccc" gap={16} />
                        <Controls />
                    </ReactFlow>
                </Box>

                {selectedNode && (
                    <Box sx={{ width: '300px', border: '1px solid #ccc', p: 2, borderRadius: 1, bgcolor: 'background.paper' }}>
                        <Typography variant="h6" gutterBottom>
                            Edit Step
                        </Typography>
                        <Stack spacing={2}>
                            <Typography variant="body2" color="text.secondary">
                                Node ID: {selectedNode.id}
                            </Typography>
                            <TextField
                                label="Step Name (Label)"
                                value={selectedNode.data?.label || ''}
                                onChange={handleLabelChange}
                                fullWidth
                                size="small"
                            />
                        </Stack>
                    </Box>
                )}
            </Box>
        </ContentLayout>
    );
}