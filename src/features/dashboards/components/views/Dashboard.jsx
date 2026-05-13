import React from 'react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { ContentLayout } from '@/components/layout';
import { Responsive, useContainerWidth } from 'react-grid-layout';
import DashboardComponentRenderer from '@dashboards/components/ui/DashboardComponentRenderer';
import DashboardToolbar from '@dashboards/components/ui/DashboardToolbar';
import { useState } from 'react';
import { updateLayout, createDashboardWidget, deleteDashboardWidget } from '@dashboards/api/dashboard.api';
import AddKpiWidgetDialog from '../dialogs/AddKpiWidgetDialog';
import { useDashboard } from '@dashboards/hooks/useDashboard';
import { handleApiError } from '@/utils/handle-errors';
import { AlertDialog } from '@/components/dialogs';
import { useSnackbar } from '@/app/SnackBarContext';

export default function Dashboard({ dashboard }) {
    const { width, containerRef, mounted } = useContainerWidth();
    const [layout, setLayout] = useState([]);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const { refetch } = useDashboard();
    const [error, setError] = useState(null);
    const [componentToDelete, setComponentToDelete] = useState(null);
    const { showSnackbar } = useSnackbar();

    const layouts = {
        lg: (dashboard?.components || []).map((component, index) => ({
            i: String(component.id ?? index),
            x: component.position?.x ?? 0,
            y: component.position?.y ?? 0,
            w: component.position?.w ?? 2,
            h: component.position?.h ?? 2,
        })),
    };

    const handleSaveLayout = async () => {
        try {
            const formattedLayout = layout.map(item => ({
                id: item.i,
                x: item.x,
                y: item.y,
                w: item.w,
                h: item.h,
            }));
            await updateLayout(formattedLayout);
            showSnackbar({ message: 'Distribución de componentes actualizada correctamente' });
        } catch (err) {
            handleApiError(err, setError, null);
        }
    };

    const handleCreateWidget = async widgetData => {
        try {
            await createDashboardWidget(widgetData);
            setOpenAddDialog(false);
            refetch();
            showSnackbar({ message: 'Componente creado correctamente' });
        } catch (err) {
            setOpenAddDialog(false);
            handleApiError(err, setError, null);
        }
    };

    const handleDeleteComponent = async widgetData => {
        try {
            await deleteDashboardWidget(widgetData.id);
            setComponentToDelete(null);
            refetch();
            showSnackbar({ message: 'Componente eliminado correctamente' });
        } catch (err) {
            setComponentToDelete(null);
            handleApiError(err, setError, null);
        }
    };

    return (
        <ContentLayout error={error} onErrorClose={() => setError(null)}>
            {!!componentToDelete && (
                <AlertDialog
                    open={!!componentToDelete}
                    handleClose={() => setComponentToDelete(null)}
                    handleConfirm={() => handleDeleteComponent(componentToDelete)}
                    title={`Eliminar componente`}
                    content='Esta acción es irreversible. Al finalizar, el componente será eliminado. '
                />
            )}
            <DashboardToolbar
                onSave={handleSaveLayout}
                onAddWidget={() => setOpenAddDialog(true)}
                disableAddWidget={dashboard.components.length >= 10}
            />
            {openAddDialog && (
                <AddKpiWidgetDialog
                    open={openAddDialog}
                    onClose={() => setOpenAddDialog(false)}
                    onSubmit={handleCreateWidget}
                />
            )}
            <div
                ref={containerRef}
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {mounted && (
                    <Responsive
                        className='layout'
                        layouts={layouts}
                        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                        cols={{ lg: 8, md: 8, sm: 8, xs: 1, xxs: 1 }}
                        rowHeight={100}
                        width={width}
                        isDraggable={true}
                        isResizable={true}
                        onLayoutChange={newLayout => {
                            setLayout(newLayout);
                        }}
                        style={{ flex: 1 }}
                    >
                        {dashboard.components.map((component, index) => {
                            const itemKey = String(component.id ?? index);

                            return (
                                <div
                                    key={itemKey}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        overflow: 'hidden',
                                    }}
                                >
                                    <DashboardComponentRenderer component={component} onDelete={setComponentToDelete} />
                                </div>
                            );
                        })}
                    </Responsive>
                )}
            </div>
        </ContentLayout>
    );
}
