# BizSim

Private repository.

```bash
npm ci
cp .env.example .env
npm run db:setup
npm run dev
```

Local development uses SQLite. PostgreSQL uses the committed migrations:

```bash
# Set DATABASE_URL to the PostgreSQL database, then:
npm run db:deploy
```

For PostgreSQL schema changes, update `prisma/schema.prisma` and run
`npm run db:migrate -- --name describe_change`. Optional row-level security
scripts are in `prisma/rls/` and are applied after schema creation.
