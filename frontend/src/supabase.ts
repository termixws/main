import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Booking {
  id?: string;
  name: string;
  phone: string;
  service: string;
  comment?: string;
  created_at?: string;
  status?: string;
}

export const submitBooking = async (booking: Booking) => {
  const { data, error } = await supabase
    .from('bookings')
    .insert([booking])
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const getBookings = async () => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
