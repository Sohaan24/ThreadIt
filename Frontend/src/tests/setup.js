import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Unmounts React trees that were mounted with render to prevent memory leaks
afterEach(() => {
  cleanup();
});