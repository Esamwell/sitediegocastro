-- Criar usuários admin: Marcelo e Pedro

-- Marcelo
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, recovery_token, recovery_sent_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, email_change_token_new, email_change,
  email_change_sent_at, last_sign_in_at, is_super_admin,
  phone, phone_confirmed_at, phone_change, phone_change_token,
  phone_change_sent_at
) VALUES (
  '00000000-0000-0000-0000-000000000000', gen_random_uuid(),
  'authenticated', 'authenticated', 'marcelo@diegocastro.com.br',
  crypt('Marcelo@123', gen_salt('bf')), now(), '', now(),
  '{"provider":"email","providers":["email"]}', '{}', now(), now(),
  '', '', '', now(), now(), false, null, null, '', '', now()
);

UPDATE profiles SET is_admin = true WHERE email = 'marcelo@diegocastro.com.br';

-- Pedro
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, recovery_token, recovery_sent_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, email_change_token_new, email_change,
  email_change_sent_at, last_sign_in_at, is_super_admin,
  phone, phone_confirmed_at, phone_change, phone_change_token,
  phone_change_sent_at
) VALUES (
  '00000000-0000-0000-0000-000000000000', gen_random_uuid(),
  'authenticated', 'authenticated', 'pedro@diegocastro.com.br',
  crypt('Pedro@123', gen_salt('bf')), now(), '', now(),
  '{"provider":"email","providers":["email"]}', '{}', now(), now(),
  '', '', '', now(), now(), false, null, null, '', '', now()
);

UPDATE profiles SET is_admin = true WHERE email = 'pedro@diegocastro.com.br';
