const { getSupabase } = require('../_lib/supabase');
const { getUserFromReq, cors } = require('../_lib/auth');

module.exports = async (req, res) => {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const tokenUser = getUserFromReq(req);
    if (!tokenUser) {
      return res.status(401).json({ error: 'Token inválido ou expirado' });
    }

    const supabase = getSupabase();

    // Table schema: id (uuid, = user id), hub_data (jsonb), lesson_data (jsonb), preferences (jsonb), updated_at
    const { data, error } = await supabase
      .from('user_data')
      .select('*')
      .eq('id', tokenUser.id)
      .maybeSingle();

    if (error) {
      console.error('Load Supabase error:', JSON.stringify(error));
      return res.status(500).json({ error: 'Erro ao carregar dados', detail: error.message });
    }

    if (!data) {
      // No data yet for this user — return empty
      return res.status(200).json({});
    }

    // Map from DB columns to what the frontend expects
    const result = {};
    const hubData = data.hub_data || {};

    // hub_data contains: goals, notes, timer, streak
    if (hubData.goals) result.goals = { data: hubData.goals, updated_at: data.updated_at };
    if (hubData.notes) result.notes = { data: hubData.notes, updated_at: data.updated_at };
    if (hubData.timer) result.timer = { data: hubData.timer, updated_at: data.updated_at };
    if (hubData.streak) result.streak = { data: hubData.streak, updated_at: data.updated_at };

    // Also pass lesson_data and preferences if they exist
    if (data.lesson_data) result.lessons = { data: data.lesson_data, updated_at: data.updated_at };
    if (data.preferences) result.preferences = { data: data.preferences, updated_at: data.updated_at };

    return res.status(200).json(result);
  } catch (err) {
    console.error('Load catch error:', err.message);
    return res.status(500).json({ error: 'Erro interno do servidor', detail: err.message });
  }
};
