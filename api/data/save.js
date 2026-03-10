const { createClient } = require('@supabase/supabase-js');
const { getUserFromReq, verifyToken, cors } = require('../_lib/auth');

module.exports = async (req, res) => {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    let tokenUser = getUserFromReq(req);
    if (!tokenUser && req.query.token) {
      tokenUser = verifyToken(req.query.token);
    }
    if (!tokenUser) {
      return res.status(401).json({ error: 'Token inválido ou expirado' });
    }

    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) {
        return res.status(400).json({ error: 'JSON inválido no body' });
      }
    }

    const { data_type, data } = body || {};
    if (!data_type) {
      return res.status(400).json({ error: 'data_type é obrigatório' });
    }
    if (data === undefined || data === null) {
      return res.status(400).json({ error: 'Campo data é obrigatório' });
    }

    // Create supabase client with service_role key directly (bypasses RLS)
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('[SAVE] Missing env vars!');
      return res.status(500).json({ error: 'Server misconfigured', detail: 'Missing SUPABASE env vars' });
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
    console.log(`[SAVE] User: ${userId}, Type: ${data_type}`);

    // Get existing row
    const { data: existing, error: fetchErr } = await supabase
      .from('user_data')
      .select('id, hub_data, lesson_data, preferences')
      .eq('id', userId)
      .maybeSingle();

    if (fetchErr) {
      console.error('[SAVE] Fetch error:', JSON.stringify(fetchErr));
      return res.status(500).json({ error: 'Erro ao buscar dados', detail: fetchErr.message });
    }

    const now = new Date().toISOString();
    const currentHub = (existing && existing.hub_data) || {};
    const currentLesson = (existing && existing.lesson_data) || {};
    const currentPrefs = (existing && existing.preferences) || {};

    // Categorize data_type
    const hubTypes = ['goals', 'notes', 'timer', 'streak', 'hub_state', 'history', 'quiz_history', 'seen_quiz', 'seen_coding', 'gen_cycle', 'flashcards', 'snippets', 'achievements', 'mood'];
    const lessonTypes = ['quiz', 'lessons', 'rl_coding_hist', 'rl_quiz_hist'];

    if (hubTypes.includes(data_type)) {
      currentHub[data_type] = data;
    } else if (lessonTypes.includes(data_type)) {
      currentLesson[data_type] = data;
    } else if (data_type === 'preferences') {
      Object.assign(currentPrefs, data);
    } else {
      currentHub[data_type] = data;
    }

    const row = {
      id: userId,
      hub_data: currentHub,
      lesson_data: currentLesson,
      preferences: currentPrefs,
      updated_at: now
    };

    console.log(`[SAVE] Upserting for user ${userId}...`);

    // Use upsert with onConflict
    const { data: result, error: upsertErr } = await supabase
      .from('user_data')
      .upsert(row, { onConflict: 'id', ignoreDuplicates: false })
      .select('id, updated_at')
      .single();

    if (upsertErr) {
      console.error('[SAVE] Upsert error:', JSON.stringify(upsertErr));
      console.error('[SAVE] Row attempted:', JSON.stringify(row));
      return res.status(500).json({ 
        error: 'Erro ao salvar', 
        detail: upsertErr.message,
        code: upsertErr.code,
        hint: upsertErr.hint
      });
    }

    console.log(`[SAVE] Success! Updated: ${result.updated_at}`);
    return res.status(200).json({ success: true, updated_at: result.updated_at });
  } catch (err) {
    console.error('[SAVE] Catch error:', err.message, err.stack);
    return res.status(500).json({ error: 'Erro interno', detail: err.message });
  }
};
