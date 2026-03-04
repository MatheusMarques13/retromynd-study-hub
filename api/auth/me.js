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
      .select('id, email, display_name, avatar, bio, created_at')
      .eq('id', tokenUser.id)
      .single();

    if (!profile) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
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
    console.error('Me error:', err);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};
