const { getSupabase } = require('../_lib/supabase');
const { getUserFromReq, cors } = require('../_lib/auth');

module.exports = async (req, res) => {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const tokenUser = getUserFromReq(req);
    if (!tokenUser) {
      return res.status(401).json({ error: 'Token inválido ou expirado' });
    }

    const body = req.body || {};
    const updates = {};

    if (body.name !== undefined) updates.display_name = String(body.name).trim();
    if (body.avatar !== undefined) updates.avatar = String(body.avatar).trim();
    if (body.avatar_url !== undefined) updates.avatar_url = String(body.avatar_url).trim();
    if (body.bio !== undefined) updates.bio = String(body.bio).trim();
    if (body.theme !== undefined) {
      const t = String(body.theme).trim();
      if (['comfy', 'retro'].includes(t)) updates.theme = t;
    }
    if (body.accent_color !== undefined) updates.accent_color = String(body.accent_color).trim();
    if (body.preferences !== undefined && typeof body.preferences === 'object') {
      updates.preferences = body.preferences;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'Nenhum campo para atualizar' });
    }

    const supabase = getSupabase();

    const { data: profile, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', tokenUser.id)
      .select('*')
      .single();

    if (error) {
      return res.status(500).json({ error: 'Erro ao atualizar perfil', debug: error.message });
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
