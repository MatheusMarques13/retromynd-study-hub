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
      return res.status(400).json({ error: 'Email, senha e nome são obrigatórios' });
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
      return res.status(409).json({ error: 'Email já cadastrado' });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 12);

    // Create profile
    const { data: profile, error: profileErr } = await supabase
      .from('profiles')
      .insert({
        email: email.toLowerCase().trim(),
        password_hash,
        display_name: name.trim(),
        avatar: '💕',
        bio: ''
      })
      .select()
      .single();

    if (profileErr) {
      console.error('Profile insert error:', profileErr);
      return res.status(500).json({ error: 'Erro ao criar perfil' });
    }

    // Create default user_data entries
    const defaults = [
      { user_id: profile.id, data_type: 'goals', data: { items: [], history: [] } },
      { user_id: profile.id, data_type: 'notes', data: { notes: [] } },
      { user_id: profile.id, data_type: 'timer', data: { pomodoros: 0, totalMinutes: 0 } },
      { user_id: profile.id, data_type: 'streak', data: { current: 0, best: 0, days: [] } },
      { user_id: profile.id, data_type: 'hub_state', data: {} }
    ];

    await supabase.from('user_data').insert(defaults);

    // Generate token
    const token = signToken(profile);

    return res.status(201).json({
      token,
      user: {
        id: profile.id,
        email: profile.email,
        name: profile.display_name,
        avatar: profile.avatar,
        bio: profile.bio,
        created_at: profile.created_at
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};
