-- PERMITIR AGENDAMENTOS COMO VISITANTE
-- Rode este script no SQL Editor do Supabase

-- 1. Torna a coluna user_id opcional (nullable)
ALTER TABLE public.appointments ALTER COLUMN user_id DROP NOT NULL;

-- 2. Atualiza a política de RLS para permitir inserção anônima
-- (Ou inserção por qualquer usuário autenticado sem verificação de ID)
DROP POLICY IF EXISTS "Users can insert own appointments" ON public.appointments;
CREATE POLICY "Users can insert own appointments" 
ON public.appointments FOR INSERT WITH CHECK (true);

-- 3. Garante que os perfis de visitantes não quebrem a visualização do admin
-- O admin já tem política para ver todos os agendamentos.
