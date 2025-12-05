/*
  # Salon Natasha Database Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - Unique user identifier
      - `email` (text, unique) - User email for authentication
      - `hashed_password` (text) - Securely hashed password
      - `name` (text, optional) - User's display name
      - `created_at` (timestamptz) - Account creation timestamp
    
    - `masters`
      - `id` (uuid, primary key) - Unique master identifier
      - `name` (text) - Master's full name
      - `sex` (text) - Gender identifier
      - `phone` (text, unique) - Contact phone number
      - `experience` (integer) - Years of experience
      - `specialty` (text) - Professional specialty
      - `created_at` (timestamptz) - Record creation timestamp
    
    - `services`
      - `id` (uuid, primary key) - Unique service identifier
      - `name` (text, unique) - Service name
      - `description` (text) - Service description
      - `price` (decimal) - Service cost
      - `duration` (integer) - Duration in minutes
      - `created_at` (timestamptz) - Record creation timestamp
    
    - `appointments`
      - `id` (uuid, primary key) - Unique appointment identifier
      - `date_time` (timestamptz) - Scheduled appointment time
      - `status` (text) - Appointment status (pending, confirmed, completed, cancelled)
      - `user_id` (uuid, foreign key) - References users table
      - `master_id` (uuid, foreign key) - References masters table
      - `service_id` (uuid, foreign key) - References services table
      - `created_at` (timestamptz) - Booking creation timestamp

  2. Security
    - Enable RLS on all tables
    - Users can read/update their own data
    - Users can view all masters and services
    - Users can create/view/update their own appointments
    - Masters and services are publicly readable
    - Authenticated users can create appointments
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  hashed_password text NOT NULL,
  name text,
  created_at timestamptz DEFAULT now()
);

-- Create masters table
CREATE TABLE IF NOT EXISTS masters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  sex text NOT NULL,
  phone text UNIQUE NOT NULL,
  experience integer NOT NULL DEFAULT 0,
  specialty text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text NOT NULL,
  price decimal(10,2) NOT NULL,
  duration integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date_time timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  master_id uuid NOT NULL REFERENCES masters(id) ON DELETE CASCADE,
  service_id uuid NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT unique_master_datetime UNIQUE (master_id, date_time)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE masters ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own data"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own data"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Masters policies (publicly readable for booking)
CREATE POLICY "Anyone can view masters"
  ON masters FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create masters"
  ON masters FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update masters"
  ON masters FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete masters"
  ON masters FOR DELETE
  TO authenticated
  USING (true);

-- Services policies (publicly readable for booking)
CREATE POLICY "Anyone can view services"
  ON services FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create services"
  ON services FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update services"
  ON services FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete services"
  ON services FOR DELETE
  TO authenticated
  USING (true);

-- Appointments policies
CREATE POLICY "Users can view their own appointments"
  ON appointments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create appointments"
  ON appointments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own appointments"
  ON appointments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own appointments"
  ON appointments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_master_id ON appointments(master_id);
CREATE INDEX IF NOT EXISTS idx_appointments_service_id ON appointments(service_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date_time ON appointments(date_time);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_masters_phone ON masters(phone);