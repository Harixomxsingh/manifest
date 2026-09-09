import React from 'react';
import { AppProvider } from './context/AppContext';
import DashboardV1_1_2 from './v1_1_2/DashboardV1_1_2';

export default function App() {
  return (
    <AppProvider>
      <DashboardV1_1_2 />
    </AppProvider>
  );
}
