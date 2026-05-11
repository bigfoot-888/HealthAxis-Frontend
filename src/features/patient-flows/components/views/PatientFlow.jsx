import { useState, useMemo, useEffect, useCallback } from 'react';
import { ReactFlow, useNodesState, useEdgesState, Background, Controls, useReactFlow } from '@xyflow/react';
import { Box, TextField, Stack, Button, MenuItem, Typography, Chip } from '@mui/material';
import FlowEventDetail from '@patient-flows/components/ui/FlowEventDetail';
import '@xyflow/react/dist/style.css';

import { ContentLayout } from '@/components/layout';
import BaseFlowNode from '../ui/BaseFlowNode';
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

const NODE_TYPE_LABELS = {
    DIAGNOSIS: 'Diagnóstico',
    TREATMENT: 'Tratamiento',
    APPOINTMENT: 'Cita',
    CLINICAL_DOCUMENT: 'Documento',
    PATIENT: 'Paciente',
    OTHER: 'Otro',
};

function FlowViewportSync({ selectedNode }) {
    const { setCenter } = useReactFlow();

    useEffect(() => {
        if (!selectedNode) return;
        const timeout = setTimeout(() => {
            const x = (selectedNode.positionAbsoluteX ?? selectedNode.position?.x ?? 0) + 90;
            const y = (selectedNode.positionAbsoluteY ?? selectedNode.position?.y ?? 0) + 40;
            setCenter(x, y, { zoom: 1, duration: 300 });
        }, 50);
        return () => clearTimeout(timeout);
    }, [selectedNode, setCenter]);

    return null;
}

const RESULTS_PER_PAGE = 3;

export default function PatientFlow({ flow, refetch, patientUuid }) {
    const initialNodes = useMemo(() => flow?.nodes ?? [], [flow]);
    const initialEdges = useMemo(() => flow?.edges ?? [], [flow]);

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const [selectedNodeId, setSelectedNodeId] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [nodeToDelete, setNodeToDelete] = useState(null);
    const [error, setError] = useState(null);
    const { showSnackbar } = useSnackbar();
    const [hasSearched, setHasSearched] = useState(false);

    const [search, setSearch] = useState('');
    const [type, setType] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    const [results, setResults] = useState([]);
    const [visibleCount, setVisibleCount] = useState(RESULTS_PER_PAGE);

    useEffect(() => {
        setNodes(flow?.nodes ?? []);
        setEdges(flow?.edges ?? []);
        setSelectedNodeId(null);
        setResults([]);
    }, [flow, setNodes, setEdges]);

    const selectedNode = useMemo(() => nodes.find(n => n.id === selectedNodeId) ?? null, [nodes, selectedNodeId]);

    const onNodeClick = useCallback((_, node) => setSelectedNodeId(node.id), []);
    const onPaneClick = useCallback(() => setSelectedNodeId(null), []);

    const handleSearch = () => {
        let filtered = nodes;
        if (search)
            filtered = filtered.filter(n =>
                JSON.stringify(n.data?.title ?? '')
                    .toLowerCase()
                    .includes(search.toLowerCase())
            );
        if (type) filtered = filtered.filter(n => n.type === type);
        if (dateFrom) filtered = filtered.filter(n => new Date(n.data?.date) >= new Date(dateFrom));
        if (dateTo) filtered = filtered.filter(n => new Date(n.data?.date) <= new Date(dateTo));
        setHasSearched(true);
        setResults(filtered);
        setVisibleCount(RESULTS_PER_PAGE);
    };

    const handleClearSearch = () => {
        setSearch('');
        setType('');
        setDateFrom('');
        setDateTo('');
        setResults([]);
        setVisibleCount(RESULTS_PER_PAGE);
        setHasSearched(false);
    };

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

    const highlightedNodes = useMemo(
        () => nodes.map(n => ({ ...n, style: n.id === selectedNodeId ? { border: '2px solid #1976d2' } : {} })),
        [nodes, selectedNodeId]
    );

    return (
        <ContentLayout drawer={false} error={error} onErrorClose={() => setError(null)}>
            <Stack direction='row' spacing={1} alignItems='center' sx={{ mt: 1, mb: 2 }}>
                <TextField
                    size='small'
                    placeholder='Buscar...'
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    sx={{ minWidth: 180 }}
                />

                <TextField
                    select
                    size='small'
                    label='Tipo'
                    value={type}
                    onChange={e => setType(e.target.value)}
                    sx={{ minWidth: 140 }}
                >
                    <MenuItem value=''>Todos</MenuItem>
                    {Object.entries(NODE_TYPE_LABELS).map(([val, label]) => (
                        <MenuItem key={val} value={val}>
                            {label}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    size='small'
                    type='date'
                    label='Desde'
                    value={dateFrom}
                    onChange={e => setDateFrom(e.target.value)}
                    slotProps={{ inputLabel: { shrink: true } }}
                />
                <TextField
                    size='small'
                    type='date'
                    label='Hasta'
                    value={dateTo}
                    onChange={e => setDateTo(e.target.value)}
                    slotProps={{ inputLabel: { shrink: true } }}
                />

                <Button variant='contained' size='small' onClick={handleSearch}>
                    Buscar
                </Button>
                {results.length > 0 && (
                    <Button size='small' onClick={handleClearSearch}>
                        Limpiar
                    </Button>
                )}

                {hasSearched && results.length === 0 && (
                    <Typography variant='caption' color='text.secondary' sx={{ ml: 1 }}>
                        Sin resultados
                    </Typography>
                )}
            </Stack>

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

            <Box sx={{ display: 'flex', gap: 2, height: 480, position: 'relative' }}>
                {results.length > 0 && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 8,
                            left: 8,
                            zIndex: 10,
                            bgcolor: 'background.paper',
                            p: 1,
                            borderRadius: 1,
                            boxShadow: 3,
                            maxHeight: 180,
                            overflowY: 'auto',
                            width: 320,
                        }}
                    >
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: '1fr',
                                gap: 1,
                            }}
                        >
                            {results.slice(0, visibleCount).map(r => (
                                <Chip
                                    key={r.id}
                                    label={`${r.data?.title || NODE_TYPE_LABELS[r.type] || r.type}${
                                        r.data?.date ? ` · ${new Date(r.data.date).toLocaleDateString('es-ES')}` : ''
                                    }`}
                                    size='small'
                                    variant={selectedNodeId === r.id ? 'filled' : 'outlined'}
                                    color={selectedNodeId === r.id ? 'primary' : 'default'}
                                    onClick={() => setSelectedNodeId(r.id)}
                                    sx={{ justifyContent: 'flex-start' }}
                                />
                            ))}
                        </Box>

                        {visibleCount < results.length && (
                            <Button
                                size='small'
                                sx={{ mt: 1 }}
                                onClick={() => setVisibleCount(v => v + RESULTS_PER_PAGE)}
                            >
                                Cargar más ({results.length - visibleCount})
                            </Button>
                        )}
                    </Box>
                )}

                <Box sx={{ flexGrow: 1, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                    <ReactFlow
                        nodes={highlightedNodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onNodeClick={onNodeClick}
                        onPaneClick={onPaneClick}
                        nodeTypes={nodeTypes}
                        fitView
                    >
                        <Background />
                        <Controls />
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
