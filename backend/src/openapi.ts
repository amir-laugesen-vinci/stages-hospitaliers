export const openapiSpec = {
  openapi: '3.0.3',
  info: { title: 'API Stages', version: '1.0.0' },
  servers: [{ url: '/api' }],
  components: {
    schemas: {
      Request: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          nom: { type: 'string' },
          prenom: { type: 'string' },
          email: { type: 'string', format: 'email' },
          service: { type: 'string' },
          dateDebut: { type: 'string', format: 'date-time' },
          dateFin: { type: 'string', format: 'date-time' },
          statut: { type: 'string', enum: ['EN_ATTENTE','APPROUVEE','REFUSEE'] },
          motivation: { type: 'string', nullable: true },
          createdAt: { type: 'string', format: 'date-time' }
        },
        required: ['id','nom','prenom','email','service','dateDebut','dateFin','statut','createdAt']
      },
      RequestCreate: {
        type: 'object',
        properties: {
          nom: { type: 'string' },
          prenom: { type: 'string' },
          email: { type: 'string', format: 'email' },
          service: { type: 'string' },
          dateDebut: { type: 'string', format: 'date' },
          dateFin: { type: 'string', format: 'date' },
          motivation: { type: 'string' }
        },
        required: ['nom','prenom','email','service','dateDebut','dateFin']
      },
      StatusPatch: {
        type: 'object',
        properties: { statut: { type: 'string', enum: ['EN_ATTENTE','APPROUVEE','REFUSEE'] } },
        required: ['statut']
      }
    }
  }
} as const;
