import '@testing-library/jest-dom';

// Polyfill for TextEncoder (needed for Firebase or React Router in Jest)
import { TextEncoder, TextDecoder } from 'util';

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}

if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder as typeof global.TextDecoder;
}

//Polyfil ResizeObserver for the Rating in ProductCard.tsx
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};