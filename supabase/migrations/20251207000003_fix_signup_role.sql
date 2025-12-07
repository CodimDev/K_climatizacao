
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  meta_role TEXT;
  user_role public.user_role;
BEGIN
  -- Get role from metadata, default to 'tecnico' if missing or invalid
  meta_role := NEW.raw_user_meta_data->>'role';
  
  IF meta_role = 'admin' THEN
    user_role := 'admin';
  ELSE
    user_role := 'tecnico';
  END IF;

  INSERT INTO public.profiles (user_id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    NEW.raw_user_meta_data->>'full_name', 
    user_role
  );
  
  -- The trigger 'trigger_set_permissions' on profiles table will handle the permissions json
  -- automatically based on the role we just inserted.
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
