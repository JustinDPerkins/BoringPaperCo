import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

interface WebTerminalProps {
  initialCommand?: string;
  onClose?: () => void;
}

const WebTerminal: React.FC<WebTerminalProps> = ({ initialCommand }) => {
  const termRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const term = new Terminal({
      cursorBlink: true,
      fontFamily: 'monospace',
      theme: { background: '#00000000' },
    });
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    if (termRef.current) {
      term.open(termRef.current);
      fitAddon.fit();
    }

    // Use current host for WebSocket connection (relative to current page)
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsHost = window.location.host;
    const xdrUrl = `${wsProtocol}//${wsHost}/api/xdr/terminal`;
    const ws = new WebSocket(xdrUrl);
    ws.binaryType = 'arraybuffer';

    ws.onopen = () => {
      term.focus();
      if (initialCommand) {
        setTimeout(() => {
          ws.send(initialCommand + '\r\n');
        }, 500);
      }
    };
    ws.onmessage = (e) => term.write(new Uint8Array(e.data));
    ws.onerror = () => term.write('\r\n\x1b[31m*** connection error ***\x1b[0m\r\n');
    ws.onclose = () => term.write('\r\n\x1b[31m*** disconnected ***\x1b[0m\r\n');

    term.onData((data: string) => {
      if (ws.readyState === 1) ws.send(data);
    });

    const handleResize = () => fitAddon.fit();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      ws.close();
      term.dispose();
    };
  }, [initialCommand]);

  return <div ref={termRef} style={{ height: '100%', width: '100%' }} />;
};

export default WebTerminal;
