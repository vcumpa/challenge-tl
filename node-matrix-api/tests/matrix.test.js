process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('../src/app'); // Reemplaza './app' con la ruta correcta a tu aplicación Express

describe('POST /api/matrix/stats', () => {
  it('should return statistics for a given matrix', async () => {
    const matrix = {
      Q: [[1, 0], [0, 1]],
      R: [[1, 1], [0, 1]]
    };
    
    const response = await request(app)
      .post('/api/matrix/stats')
      .send(matrix)
      .expect(200);

    // Verifica que la respuesta contenga las estadísticas esperadas
    expect(response.body).toEqual({
      max: 1,
      min: 0,
      average: 0.625,
      sum: 5,
      isQDiagonal: true,
      isRDiagonal: false
    });
  });
});