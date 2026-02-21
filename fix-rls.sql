-- 1. Habilita visualização pública de disponibilidade (anon)
drop policy if exists "Anyone can view availability" on availability;
create policy "Anyone can view availability"
  on availability for select
  using ( true );

-- 2. Permite agendamentos anonimos para teste (opcional para demo)
-- Ou melhor: garante que o admin pode inserir/gerenciar tudo
alter table availability enable row level security;
alter table appointments enable row level security;

-- 3. Garante que a extensão de prevenção de sobreposição está ativa
create extension if not exists btree_gist;

-- 4. Ajuste na tabela de agendamentos para permitir anonimo se necessário em ambiente de dev
-- (Geralmente em produção pediríamos login primeiro, mas para o MVP vamos permitir o fluxo)
-- drop policy if exists "Users can insert own appointments" on appointments;
-- create policy "Users can insert own appointments" on appointments for insert with check (true);
