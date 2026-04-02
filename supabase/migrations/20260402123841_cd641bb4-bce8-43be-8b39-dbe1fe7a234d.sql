
CREATE TABLE public.quiz_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  surah_number INTEGER,
  surah_name TEXT,
  score INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL DEFAULT 15,
  best_streak INTEGER NOT NULL DEFAULT 0,
  mode TEXT NOT NULL DEFAULT 'arabic-to-indonesian',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.quiz_scores ENABLE ROW LEVEL SECURITY;

-- Everyone authenticated can view scores (leaderboard)
CREATE POLICY "Anyone can view quiz scores"
ON public.quiz_scores
FOR SELECT
TO authenticated
USING (true);

-- Users can only insert their own scores
CREATE POLICY "Users can insert their own scores"
ON public.quiz_scores
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Index for leaderboard queries
CREATE INDEX idx_quiz_scores_score ON public.quiz_scores (score DESC, best_streak DESC);
CREATE INDEX idx_quiz_scores_user ON public.quiz_scores (user_id);

ALTER PUBLICATION supabase_realtime ADD TABLE public.quiz_scores;
