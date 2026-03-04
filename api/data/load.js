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
    const dataType = req.query.type;

    let query = supabase
      .from('user_data')
      .select('data_type, data, updated_at')
      .eq('user_id', tokenUser.id);

    // Optional: filter by type
    if (dataType) {
      query = query.eq('data_type', dataType);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Load error:', error);
      return res.status(500).json({ error: 'Erro ao carregar dados' });
    }

    // Transform to key-value object
    const result = {};
    (data || []).forEach(row => {
      result[row.data_type] = {
        data: row.data,
        updated_at: row.updated_at
      };
    });

    return res.status(200).json(result);
  } catch (err) {
    console.error('Load error:', err);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};
