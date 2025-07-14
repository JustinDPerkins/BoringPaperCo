// src/pages/Upload.jsx
import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Alert,
  LinearProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Security as SecurityIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  ErrorOutline as ErrorIcon
} from '@mui/icons-material';
import { DESIGN_TOKENS } from '../theme';

function Upload() {
  /* ------------------------------------------------------------------ */
  /*  State                                                             */
  /* ------------------------------------------------------------------ */
  const [selectedFile, setSelectedFile] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /* ------------------------------------------------------------------ */
  /*  File handlers                                                     */
  /* ------------------------------------------------------------------ */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setScanResult(null);
    setError(null);
    if (file && file.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10 MB');
      return;
    }
    setSelectedFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setScanResult(null);
    setError(null);
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      setIsLoading(true);
      const res = await fetch('/api/sdk/upload', {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error('File upload failed');
      const json = await res.json();
      setScanResult({ code: json.scan_result_code, details: json.scan_results });
      setSelectedFile(null);
      e.target.reset();
    } catch (err) {
      setError(err.message || 'Upload error');
    } finally {
      setIsLoading(false);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setScanResult(null);
    setError(null);
  };

  /* ------------------------------------------------------------------ */
  /*  Render                                                            */
  /* ------------------------------------------------------------------ */
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)',
        py: DESIGN_TOKENS.spacing.xl
      }}
    >
      <Container maxWidth="xl">
        <Card
          sx={{
            width: '100%',
            maxWidth: 1000,
            background: 'rgba(0,0,0,0.3)',
            backdropFilter: 'blur(15px)',
            borderRadius: DESIGN_TOKENS.borderRadius.lg,
            boxShadow: DESIGN_TOKENS.shadows.xl,
            border: '1px solid rgba(255,255,255,0.1)',
            overflow: 'hidden',
            mx: 'auto'
          }}
        >
          <CardContent sx={{ p: DESIGN_TOKENS.spacing.lg }}>
            {/* ------ Header --------------------------------------------- */}
            <Box sx={{ textAlign: 'center', mb: DESIGN_TOKENS.spacing.lg }}>
              <SecurityIcon
                sx={{
                  fontSize: 60,
                  color: 'rgba(255,255,255,0.7)',
                  mb: DESIGN_TOKENS.spacing.md
                }}
              />
              <Typography
                variant="h4"
                sx={{
                  fontWeight: DESIGN_TOKENS.typography.fontWeights.bold,
                  mb: DESIGN_TOKENS.spacing.sm,
                  color: 'rgba(255,255,255,0.9)'
                }}
              >
                Document Compliance Scan
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ opacity: 0.7, color: 'rgba(255,255,255,0.7)' }}
              >
                Secure File Verification
              </Typography>
            </Box>

            {/* ------ Form ---------------------------------------------- */}
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                border: '2px dashed rgba(255,255,255,0.3)',
                borderRadius: DESIGN_TOKENS.borderRadius.md,
                p: DESIGN_TOKENS.spacing.lg,
                textAlign: 'center',
                background: 'rgba(0,0,0,0.2)',
                '&:hover': { borderColor: 'rgba(255,255,255,0.5)' }
              }}
            >
              <input
                hidden
                id="file-upload"
                type="file"
                accept=".pdf,.doc,.docx,.txt,.jpg,.png"
                onChange={handleFileChange}
              />
              <label htmlFor="file-upload">
                <Button
                  component="span"
                  variant="contained"
                  startIcon={<UploadIcon />}
                  sx={{
                    mb: DESIGN_TOKENS.spacing.md,
                    background: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    '&:hover': { background: 'rgba(255,255,255,0.2)' }
                  }}
                >
                  Upload Document
                </Button>
              </label>

              {selectedFile && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mt: DESIGN_TOKENS.spacing.md
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      mr: DESIGN_TOKENS.spacing.md,
                      color: 'rgba(255,255,255,0.8)'
                    }}
                  >
                    {selectedFile.name}
                  </Typography>
                  <Tooltip title="Remove File">
                    <IconButton
                      size="small"
                      onClick={removeFile}
                      sx={{
                        color: 'rgba(255,255,255,0.7)',
                        '&:hover': { color: 'rgba(255,0,0,0.7)' }
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}

              <Button
                fullWidth
                type="submit"
                variant="contained"
                startIcon={<SecurityIcon />}
                disabled={!selectedFile || isLoading}
                sx={{
                  mt: DESIGN_TOKENS.spacing.md,
                  background: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  '&:hover': { background: 'rgba(255,255,255,0.2)' },
                  '&.Mui-disabled': {
                    background: 'rgba(255,255,255,0.05)',
                    color: 'rgba(255,255,255,0.3)'
                  }
                }}
              >
                Scan Document
              </Button>
            </Box>

            {/* ------ Progress & messages ------------------------------- */}
            {isLoading && (
              <Box sx={{ width: '100%', mt: DESIGN_TOKENS.spacing.md }}>
                <LinearProgress
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: 'rgba(255,255,255,0.5)'
                    }
                  }}
                />
                <Typography
                  variant="body2"
                  align="center"
                  sx={{
                    mt: DESIGN_TOKENS.spacing.md,
                    color: 'rgba(255,255,255,0.7)'
                  }}
                >
                  Scanning document…
                </Typography>
              </Box>
            )}

            {error && (
              <Alert
                severity="error"
                sx={{
                  mt: DESIGN_TOKENS.spacing.md,
                  background: 'rgba(255,0,0,0.1)',
                  color: 'white'
                }}
                icon={<ErrorIcon sx={{ color: 'white' }} />}
              >
                {error}
              </Alert>
            )}

            {scanResult && (
              <Box sx={{ mt: DESIGN_TOKENS.spacing.md }}>
                <Alert
                  severity={scanResult.code === 1 ? 'error' : 'success'}
                  sx={{
                    background:
                      scanResult.code === 1
                        ? 'rgba(255,0,0,0.1)'
                        : 'rgba(0,255,0,0.1)',
                    color: 'white'
                  }}
                  icon={
                    scanResult.code === 1 ? (
                      <ErrorIcon sx={{ color: 'white' }} />
                    ) : (
                      <CheckCircleIcon sx={{ color: 'white' }} />
                    )
                  }
                >
                  {scanResult.code === 1
                    ? 'Potential security risk detected!'
                    : 'Document scanned successfully'}
                </Alert>

                {scanResult.details && (
                  <Box
                    sx={{
                      mt: DESIGN_TOKENS.spacing.md,
                      background: 'rgba(0,0,0,0.2)',
                      p: DESIGN_TOKENS.spacing.md,
                      borderRadius: DESIGN_TOKENS.borderRadius.md,
                      maxHeight: 200,
                      overflowY: 'auto'
                    }}
                  >
                    <pre
                      style={{
                        margin: 0,
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        color: 'rgba(255,255,255,0.8)'
                      }}
                    >
                      {JSON.stringify(scanResult.details, null, 2)}
                    </pre>
                  </Box>
                )}
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default Upload;
