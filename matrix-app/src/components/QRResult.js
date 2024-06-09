import React from 'react';

const QRResult = ({ qrResult }) => {
  return (
    <div class="response">
      <div><h3>QR Result</h3></div>
      <pre><code>{JSON.stringify(qrResult, null, 2)}</code></pre>
    </div>
  );
};

export default QRResult;
