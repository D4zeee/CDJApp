import { createClient } from './supabase/server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export async function getCurrentUser() {
  const supabase = await createClient();
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return null;
    }

    // Check if user is an admin using the auth user ID directly
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('id, username')
      .eq('id', user.id)
      .single();

    if (!adminUser) {
      return null;
    }

    return {
      id: user.id,
      email: user.email || '',
      username: adminUser.username,
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function requireAuth() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/login');
  }
  
  return user;
}

export async function signOut() {
  const supabase = await createClient();
  
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw error;
    }
    
    // Clear cookies
    const cookieStore = await cookies();
    cookieStore.delete('sb-access-token');
    cookieStore.delete('sb-refresh-token');
    
    redirect('/login');
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

export async function signInWithPassword(username: string, password: string) {
  const supabase = await createClient();
  
  try {
    // First, get the user's email from admin_users table
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('id')
      .eq('username', username)
      .single();

    if (adminError || !adminUser) {
      throw new Error('Invalid username or password');
    }

    // Get the user's email from auth.users
    const { data: authUser, error: authError } = await supabase
      .from('auth.users')
      .select('email')
      .eq('id', adminUser.id)
      .single();

    if (authError || !authUser) {
      throw new Error('Invalid username or password');
    }

    // Sign in with email and password
    const { data, error } = await supabase.auth.signInWithPassword({
      email: authUser.email,
      password: password,
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
}
