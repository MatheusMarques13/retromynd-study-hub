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

    // Handle both JSON body and sendBeacon body
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) {
        return res.status(400).json({ error: 'JSON inválido no body' });
      }
    }

    const { data_type, data } = body || {};

    const validTypes = [
      'goals', 'notes', 'timer', 'streak', 'hub_state',
      'quiz', 'lessons',
      'history', 'quiz_history', 'seen_quiz', 'seen_coding', 'gen_cycle'
    ];
    if (!data_type || !validTypes.includes(data_type)) {
      return res.status(400).json({ error: 'data_type inválido. Use: ' + validTypes.join(', ') });
    }
    if (data === undefined || data === null) {
      return res.status(400).json({ error: 'Campo data é obrigatório' });
    }

    const supabase = getSupabase();

    const { data: existing } = await supabase
      .from('user_data')
      .select('id')
      .eq('user_id', tokenUser.id)
      .eq('data_type', data_type)
      .maybeSingle();

    let result;
    if (existing) {
      result = await supabase
        .from('user_data')
        .update({ data, updated_at: new Date().toISOString() })
        .eq('id', existing.id)
        .select()
        .single();
    } else {
      result = await supabase
        .from('user_data')
        .insert({ user_id: tokenUser.id, data_type, data })
        .select()
        .single();
    }

    if (result.error) {
      console.error('Save error:', result.error);
      return res.status(500).json({ error: 'Erro ao salvar dados' });
    }

    return res.status(200).json({ success: true, updated_at: result.data.updated_at });
  } catch (err) {
    console.error('Save error:', err);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};
