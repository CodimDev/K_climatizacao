
-- Update default permissions to include clients and equipments
UPDATE profiles 
SET permissions = jsonb_set(
  jsonb_set(
    permissions, 
    '{clients}', 
    '{"view": true, "edit": true, "delete": true, "admin": true}'::jsonb
  ),
  '{equipments}',
  '{"view": true, "edit": true, "delete": true, "admin": true}'::jsonb
)
WHERE role = 'admin';

UPDATE profiles 
SET permissions = jsonb_set(
  jsonb_set(
    permissions, 
    '{clients}', 
    '{"view": true, "edit": true, "delete": false, "admin": false}'::jsonb
  ),
  '{equipments}',
  '{"view": true, "edit": true, "delete": false, "admin": false}'::jsonb
)
WHERE role = 'tecnico';

-- Update the function for new users
CREATE OR REPLACE FUNCTION public.handle_new_user_permissions()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role = 'admin' THEN
    NEW.permissions = '{
      "dashboard": {"view": true, "edit": true, "delete": true, "admin": true},
      "appointments": {"view": true, "edit": true, "delete": true, "admin": true},
      "service_orders": {"view": true, "edit": true, "delete": true, "admin": true},
      "stock": {"view": true, "edit": true, "delete": true, "admin": true},
      "financial": {"view": true, "edit": true, "delete": true, "admin": true},
      "services": {"view": true, "edit": true, "delete": true, "admin": true},
      "settings": {"view": true, "edit": true, "delete": true, "admin": true},
      "users": {"view": true, "edit": true, "delete": true, "admin": true},
      "clients": {"view": true, "edit": true, "delete": true, "admin": true},
      "equipments": {"view": true, "edit": true, "delete": true, "admin": true}
    }'::jsonb;
  ELSE
    NEW.permissions = '{
      "dashboard": {"view": true, "edit": false, "delete": false, "admin": false},
      "appointments": {"view": true, "edit": true, "delete": false, "admin": false},
      "service_orders": {"view": true, "edit": true, "delete": false, "admin": false},
      "stock": {"view": true, "edit": true, "delete": false, "admin": false},
      "financial": {"view": false, "edit": false, "delete": false, "admin": false},
      "services": {"view": true, "edit": false, "delete": false, "admin": false},
      "settings": {"view": false, "edit": false, "delete": false, "admin": false},
      "users": {"view": false, "edit": false, "delete": false, "admin": false},
      "clients": {"view": true, "edit": true, "delete": false, "admin": false},
      "equipments": {"view": true, "edit": true, "delete": false, "admin": false}
    }'::jsonb;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
