import { X_AUTH_TOKEN } from '@/contanst';
import { setAccessToken, setLoading } from '@/state/slices/xSlice';
import { faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { RootState } from '~/store';
import { generateCodeChallenge, generateCodeVerifier } from '~/utils/Functions';

export const XLogin = () => {
  const dispatch = useDispatch();
  const { loading, accessToken } = useSelector((state: RootState) => state.xAuth);
  const codeVerifier = localStorage.getItem('code_verifier');

  const [params] = useSearchParams();
  const code = params.get('code');

  useEffect(() => {
    const claimToken = async () => {
      if (!code || !codeVerifier) return;

      dispatch(setLoading(true));

      try {
        const res = await fetch(X_AUTH_TOKEN || '', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            value: code,
            codeVerifier: codeVerifier,
          }),
        });

        const data = await res.json();

        dispatch(setAccessToken(data.accessToken));
      } catch (error) {
        console.error('Error al hacer claim del token:', error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    claimToken();
  }, [code, codeVerifier, dispatch]);

  const handleLogin = async () => {
    const codeVerifier = generateCodeVerifier();
    localStorage.setItem('code_verifier', codeVerifier);

    const codeChallenge = await generateCodeChallenge(codeVerifier);

    const clientId = process.env.X_CLIENT_ID;
    const redirectUri = process.env.X_REDIRECT_URI || 'https://localhost:3000/x/callback';
    const scopes = process.env.X_SCOPES || 'tweet.read';
    const state = Math.random().toString(36).substring(2);

    const authUrl =
      `https://twitter.com/i/oauth2/authorize?` +
      `response_type=code` +
      `&client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=${encodeURIComponent(scopes)}` +
      `&state=${state}` +
      `&code_challenge=${codeChallenge}` +
      `&code_challenge_method=S256`;

    window.location.href = authUrl;
  };

  return (
    <button onClick={handleLogin} disabled={loading} className="flex px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition items-center">
      {loading ? (
        'Cargando...'
      ) : (
        <>
          {' '}
          <FontAwesomeIcon icon={faXTwitter} className="mr-2" />
          {accessToken ? 'Ya has iniciado sesión' : 'Iniciar sesión con X'}
        </>
      )}
    </button>
  );
};
