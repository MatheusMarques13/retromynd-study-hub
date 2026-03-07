const { getSupabase } = require('../_lib/supabase');
const { getUserFromReq, verifyToken, cors } = require('../_lib/auth');

module.exports = async (req, res) => {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    // Support token from Authorization header OR query param (sendBeacon fallback)
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

    const validTypes = ['goals', 'notes', 'timer', 'streak', 'hub_state', 'quiz', 'lessons', 'history', 'quiz_history', 'seen_quiz', 'seen_coding', 'gen_cycle'];
    if (!data_type || !validTypes.includes(data_type)) {
      return res.status(400).json({ error: 'data_type inválido. Use: ' + validTypes.join(', ') });
    }
    if (data === undefined || data === null) {
      return res.status(400).json({ error: 'Campo data é obrigatório' });
    }

    const supabase = getSupabase();

    // Table schema: id (uuid = user id), hub_data (jsonb), lesson_data (jsonb), preferences (jsonb), updated_at
    // Hub types go into hub_data, lesson types go into lesson_data
    const hubTypes = ['goals', 'notes', 'timer', 'streak', 'hub_state', 'history', 'quiz_history', 'seen_quiz', 'seen_coding', 'gen_cycle'];
    const lessonTypes = ['quiz', 'lessons'];

    // First get existing row
    const { data: existing } = await supabase
      .from('user_data')
      .select('id, hub_data, lesson_data, preferences')
      .eq('id', tokenUser.id)
      .maybeSingle();

    let result;
    const now = new Date().toISOString();

    if (existing) {
      // Update existing row — merge into the right JSONB column
      const updates = { updated_at: now };

      if (hubTypes.includes(data_type)) {
        const current = existing.hub_data || {};
        current[data_type] = data;
        updates.hub_data = current;
      } else if (lessonTypes.includes(data_type)) {
        const current = existing.lesson_data || {};
        current[data_type] = data;
        updates.lesson_data = current;
      }

      result = await supabase
        .from('user_data')
        .update(updates)
        .eq('id', tokenUser.id)
        .select()
        .single();
    } else {
      // Insert new row
      const row = { id: tokenUser.id, hub_data: {}, lesson_data: {}, preferences: {}, updated_at: now };

      if (hubTypes.includes(data_type)) {
        row.hub_data[data_type] = data;
      } else if (lessonTypes.includes(data_type)) {
        row.lesson_data[data_type] = data;
      }

      result = await supabase
        .from('user_data')
        .insert(row)
        .select()
        .single();
    }

    if (result.error) {
      console.error('Save error:', JSON.stringify(result.error));
      return res.status(500).json({ error: 'Erro ao salvar dados', detail: result.error.message });
    }

    return res.status(200).json({ success: true, updated_at: result.data.updated_at });
  } catch (err) {
    console.error('Save error:', err.message);
    return res.status(500).json({ error: 'Erro interno do servidor', detail: err.message });
  }
};
