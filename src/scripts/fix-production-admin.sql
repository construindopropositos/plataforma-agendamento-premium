-- SCRIPT DE PRODUÇÃO: CONFIGURAÇÃO DE ADMIN E SEGURANÇA
-- Cole este script no SQL Editor do seu Supabase Dashboard

-- 1. Garante que a coluna subscription_status existe (caso tenha sido criada diferente)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='subscription_status') THEN
        ALTER TABLE public.profiles ADD COLUMN subscription_status text DEFAULT 'inactive';
    END IF;
END $$;

-- 2. TRANSFORMA SEU USUÁRIO EM ADMIN
-- Substitua 'SEU_EMAIL_AQUI' pelo e-mail que você usa para logar na plataforma
UPDATE public.profiles 
SET subscription_status = 'admin' 
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'contato@construindopropositos.com.br'
);

-- 3. AJUSTE DE RLS PARA DISPONIBILIDADE
-- Garante que o Admin possa fazer tudo e o público possa ver
DROP POLICY IF EXISTS "Admin can manage availability" ON public.availability;
CREATE POLICY "Admin can manage availability" 
ON public.availability 
FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.subscription_status = 'admin'
  )
);

DROP POLICY IF EXISTS "Anyone can view availability" ON public.availability;
CREATE POLICY "Anyone can view availability" 
ON public.availability 
FOR SELECT 
USING (true);

-- 4. HABILITA EXTENSÃO DE BUSCA (Necessária para evitar conflitos de horário)
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- 5. NOTA: Verifique se você adicionou a SUPABASE_SERVICE_ROLE_KEY na Vercel!
-- Se ela não estiver lá, o botão de salvar não funcionará.
