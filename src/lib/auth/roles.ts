import { createClient } from '@/lib/supabase/server';
import type { UserRole } from '@/types/database';

export async function getCurrentRole(): Promise<UserRole | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from('web_roles').select('role').eq('user_id', user.id).maybeSingle();
  return (data?.role as UserRole | undefined) ?? 'user';
}
