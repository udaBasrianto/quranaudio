-- Create table to track PWA installations
CREATE TABLE public.pwa_installations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id TEXT NOT NULL UNIQUE,
  installed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_agent TEXT
);

-- Enable RLS
ALTER TABLE public.pwa_installations ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (anonymous tracking)
CREATE POLICY "Anyone can record installation" 
ON public.pwa_installations 
FOR INSERT 
WITH CHECK (true);

-- Allow anyone to read count
CREATE POLICY "Anyone can view installations" 
ON public.pwa_installations 
FOR SELECT 
USING (true);