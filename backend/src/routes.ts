import { Router } from 'express';
import { prisma } from './prisma';
import { RequestCreateSchema, StatusSchema } from './validators';

const router = Router();

router.get('/requests', async (req, res) => {
  const { statut, service } = req.query as { statut?: string; service?: string };
  const items = await prisma.request.findMany({
    where: {
      ...(statut ? { statut } : {}),
      ...(service ? { service: { contains: service, mode: 'insensitive' } } : {})
    },
    orderBy: { createdAt: 'desc' }
  });
  res.json(items);
});

router.post('/requests', async (req, res) => {
  const parse = RequestCreateSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const created = await prisma.request.create({ data: parse.data });
  res.status(201).json(created);
});

router.get('/requests/:id', async (req, res) => {
  const id = Number(req.params.id);
  const item = await prisma.request.findUnique({ where: { id } });
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

router.patch('/requests/:id/status', async (req, res) => {
  const id = Number(req.params.id);
  const parse = StatusSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  try {
    const updated = await prisma.request.update({ where: { id }, data: { statut: parse.data.statut } });
    res.json(updated);
  } catch {
    res.status(404).json({ error: 'Not found' });
  }
});

export default router;
