const { getSupabase } = require('../_lib/supabase');
const { signToken, cors } = require('../_lib/auth');
const bcrypt = require('bcryptjs');

module.exports = async (req, res) => {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const supabase = getSupabase();

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle();

    if (!profile || !profile.password_hash) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    const valid = await bcrypt.compare(password, profile.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    // Update last_login
    try {
      await supabase
        .from('profiles')
        .update({
          last_login: new Date().toISOString(),
          login_count: (profile.login_count || 0) + 1
        })
        .eq('id', profile.id);
    } catch (_) { /* non-blocking */ }

    const token = signToken(profile);

    return res.status(200).json({
      token,
      user: {
        id: profile.id,
        email: profile.email,
        name: profile.display_name || '',
        avatar: profile.avatar || '💕',
        avatar_url: profile.avatar_url || '',
        bio: profile.bio || '',
        theme: profile.theme || 'comfy',
        accent_color: profile.accent_color || '#f5c518',
        level: profile.level || 1,
        xp: profile.xp || 0,
        title: profile.title || 'Novato',
        badges: profile.badges || [],
        preferences: profile.preferences || {},
        login_count: (profile.login_count || 0) + 1,
        created_at: profile.created_at
      }
    });
  } catch (err) {
    return res.status(500).json({ error: 'Erro interno', debug: err.message });
  }
};
