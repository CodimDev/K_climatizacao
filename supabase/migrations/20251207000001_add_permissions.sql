
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS permissions JSONB;

-- Set default permissions for existing admins
UPDATE profiles 
SET permissions = '{
  "dashboard": {"view": true, "edit": true, "delete": true, "admin": true},
  "appointments": {"view": true, "edit": true, "delete": true, "admin": true},
  "service_orders": {"view": true, "edit": true, "delete": true, "admin": true},
  "stock": {"view": true, "edit": true, "delete": true, "admin": true},
  "financial": {"view": true, "edit": true, "delete": true, "admin": true},
  "services": {"view": true, "edit": true, "delete": true, "admin": true},
  "settings": {"view": true, "edit": true, "delete": true, "admin": true},
  "users": {"view": true, "edit": true, "delete": true, "admin": true}
}'::jsonb
WHERE role = 'admin';

-- Set default permissions for existing tecnicos
UPDATE profiles 
SET permissions = '{
  "dashboard": {"view": true, "edit": false, "delete": false, "admin": false},
  "appointments": {"view": true, "edit": true, "delete": false, "admin": false},
  "service_orders": {"view": true, "edit": true, "delete": false, "admin": false},
  "stock": {"view": true, "edit": true, "delete": false, "admin": false},
  "financial": {"view": false, "edit": false, "delete": false, "admin": false},
  "services": {"view": true, "edit": false, "delete": false, "admin": false},
  "settings": {"view": false, "edit": false, "delete": false, "admin": false},
  "users": {"view": false, "edit": false, "delete": false, "admin": false}
}'::jsonb
WHERE role = 'tecnico';

-- Function to set default permissions on new user creation
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
      "users": {"view": true, "edit": true, "delete": true, "admin": true}
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
      "users": {"view": false, "edit": false, "delete": false, "admin": false}
    }'::jsonb;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to set permissions before insert on profiles
DROP TRIGGER IF EXISTS trigger_set_permissions ON profiles;
CREATE TRIGGER trigger_set_permissions
BEFORE INSERT ON profiles
FOR EACH ROW EXECUTE FUNCTION handle_new_user_permissions();
