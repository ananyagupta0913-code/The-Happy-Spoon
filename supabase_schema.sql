-- ============================================================
-- THE HAPPY SPOON - Supabase Database Schema
-- Run this in your Supabase SQL Editor (Project > SQL Editor)
-- ============================================================

-- -------------------------------------------------------
-- 1. TABLE: reservations
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reservations (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  email         TEXT NOT NULL,
  phone         TEXT NOT NULL,
  date          DATE NOT NULL,
  time          TIME NOT NULL,
  guests        INTEGER NOT NULL CHECK (guests BETWEEN 1 AND 20),
  special_requests TEXT,
  status        TEXT NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -------------------------------------------------------
-- 2. TABLE: contact_messages
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  subject    TEXT NOT NULL,
  message    TEXT NOT NULL,
  read       BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -------------------------------------------------------
-- 3. ENABLE ROW LEVEL SECURITY
-- -------------------------------------------------------
ALTER TABLE public.reservations      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages  ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------
-- 4. RLS POLICIES — public INSERT (anyone can book / contact)
-- -------------------------------------------------------
CREATE POLICY "Allow public inserts on reservations"
  ON public.reservations
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public inserts on contact_messages"
  ON public.contact_messages
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- -------------------------------------------------------
-- 5. RLS POLICIES — authenticated SELECT / UPDATE / DELETE
--    (only logged-in admin can read and manage records)
-- -------------------------------------------------------
CREATE POLICY "Allow authenticated select on reservations"
  ON public.reservations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated update on reservations"
  ON public.reservations
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated delete on reservations"
  ON public.reservations
  FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated select on contact_messages"
  ON public.contact_messages
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated update on contact_messages"
  ON public.contact_messages
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated delete on contact_messages"
  ON public.contact_messages
  FOR DELETE
  TO authenticated
  USING (true);

-- -------------------------------------------------------
-- 6. INDEXES for common query patterns
-- -------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_reservations_date   ON public.reservations (date);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON public.reservations (status);
CREATE INDEX IF NOT EXISTS idx_contact_read        ON public.contact_messages (read);
