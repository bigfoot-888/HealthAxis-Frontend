import { useState, useMemo, useEffect, useCallback } from 'react';
import { ReactFlow, useNodesState, useEdgesState, Background, Controls } from '@xyflow/react';
import { Box } from '@mui/material';
import FlowEventDetail from '@patient-flows/components/ui/FlowEventDetail';
import '@xyflow/react/dist/style.css';

import { ContentLayout } from '@/components/layout';
import BaseFlowNode from '../ui/BaseFlowNode';
import { useReactFlow } from '@xyflow/react';
import CreateSecondaryNodeForm from '@patient-flows/components/forms/CreateSecondaryNodeForm';
import DeleteSecondaryNodeDialog from '../dialogs/DeleteSecondaryNodeDialog';
import { handleApiError } from '@/utils/handle-errors';

import { useSnackbar } from '@/app/SnackBarContext';

import { deleteFlowEvent } from '@patient-flows/api/patient-flow-api';

const nodeTypes = {
    PATIENT: BaseFlowNode,
    DIAGNOSIS: BaseFlowNode,
    TREATMENT: BaseFlowNode,
    APPOINTMENT: BaseFlowNode,
    CLINICAL_DOCUMENT: BaseFlowNode,
    OTHER: BaseFlowNode,
};

function FlowViewportSync({ selectedNode }) {
    const { setCenter } = useReactFlow();

    useEffect(() => {
        if (!selectedNode) return;
        
        // Add short timeout so that the viewport changes when showing a node's detail
        // to the node from centering based on the full size
        const timeout = setTimeout(() => {
            const x = (selectedNode.positionAbsoluteX ?? selectedNode.position.x) + 90;
            const y = (selectedNode.positionAbsoluteY ?? selectedNode.position.y) + 40;

            setCenter(x, y, {
                zoom: 1,
                duration: 300,
            });
        }, 50); 
        return () => clearTimeout(timeout);

    }, [selectedNode, setCenter]);

    return null;
}

export default function PatientFlow({ flow, refetch, patientUuid }) {
    const initialNodes = useMemo(() => flow?.nodes ?? [], [flow]);
    const initialEdges = useMemo(() => flow?.edges ?? [], [flow]);

    const [error, setError] = useState(null); 
    const { showSnackbar } = useSnackbar();

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [selectedNodeId, setSelectedNodeId] = useState(null);

    const [openDialog, setOpenDialog] = useState(false);
    const [nodeToDelete, setNodeToDelete] = useState(null); 

    useEffect(() => {
        setNodes(flow?.nodes ?? []);
        setEdges(flow?.edges ?? []);
        setSelectedNodeId(null);
    }, [flow, setNodes, setEdges]);

    const selectedNode = useMemo(
        () => nodes.find((node) => node.id === selectedNodeId) ?? null,
        [nodes, selectedNodeId],
    );

    const onNodeClick = useCallback((_, node) => {
        setSelectedNodeId(node.id);
    }, []);

    const onPaneClick = useCallback(() => {
        setSelectedNodeId(null);
    }, []);

    const handleDeleteNode = async () => {
        try {
            await deleteFlowEvent(nodeToDelete.id, patientUuid); 
            refetch();
            setNodeToDelete(null);
            showSnackbar({ message: 'Nodo eliminado correctamente' });
        } catch (err) {
            handleApiError(err, setError, null); 
        }
    };

    return (
        <ContentLayout drawer={false} error={error} onErrorClose={()=>setError(null)}>
            {openDialog && (
                <CreateSecondaryNodeForm
                    open={openDialog}
                    handleClose={() => setOpenDialog(false)}
                    parentNode={selectedNode}
                    refetch={refetch}
                    patientUuid={patientUuid}
                />
            )}

            {nodeToDelete && (
                <DeleteSecondaryNodeDialog
                    open={!!nodeToDelete}
                    handleClose={() => setNodeToDelete(null)}
                    handleConfirm={handleDeleteNode}
                />
            )}

            <Box sx={{ display: 'flex', gap: 2, height: 500, width: '100%' }}>
                <Box
                    sx={(theme) => ({
                        flexGrow: 1,
                        position: 'relative',
                        borderRadius: 2,
                        overflow: 'hidden',
                        border: '1px solid',
                        borderColor: 'divider',
                        backgroundColor: theme.palette.background.paper,
                    })}
                >
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onNodeClick={onNodeClick}
                        onPaneClick={onPaneClick}
                        nodeTypes={nodeTypes}
                        fitView
                        nodesDraggable={true}
                        nodesConnectable={false}
                        elementsSelectable
                        panOnDrag
                    >
                        <Background gap={16} />
                        <Controls showInteractive={false} />
                        <FlowViewportSync selectedNode={selectedNode} />
                    </ReactFlow>
                </Box>

                <FlowEventDetail
                    node={selectedNode}
                    onAddSecondaryNode={() => setOpenDialog(true)}
                    onDeleteSecondaryNode={() => setNodeToDelete(selectedNode)}
                />
            </Box>
        </ContentLayout>
    );
}
