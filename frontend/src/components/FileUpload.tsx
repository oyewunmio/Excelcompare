import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Box, Button, Typography, Container, Grid, IconButton, Paper } from '@mui/material';
import { CloudUpload as CloudUploadIcon, Delete as DeleteIcon, Print as PrintIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';

interface FileUploadProps {
    token: string | null;
    shouldCompare: boolean;
    onFileSelected: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ token, shouldCompare, onFileSelected }) => {
    const [file1, setFile1] = useState<File | null>(null);
    const [file2, setFile2] = useState<File | null>(null);
    const [differences, setDifferences] = useState<string[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [reportData, setReportData] = useState<any>(null);
    const [showAllDifferences, setShowAllDifferences] = useState<boolean>(false);

    const fileInput1Ref = useRef<HTMLInputElement | null>(null);
    const fileInput2Ref = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (shouldCompare && file1 && file2) {
            handleFileUpload();
        }
    }, [shouldCompare, file1, file2]);

    const handleFileChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files ? event.target.files[0] : null;
        if (selectedFile && (selectedFile.name.endsWith('.csv') || selectedFile.name.endsWith('.xlsx'))) {
            setFile1(selectedFile);
            onFileSelected();
        } else {
            toast.error('Please select a valid CSV or XLSX file.');
        }
    };

    const handleFileChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files ? event.target.files[0] : null;
        if (selectedFile && (selectedFile.name.endsWith('.csv') || selectedFile.name.endsWith('.xlsx'))) {
            setFile2(selectedFile);
            onFileSelected();
        } else {
            toast.error('Please select a valid CSV or XLSX file.');
        }
    };

    const handleRemoveFile1 = () => {
        setFile1(null);
        setDifferences([]);
        setErrorMessage(null);
        if (fileInput1Ref.current) {
            fileInput1Ref.current.value = '';
        }
    };

    const handleRemoveFile2 = () => {
        setFile2(null);
        setDifferences([]);
        setErrorMessage(null);
        if (fileInput2Ref.current) {
            fileInput2Ref.current.value = '';
        }
    };

    const handleFileUpload = async () => {
        if (!file1 || !file2) return;

        const formData = new FormData();
        formData.append('file1', file1);
        formData.append('file2', file2);

        try {
            const response = await axios.post('http://localhost:8000/compare', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (Array.isArray(response.data.differences)) {
                setDifferences(response.data.differences);
                setErrorMessage(null);
            } else {
                setDifferences([]);
                setErrorMessage(response.data.differences);
            }

            setReportData(response.data.reportData);
            setShowAllDifferences(false);
        } catch (error) {
            toast.error('Error comparing files.');
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <Container>
            <Typography variant="h4" align="center" gutterBottom>
                Upload Files to Compare
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <Box
                        sx={{
                            border: '2px dashed #1976d2',
                            borderRadius: '8px',
                            padding: '16px',
                            textAlign: 'center',
                            height: '200px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column'
                        }}
                    >
                        <Typography variant="h6">Original</Typography>
                        <input
                            ref={fileInput1Ref}
                            accept=".csv,.xlsx"
                            style={{ display: 'none' }}
                            id="upload-file1"
                            type="file"
                            onChange={handleFileChange1}
                        />
                        <label htmlFor="upload-file1">
                            <Button variant="contained" color="primary" component="span" startIcon={<CloudUploadIcon />}>
                                Upload or Browse
                            </Button>
                        </label>
                        {file1 && (
                            <Box display="flex" alignItems="center" mt={2}>
                                <Typography variant="body1">{file1.name}</Typography>
                                <IconButton color="secondary" onClick={handleRemoveFile1}>
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        )}
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Box
                        sx={{
                            border: '2px dashed #1976d2',
                            borderRadius: '8px',
                            padding: '16px',
                            textAlign: 'center',
                            height: '200px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column'
                        }}
                    >
                        <Typography variant="h6">Compare</Typography>
                        <input
                            ref={fileInput2Ref}
                            accept=".csv,.xlsx"
                            style={{ display: 'none' }}
                            id="upload-file2"
                            type="file"
                            onChange={handleFileChange2}
                        />
                        <label htmlFor="upload-file2">
                            <Button variant="contained" color="primary" component="span" startIcon={<CloudUploadIcon />}>
                                Upload or Browse
                            </Button>
                        </label>
                        {file2 && (
                            <Box display="flex" alignItems="center" mt={2}>
                                <Typography variant="body1">{file2.name}</Typography>
                                <IconButton color="secondary" onClick={handleRemoveFile2}>
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        )}
                    </Box>
                </Grid>
            </Grid>
            <Box textAlign="center" mt={4}>
                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<CloudUploadIcon />}
                    onClick={handleFileUpload}
                    disabled={!file1 || !file2}
                >
                    Compare
                </Button>
            </Box>
            <Box mt={4}>
                <Paper elevation={3} sx={{ padding: '16px', border: '1px solid #1976d2', borderRadius: '8px' }}>
                    <Typography variant="h6">Differences</Typography>
                    {errorMessage ? (
                        <Box sx={{ backgroundColor: '#f5f5f5', padding: '8px', borderRadius: '4px', marginY: '8px' }}>
                            <Typography>{errorMessage}</Typography>
                        </Box>
                    ) : (
                        <Box>
                            <ul>
                                {(showAllDifferences ? differences : differences.slice(0, 10)).map((diff, index) => (
                                    <li key={index}>{diff}</li>
                                ))}
                            </ul>
                            {differences.length > 10 && !showAllDifferences && (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => setShowAllDifferences(true)}
                                >
                                    Show All
                                </Button>
                            )}
                        </Box>
                    )}
                    <Box textAlign="center" mt={2}>
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<PrintIcon />}
                            onClick={handlePrint}
                            disabled={!file1 || !file2}
                        >
                            Print to view more differences
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default FileUpload;
