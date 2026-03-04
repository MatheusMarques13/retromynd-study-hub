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

    // Find user
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle();

    if (!profile) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    // Verify password
    const valid = await bcrypt.compare(password, profile.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    // Generate token
    const token = signToken(profile);

    return res.status(200).json({
      token,
      user: {
        id: profile.id,
        email: profile.email,
        name: profile.display_name,
        avatar: profile.avatar,
        bio: profile.bio || '',
        created_at: profile.created_at
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};
