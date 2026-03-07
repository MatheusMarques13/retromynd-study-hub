const { cors } = require('./_lib/auth');

module.exports = async (req, res) => {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const checks = {
    server: 'ok',
    jwt_secret: !!process.env.JWT_SECRET ? 'ok' : 'MISSING',
    supabase_url: !!process.env.SUPABASE_URL ? 'ok' : 'MISSING',
    supabase_key: !!process.env.SUPABASE_SERVICE_ROLE_KEY ? 'ok' : 'MISSING',
    timestamp: new Date().toISOString()
  };

  if (checks.supabase_url === 'ok' && checks.supabase_key === 'ok') {
    try {
      const { getSupabase } = require('./_lib/supabase');
      const supabase = getSupabase();
      // Schema: id (uuid), hub_data (jsonb), lesson_data (jsonb), preferences (jsonb), updated_at
      const { error } = await supabase.from('user_data').select('id').limit(1);
      checks.supabase_connection = error ? 'FAIL: ' + error.message : 'ok';
    } catch (e) {
      checks.supabase_connection = 'FAIL: ' + e.message;
    }
  }

  const allOk = Object.values(checks).every(v => v === 'ok' || v === checks.timestamp);
  return res.status(allOk ? 200 : 503).json(checks);
};
