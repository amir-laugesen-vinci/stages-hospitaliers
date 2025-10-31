import { z } from 'zod';

export const RequestCreateSchema = z.object({
  nom: z.string().min(1),
  prenom: z.string().min(1),
  email: z.string().email(),
  service: z.string().min(1),
  dateDebut: z.coerce.date(),
  dateFin: z.coerce.date(),
  motivation: z.string().optional()
}).refine(v => v.dateFin > v.dateDebut, {
  message: 'dateFin must be after dateDebut',
  path: ['dateFin']
});

export const StatusSchema = z.object({
  statut: z.enum(['EN_ATTENTE','APPROUVEE','REFUSEE'])
});
