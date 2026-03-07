const { getSupabase } = require('../_lib/supabase');
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
      return res.status(401).json({ error: 'Token inv\u00e1lido ou expirado' });
    }

    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) {
        return res.status(400).json({ error: 'JSON inv\u00e1lido no body' });
      }
    }

    const { data_type, data } = body || {};
    if (!data_type) {
      return res.status(400).json({ error: 'data_type \u00e9 obrigat\u00f3rio' });
    }
    if (data === undefined || data === null) {
      return res.status(400).json({ error: 'Campo data \u00e9 obrigat\u00f3rio' });
    }

    const supabase = getSupabase();

    // Schema: id (uuid = user id), hub_data (jsonb), lesson_data (jsonb), preferences (jsonb), updated_at
    const hubTypes = ['goals', 'notes', 'timer', 'streak', 'hub_state', 'history', 'quiz_history', 'seen_quiz', 'seen_coding', 'gen_cycle'];
    const lessonTypes = ['quiz', 'lessons'];

    // Get existing row
    const { data: existing, error: fetchErr } = await supabase
      .from('user_data')
      .select('id, hub_data, lesson_data, preferences')
      .eq('id', tokenUser.id)
      .maybeSingle();

    if (fetchErr) {
      console.error('Save fetch error:', JSON.stringify(fetchErr));
      return res.status(500).json({ error: 'Erro ao buscar dados', detail: fetchErr.message });
    }

    const now = new Date().toISOString();
    const currentHub = (existing && existing.hub_data) || {};
    const currentLesson = (existing && existing.lesson_data) || {};
    const currentPrefs = (existing && existing.preferences) || {};

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
      id: tokenUser.id,
      hub_data: currentHub,
      lesson_data: currentLesson,
      preferences: currentPrefs,
      updated_at: now
    };

    // Upsert: insert if not exists, update if exists
    const { data: result, error: upsertErr } = await supabase
      .from('user_data')
      .upsert(row, { onConflict: 'id' })
      .select('updated_at')
      .single();

    if (upsertErr) {
      console.error('Save upsert error:', JSON.stringify(upsertErr));
      return res.status(500).json({ error: 'Erro ao salvar', detail: upsertErr.message });
    }

    return res.status(200).json({ success: true, updated_at: result.updated_at });
  } catch (err) {
    console.error('Save catch error:', err.message, err.stack);
    return res.status(500).json({ error: 'Erro interno', detail: err.message });
  }
};
