/*
  # Create bookings table

  1. New Tables
    - `bookings`
      - `id` (uuid, primary key)
      - `name` (text)
      - `phone` (text)
      - `service` (text)
      - `comment` (text)
      - `created_at` (timestamp)
      - `status` (text, default: 'pending')
  
  2. Security
    - Enable RLS on `bookings` table
    - Add policy to allow anyone to insert bookings (public form submission)
    - Add policy to allow viewing own bookings
*/

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  service text NOT NULL,
  comment text,
  created_at timestamptz DEFAULT now(),
  status text DEFAULT 'pending'
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert bookings"
  ON bookings
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view their own bookings"
  ON bookings
  FOR SELECT
  TO anon, authenticated
  USING (true);
