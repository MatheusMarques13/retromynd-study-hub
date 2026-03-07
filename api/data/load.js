const { getSupabase } = require('../_lib/supabase');
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

    const supabase = getSupabase();

    // Debug mode: show table columns
    if (req.query.debug === '1') {
      const { data, error } = await supabase.from('user_data').select('*').limit(1);
      if (error) return res.status(500).json({ error: error.message });
      const columns = data && data.length > 0 ? Object.keys(data[0]) : 'table empty or no rows';
      return res.status(200).json({ columns, sample: data });
    }

    // Use select(*) and map dynamically
    const { data, error } = await supabase
      .from('user_data')
      .select('*')
      .eq('user_id', tokenUser.id);

    if (error) {
      console.error('Load Supabase error:', JSON.stringify(error));
      return res.status(500).json({ 
        error: 'Erro ao carregar dados',
        detail: error.message || error.code || JSON.stringify(error)
      });
    }

    // Transform to key-value object
    // Try multiple possible column names for data_type
    const result = {};
    (data || []).forEach(row => {
      const type = row.data_type || row.type || row.datatype || row.kind || 'unknown';
      result[type] = {
        data: row.data || row.content || row.value,
        updated_at: row.updated_at || row.updatedat || row.modified_at
      };
    });

    return res.status(200).json(result);
  } catch (err) {
    console.error('Load catch error:', err.message, err.stack);
    return res.status(500).json({ 
      error: 'Erro interno do servidor',
      detail: err.message
    });
  }
};
