import { usePatientHistory } from '@patients/hooks/usePatientHistory';
import PatientHistory from '@patients/components/views/PatientHistory';
import { useParams } from 'react-router';
import { CustomCircularProgress } from '@/components/feedback';
import Error from '@/components/feedback/Error';
import { useEffect, useState } from 'react';

export default function PatientHistoryPage() {
    const { uuid } = useParams();

    const [page, setPage] = useState(1);
    const [allLogs, setAllLogs] = useState([]);

    const { data, isLoading, isFetching, error } = usePatientHistory(uuid, page);

    useEffect(() => {
        if (data?.logs) {
            setAllLogs(prev => [...prev, ...data.logs]);
        }
    }, [data]);

    useEffect(() => {
        setAllLogs([]);
        setPage(1);
    }, [uuid]);

    if (error) return <Error msg='Error al cargar historial' />;
    if (isLoading && page === 1) return <CustomCircularProgress />;

    const hasMore = allLogs.length < data?.total;

    return (
        <PatientHistory
            logs={allLogs}
            onLoadMore={() => setPage(p => p + 1)}
            hasMore={hasMore}
            isFetching={isFetching}
        />
    );
}
