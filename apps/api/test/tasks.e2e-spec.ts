import request from 'supertest';

describe('Tasks E2E (live server)', () => {
  const base = 'http://localhost:3000';
  let id: string;

  it('POST /tasks', async () => {
    const res = await request(base).post('/tasks').send({ title: 'E2E Task'});
    expect(res.status).toBe(201);
    id =res.body.id;
    expect(res.body.title).toBe('E2E Task');
  })

  it('GET /tasks/:id', async () => {
    const res = await request(base).get(`/tasks/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(id);
  });

  it('PATCH /tasks/:id', async () => {
    const res = await request(base).patch(`/tasks/${id}`).send({ status: 'DONE' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('DONE');
  });

  it('DELETE /tasks/:id', async () => {
    const res = await request(base).delete(`/tasks/${id}`);
    expect(res.status).toBe(204);
  });
})