import React from 'react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { ContentLayout } from '@/components/layout';
import { Responsive, useContainerWidth } from 'react-grid-layout';
import DashboardComponentRenderer from '@dashboards/components/ui/DashboardComponentRenderer';
import DashboardToolbar from '@dashboards/components/ui/DashboardToolbar';
import { useState } from 'react';
import { updateLayout, createDashboardWidget } from '@dashboards/api/dashboard-api';
import AddKpiWidgetDialog from '../dialogs/AddKpiWidgetDialog';
import { useDashboard } from '@dashboards/hooks/useDashboard';

export default function Dashboard({ dashboard }) {
    const { width, containerRef, mounted } = useContainerWidth();
    const [layout, setLayout] = useState([]);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const { refetch } = useDashboard();

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
            const formattedLayout = layout.map((item) => ({
                id: item.i,
                x: item.x,
                y: item.y,
                w: item.w,
                h: item.h,
            }));

            await updateLayout(formattedLayout);
            console.log('Layout guardado');
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreateWidget = async (widgetData) => {
        try {
            await createDashboardWidget(widgetData);
            setOpenAddDialog(false);
            refetch();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <ContentLayout>
            <DashboardToolbar onSave={handleSaveLayout} onAddWidget={() => setOpenAddDialog(true)} />
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
                        onLayoutChange={(newLayout) => {
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
                                    <DashboardComponentRenderer component={component} />
                                </div>
                            );
                        })}
                    </Responsive>
                )}
            </div>
        </ContentLayout>
    );
}
