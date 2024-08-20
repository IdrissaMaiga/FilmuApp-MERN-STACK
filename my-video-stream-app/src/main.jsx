import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Import your App component
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import { ChakraProvider } from '@chakra-ui/react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ChakraProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
    </ChakraProvider>
  </React.StrictMode>
);
