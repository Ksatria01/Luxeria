'use server';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function loginEmail(formData: FormData) {
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');
  if (!email || !password) redirect('/login?error=missing');
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect('/login?error=credentials');
  redirect('/dashboard');
}
export async function registerEmail(formData: FormData) {
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');
  if (!email || password.length < 8) redirect('/register?error=validation');
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback` } });
  if (error) redirect('/register?error=signup');
  redirect('/register?sent=1');
}
export async function sendPhoneOtp(formData: FormData) {
  const phone = String(formData.get('phone') || '').trim();
  if (!/^\+[1-9]\d{7,14}$/.test(phone)) redirect('/login?error=phoneformat');
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({ phone, options: { channel: 'whatsapp' } });
  if (error) redirect('/login?error=otp');
  redirect(`/verify?phone=${encodeURIComponent(phone)}`);
}
export async function verifyPhoneOtp(formData: FormData) {
  const phone = String(formData.get('phone') || '').trim();
  const token = String(formData.get('token') || '').trim();
  if (!phone || !/^\d{6}$/.test(token)) redirect('/verify?error=validation');
  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({ phone, token, type: 'sms' });
  if (error) redirect(`/verify?phone=${encodeURIComponent(phone)}&error=invalid`);
  redirect('/dashboard');
}
