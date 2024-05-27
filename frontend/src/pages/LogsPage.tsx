import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Log {
    id: number;
    username: string;
    log_time: string;
    document_differences: string;
}

const LogsPage: React.FC<{ token: string }> = ({ token }) => {
    const [logs, setLogs] = useState<Log[]>([]);
    const [sortColumn, setSortColumn] = useState<string>('');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    useEffect(() => {
        axios
            .get('http://localhost:8000/logs', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                setLogs(response.data);
            })
            .catch((error) => {
                console.error('Error fetching logs', error);
            });
    }, [token]);

    const handleSort = (column: string) => {
        const direction = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortColumn(column);
        setSortDirection(direction);

        const sortedLogs = [...logs].sort((a, b) => {
            if (a[column] < b[column]) return direction === 'asc' ? -1 : 1;
            if (a[column] > b[column]) return direction === 'asc' ? 1 : -1;
            return 0;
        });
        setLogs(sortedLogs);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl mb-4">Logs</h1>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th
                            className="py-2 px-4 border-b cursor-pointer"
                            onClick={() => handleSort('username')}
                        >
                            Username {sortColumn === 'username' && (sortDirection === 'asc' ? '▲' : '▼')}
                        </th>
                        <th
                            className="py-2 px-4 border-b cursor-pointer"
                            onClick={() => handleSort('log_time')}
                        >
                            Log Time {sortColumn === 'log_time' && (sortDirection === 'asc' ? '▲' : '▼')}
                        </th>
                        <th
                            className="py-2 px-4 border-b cursor-pointer"
                            onClick={() => handleSort('document_differences')}
                        >
                            Document Differences {sortColumn === 'document_differences' && (sortDirection === 'asc' ? '▲' : '▼')}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map((log) => (
                        <tr key={log.id}>
                            <td className="py-2 px-4 border-b">{log.username}</td>
                            <td className="py-2 px-4 border-b">{new Date(log.log_time).toLocaleString()}</td>
                            <td className="py-2 px-4 border-b">{log.document_differences}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default LogsPage;
