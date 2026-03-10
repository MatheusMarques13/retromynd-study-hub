const { createClient } = require('@supabase/supabase-js');
const { getUserFromReq, cors } = require('../_lib/auth');

module.exports = async (req, res) => {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const tokenUser = getUserFromReq(req);
    if (!tokenUser) {
      return res.status(401).json({ error: 'Token inv\u00e1lido ou expirado' });
    }

    // Create supabase client with service_role key directly (bypasses RLS)
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('[LOAD] Missing env vars!');
      return res.status(500).json({ error: 'Server misconfigured' });
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      },
      db: {
        schema: 'public'
      }
    });

    const userId = tokenUser.id;
    console.log(`[LOAD] User: ${userId}`);

    const { data, error } = await supabase
      .from('user_data')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('[LOAD] Supabase error:', JSON.stringify(error));
      return res.status(500).json({ error: 'Erro ao carregar dados', detail: error.message });
    }

    if (!data) {
      console.log('[LOAD] No data found for user');
      return res.status(200).json({});
    }

    console.log(`[LOAD] Data found, updated_at: ${data.updated_at}`);
    console.log(`[LOAD] hub_data keys: ${Object.keys(data.hub_data || {}).join(', ')}`);

    // Map from DB columns to what frontend expects
    const result = {};
    const hubData = data.hub_data || {};

    if (hubData.goals) result.goals = { data: hubData.goals, updated_at: data.updated_at };
    if (hubData.notes) result.notes = { data: hubData.notes, updated_at: data.updated_at };
    if (hubData.timer) result.timer = { data: hubData.timer, updated_at: data.updated_at };
    if (hubData.streak) result.streak = { data: hubData.streak, updated_at: data.updated_at };
    if (hubData.flashcards) result.flashcards = { data: hubData.flashcards, updated_at: data.updated_at };
    if (hubData.snippets) result.snippets = { data: hubData.snippets, updated_at: data.updated_at };
    if (hubData.achievements) result.achievements = { data: hubData.achievements, updated_at: data.updated_at };
    if (hubData.mood) result.mood = { data: hubData.mood, updated_at: data.updated_at };

    if (data.lesson_data) {
      result.lessons = { data: data.lesson_data, updated_at: data.updated_at };
      // RetroLesson history (stored inside lesson_data)
      if (data.lesson_data.rl_coding_hist) result.rl_coding_hist = { data: data.lesson_data.rl_coding_hist, updated_at: data.updated_at };
      if (data.lesson_data.rl_quiz_hist) result.rl_quiz_hist = { data: data.lesson_data.rl_quiz_hist, updated_at: data.updated_at };
    }
    if (data.preferences) result.preferences = { data: data.preferences, updated_at: data.updated_at };

    console.log(`[LOAD] Returning ${Object.keys(result).length} data types`);
    return res.status(200).json(result);
  } catch (err) {
    console.error('[LOAD] Catch error:', err.message, err.stack);
    return res.status(500).json({ error: 'Erro interno', detail: err.message });
  }
};
