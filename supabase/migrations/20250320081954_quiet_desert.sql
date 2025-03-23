/*
  # Initial Schema Setup for Paddy Cultivation Platform

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key)
      - `email` (text)
      - `full_name` (text)
      - `role` (text)
      - `created_at` (timestamp)
    
    - `guides`
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text)
      - `category` (text)
      - `created_at` (timestamp)
      - `author_id` (uuid, references profiles)

    - `discussions`
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text)
      - `author_id` (uuid, references profiles)
      - `created_at` (timestamp)
      - `tags` (text[])

    - `replies`
      - `id` (uuid, primary key)
      - `content` (text)
      - `discussion_id` (uuid, references discussions)
      - `author_id` (uuid, references profiles)
      - `created_at` (timestamp)

    - `votes`
      - `id` (uuid, primary key)
      - `discussion_id` (uuid, references discussions)
      - `user_id` (uuid, references profiles)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  role text DEFAULT 'user' CHECK (role IN ('user', 'expert', 'admin')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create guides table
CREATE TABLE guides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL,
  created_at timestamptz DEFAULT now(),
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE
);

ALTER TABLE guides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read guides"
  ON guides FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Experts and admins can create guides"
  ON guides FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('expert', 'admin')
    )
  );

-- Create discussions table
CREATE TABLE discussions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  tags text[] DEFAULT '{}'
);

ALTER TABLE discussions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read discussions"
  ON discussions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create discussions"
  ON discussions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

-- Create replies table
CREATE TABLE replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  discussion_id uuid REFERENCES discussions(id) ON DELETE CASCADE,
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read replies"
  ON replies FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create replies"
  ON replies FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

-- Create votes table
CREATE TABLE votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  discussion_id uuid REFERENCES discussions(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(discussion_id, user_id)
);

ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read votes"
  ON votes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create their own votes"
  ON votes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own votes"
  ON votes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);