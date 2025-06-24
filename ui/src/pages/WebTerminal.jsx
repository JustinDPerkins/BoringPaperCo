import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

export default function WebTerminal({ onClose }) {
  const termRef = useRef(null);

  useEffect(() => {
    const term = new Terminal({
      cursorBlink: true,
      fontFamily: 'monospace',
      theme: { background: '#00000000' } // transparent for glass-morphism
    });
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(termRef.current);
    fitAddon.fit();

    const ws = new WebSocket('ws://localhost:8081/terminal');
    ws.binaryType = 'arraybuffer';

    ws.onopen    = ()   => term.focus();
    ws.onmessage = (e)  => term.write(new Uint8Array(e.data));
    ws.onerror   = ()   => term.write('\r\n\x1b[31m*** connection error ***\x1b[0m\r\n');
    ws.onclose   = ()   => term.write('\r\n\x1b[31m*** disconnected ***\x1b[0m\r\n');

    term.onData(data => ws.readyState === 1 && ws.send(data));

    const handleResize = () => fitAddon.fit();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      ws.close();
      term.dispose();
    };
  }, []);

  return <div ref={termRef} style={{ height: '100%', width: '100%' }} />;
}
