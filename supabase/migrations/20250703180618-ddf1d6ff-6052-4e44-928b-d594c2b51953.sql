
-- Add deletion_requested_at column to profiles table to track account deletion requests
ALTER TABLE public.profiles 
ADD COLUMN deletion_requested_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
