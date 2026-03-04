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

    const { name, avatar, bio } = req.body || {};
    const updates = {};
    if (name !== undefined) updates.display_name = name.trim();
    if (avatar !== undefined) updates.avatar = avatar;
    if (bio !== undefined) updates.bio = bio.trim();

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'Nenhum campo para atualizar' });
    }

    const supabase = getSupabase();

    const { data: profile, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', tokenUser.id)
      .select('id, email, display_name, avatar, bio, created_at')
      .single();

    if (error) {
      console.error('Profile update error:', error);
      return res.status(500).json({ error: 'Erro ao atualizar perfil' });
    }

    return res.status(200).json({
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
    console.error('Profile error:', err);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};
