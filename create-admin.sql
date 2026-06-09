-- Criar usuário admin
-- Email: admin@diegocastro.com.br
-- Senha: Admin@123

INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_token,
  recovery_sent_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change_token_new,
  email_change,
  email_change_sent_at,
  last_sign_in_at,
  is_super_admin,
  phone,
  phone_confirmed_at,
  phone_change,
  phone_change_token,
  phone_change_sent_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@diegocastro.com.br',
  crypt('Admin@123', gen_salt('bf')),
  now(),
  '',
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  now(),
  now(),
  '',
  '',
  '',
  now(),
  now(),
  false,
  null,
  null,
  '',
  '',
  now()
);

-- Tornar o usuário admin
UPDATE profiles 
SET is_admin = true 
WHERE email = 'admin@diegocastro.com.br';
