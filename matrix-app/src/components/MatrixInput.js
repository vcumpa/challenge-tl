import React, { useState } from "react";
import axios from "axios";
import { getToken } from "../api";

const MatrixInput = ({ onQRResult }) => {
  const goApiUrl = process.env.REACT_APP_GO_API_URL;
  const [goToken, setGoToken] = useState('');
  const [matrix, setMatrix] = useState("[[1,1],[0,1]]");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const goToken = await getToken(goApiUrl, 'go_api', 'go_password');
      setGoToken(goToken);
      
      const response = await axios.post(
        `${goApiUrl}/matrix/qr`,
        JSON.parse(matrix), {
        headers: {
          Authorization: `Bearer ${goToken}`
        }}
      );
      onQRResult(response.data);
    } catch (error) {
      console.error("Error fetching QR result:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label for="matrix"> Ingrese una matriz válida: </label>
        <textarea id ="matrix"
          value={matrix}
          onChange={(e) => setMatrix(e.target.value)}
          placeholder="Enter matrix as JSON array of arrays"
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default MatrixInput;
