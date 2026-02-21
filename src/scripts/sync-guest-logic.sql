-- 1. ADICIONA COLUNA DE E-MAIL NO AGENDAMENTO
-- Para sabermos de quem é a reserva mesmo sem login
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS guest_email text;

-- 2. TRIGGER DE VÍNCULO AUTOMÁTICO
-- Quando um usuário novo entra, o sistema vincula agendamentos antigos dele
CREATE OR REPLACE FUNCTION public.sync_guest_appointments()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.appointments
    SET user_id = NEW.id
    WHERE guest_email = (SELECT email FROM auth.users WHERE id = NEW.id)
    AND user_id IS NULL;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql security definer;

-- Remove se já existir e cria o trigger
DROP TRIGGER IF EXISTS tr_sync_guest_appointments ON public.profiles;
CREATE TRIGGER tr_sync_guest_appointments
    AFTER INSERT ON public.profiles
    FOR EACH ROW EXECUTE PROCEDURE public.sync_guest_appointments();

-- 3. AJUSTE DE RLS PARA E-MAIL
-- Permite que o sistema grave o e-mail do visitante
-- (Já liberamos o INSERT anteriormente, mas é bom garantir)
