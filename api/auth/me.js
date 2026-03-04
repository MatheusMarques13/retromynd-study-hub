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

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', tokenUser.id)
      .single();

    if (!profile) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    return res.status(200).json({
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
        login_count: profile.login_count || 0,
        created_at: profile.created_at
      }
    });
  } catch (err) {
    return res.status(500).json({ error: 'Erro interno', debug: err.message });
  }
};
