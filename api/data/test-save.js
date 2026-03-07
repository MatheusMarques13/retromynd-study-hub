const { getSupabase } = require('../_lib/supabase');
const { getUserFromReq, verifyToken, cors } = require('../_lib/auth');

module.exports = async (req, res) => {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    let tokenUser = getUserFromReq(req);
    if (!tokenUser && req.query.token) {
      tokenUser = verifyToken(req.query.token);
    }
    if (!tokenUser) {
      return res.status(401).json({ error: 'Not authenticated - add ?token=YOUR_TOKEN to URL' });
    }

    const supabase = getSupabase();
    const userId = tokenUser.id;
    const results = {};

    // Test 1: Try SELECT
    const { data: selectData, error: selectErr } = await supabase
      .from('user_data')
      .select('id')
      .eq('id', userId)
      .maybeSingle();
    results.select = { data: selectData, error: selectErr ? selectErr.message : null };

    // Test 2: Try UPSERT
    const { data: upsertData, error: upsertErr } = await supabase
      .from('user_data')
      .upsert({ id: userId, hub_data: { test: true }, updated_at: new Date().toISOString() }, { onConflict: 'id' })
      .select('id, updated_at')
      .single();
    results.upsert = { 
      data: upsertData, 
      error: upsertErr ? { 
        message: upsertErr.message, 
        code: upsertErr.code, 
        details: upsertErr.details, 
        hint: upsertErr.hint,
        status: upsertErr.status
      } : null 
    };

    // Test 3: Check env var presence
    results.env = {
      supabase_url: !!process.env.SUPABASE_URL,
      service_role_key_starts: process.env.SUPABASE_SERVICE_ROLE_KEY ? process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 10) + '...' : 'MISSING',
      key_length: process.env.SUPABASE_SERVICE_ROLE_KEY ? process.env.SUPABASE_SERVICE_ROLE_KEY.length : 0
    };

    results.user_id = userId;

    return res.status(200).json(results);
  } catch (err) {
    return res.status(500).json({ error: err.message, stack: err.stack });
  }
};
