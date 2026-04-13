import React from 'react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { ContentLayout } from '@/components/layout';
import { Responsive, useContainerWidth } from 'react-grid-layout';
import DashboardComponentRenderer from '@dashboards/components/ui/DashboardComponentRenderer';



export default function Dashboard({ dashboard }) {
    // This hook measures the wrapper div to provide an accurate width
    const { width, containerRef, mounted } = useContainerWidth();

    console.log(dashboard)

    // Define layouts for different breakpoints. 
    // I mapped your original layout to the 'lg' breakpoint.
    const layouts = {
        lg: [
            { i: '1', x: 0, y: 0, w: 2, h: 2 },
            { i: '2', x: 2, y: 0, w: 2, h: 2 },
            { i: '3', x: 0, y: 2, w: 4, h: 3 },
            { i: '4', x: 0, y: 5, w: 4, h: 3 },
            { i: '5', x: 4, y: 0, w: 2, h: 4 },
            { i: '6', x: 4, y: 4, w: 2, h: 4 },
        ]
        // Add 'md', 'sm', etc., here to reposition items on smaller screens
    };

    return (
        <ContentLayout>
            {/* The ref goes here so it measures the full space of ContentLayout */}
            <div 
                ref={containerRef} 
                style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
            >
                {mounted && (
                    <Responsive
                        className="layout"
                        layouts={layouts}
                        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                        // Note: I set 'lg' to 6 columns so your original layout fits perfectly.
                        // If you use 12, your items will only take up half the screen horizontally.
                        cols={{ lg: 6, md: 4, sm: 2, xs: 1, xxs: 1 }}
                        rowHeight={100}
                        width={width}
                        isDraggable={true}
                        isResizable={true}
                        style={{ flex: 1 }}
                    >
                        {dashboard.components.map((component, index) => {
                            // Important: Keys must still match the 'i' property in layouts
                            const itemKey = component.id || String(index + 1);

                            return (
                                <div key={itemKey} style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
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