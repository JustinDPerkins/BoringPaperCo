// API Service Layer for Backend Communication

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Chat API Service
 */
export interface ChatMessage {
  message: string;
  securityEnabled: boolean;
}

export interface ChatResponse {
  response: string;
}

export const chatApi = {
  sendMessage: async (message: string, securityEnabled: boolean): Promise<ChatResponse> => {
    const response = await fetch('/api/chat/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, securityEnabled }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.response || 'Failed to send message');
    }

    return response.json();
  },
};

/**
 * File Upload API Service
 */
export interface UploadResponse {
  success: boolean;
  scanResult?: any;
  message?: string;
}

export const uploadApi = {
  uploadFile: async (
    file: File,
    filename: string,
    protectedUpload: boolean = true
  ): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file, filename);

    const endpoint = protectedUpload ? '/api/sdk/upload' : '/api/sdk/upload-vulnerable';
    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return response.json();
  },
};

/**
 * Terminal API Service (WebSocket)
 */
export const terminalApi = {
  createConnection: (onMessage: (data: ArrayBuffer) => void) => {
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsHost = window.location.host;
    const wsUrl = `${wsProtocol}//${wsHost}/api/xdr/terminal`;

    const ws = new WebSocket(wsUrl);
    ws.binaryType = 'arraybuffer';

    ws.onopen = () => console.log('Terminal connected');
    ws.onmessage = (e) => onMessage(e.data);
    ws.onerror = () => console.error('Terminal connection error');
    ws.onclose = () => console.log('Terminal disconnected');

    return ws;
  },
};

export default {
  chatApi,
  uploadApi,
  terminalApi,
};
