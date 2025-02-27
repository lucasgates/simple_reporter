import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SecurityReport from './components/SecurityReport';
import ReportViewer from './components/ReportViewer';
import ApiDemo from './components/ApiDemo';

function App() {
  return (
    <Routes>
      <Route path="/" element={<ApiDemo />} />
      <Route path="/report/:reportId" element={<ReportViewer />} />
      <Route path="/demo" element={<SecurityReport />} />
    </Routes>
  );
}

export default App;