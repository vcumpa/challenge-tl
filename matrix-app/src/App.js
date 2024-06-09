import React, { useState } from 'react';
import MatrixInput from './components/MatrixInput';
import QRResult from './components/QRResult';
import StatsResult from './components/StatsResult';

function App() {
  const [qrResult, setQRResult] = useState(null);

  return (
    <div>
      <h1>Matrix Factorization and Statistics</h1>
      <MatrixInput onQRResult={setQRResult} />
      {qrResult && <QRResult qrResult={qrResult} />}
      {qrResult && <StatsResult qrResult={qrResult} />}
    </div>
  );
}

export default App;
