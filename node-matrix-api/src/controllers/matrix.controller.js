
const calculateStats = async (req, res) => {
  try {
    //Obtener las matrices Q y R
    const { Q, R } = req.body;

    const matrices = [...Q, ...R];
    const allValues = matrices.flat();

    //Generar estadísticas
    const max = Math.max(...allValues);
    const min = Math.min(...allValues);
    const sum = allValues.reduce((a, b) => a + b, 0);
    const avg = sum / allValues.length;

    const isDiagonal = (matrix) => {
      for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
          if (i !== j && matrix[i][j] !== 0) {
            return false;
          }
        }
      }
      return true;
    };

    const isQDiagonal = isDiagonal(Q);
    const isRDiagonal = isDiagonal(R);

    res.json({
      max,
      min,
      average: avg,
      sum,
      isQDiagonal,
      isRDiagonal
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  calculateStats
};