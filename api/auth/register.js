const { getSupabase } = require('../_lib/supabase');
const { signToken, cors } = require('../_lib/auth');
const bcrypt = require('bcryptjs');

module.exports = async (req, res) => {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { email, password, name } = req.body || {};

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, senha e nome s\u00e3o obrigat\u00f3rios' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Senha deve ter pelo menos 6 caracteres' });
    }

    const supabase = getSupabase();

    // Check existing
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle();

    if (existing) {
      return res.status(409).json({ error: 'Email j\u00e1 cadastrado' });
    }

    const password_hash = await bcrypt.hash(password, 12);

    // Create profile with full schema
    const { data: profile, error: profileErr } = await supabase
      .from('profiles')
      .insert({
        email: email.toLowerCase().trim(),
        password_hash,
        display_name: name.trim(),
        avatar: '\uD83D\uDC95',
        bio: '',
        theme: 'comfy',
        accent_color: '#f5c518',
        level: 1,
        xp: 0,
        title: 'Novato',
        badges: [],
        preferences: {},
        login_count: 1,
        last_login: new Date().toISOString()
      })
      .select()
      .single();

    if (profileErr) {
      return res.status(500).json({
        error: 'Erro ao criar perfil',
        debug: profileErr.message,
        code: profileErr.code
      });
    }

    // Create default user_data
    const defaults = [
      { user_id: profile.id, data_type: 'goals', data: { items: [], history: [] } },
      { user_id: profile.id, data_type: 'notes', data: { notes: [] } },
      { user_id: profile.id, data_type: 'timer', data: { pomodoros: 0, totalMinutes: 0 } },
      { user_id: profile.id, data_type: 'streak', data: { current: 0, best: 0, days: [] } },
      { user_id: profile.id, data_type: 'hub_state', data: {} }
    ];

    await supabase.from('user_data').insert(defaults);

    const token = signToken(profile);

    return res.status(201).json({
      token,
      user: {
        id: profile.id,
        email: profile.email,
        name: profile.display_name,
        avatar: profile.avatar,
        avatar_url: profile.avatar_url || '',
        bio: profile.bio || '',
        theme: profile.theme || 'comfy',
        accent_color: profile.accent_color || '#f5c518',
        level: profile.level || 1,
        xp: profile.xp || 0,
        title: profile.title || 'Novato',
        badges: profile.badges || [],
        preferences: profile.preferences || {},
        created_at: profile.created_at
      }
    });
  } catch (err) {
    return res.status(500).json({ error: 'Erro interno', debug: err.message });
  }
};
