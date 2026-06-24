-- Adds 'activa' column to Matricula if it doesn't exist
ALTER TABLE "Matricula" ADD COLUMN IF NOT EXISTS "activa" BOOLEAN DEFAULT true NOT NULL;

-- Verify: select column
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'Matricula' AND column_name = 'activa';
