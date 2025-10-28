// Product types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
}

// Cart types
export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

// Watermark types
export interface Watermark {
  id: string;
  name: string;
  type: 'image' | 'text';
  data: string; // Base64 for image, text for text type
  opacity: number;
  position: { x: number; y: number };
  scale: number;
}

// UI state types
export interface AppState {
  cart: Cart;
  watermarks: Watermark[];
  activeWatermark: string | null;
}

// File upload types
export interface UploadedFile {
  file: File;
  preview: string;
  type: 'image' | 'text';
}
