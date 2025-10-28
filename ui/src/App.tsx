import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CartProvider } from './context/CartContext';
import { WatermarkProvider } from './context/WatermarkContext';
import { theme } from './theme';
import AppBar from './components/AppBar';
import ChatBot from './components/ChatBot';
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Upload from './pages/Watermark';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CartProvider>
        <WatermarkProvider>
          <Router>
            <AppBar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/watermarking" element={<Upload />} />
            </Routes>
            <ChatBot />
          </Router>
        </WatermarkProvider>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
