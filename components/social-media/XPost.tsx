import { X_POST_TWEET, X_UPLOAD_MEDIA } from '@/contanst';
import { setAccessToken } from '@/state/slices/xSlice';
import { faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useMutation, useToast } from '~/hooks';
import { RootState } from '~/store';

interface TweetRequest {
  card_uri?: string;
  community_id?: string;
  direct_message_deep_link?: string;
  for_super_followers_only?: boolean;
  geo?: {
    place_id?: string;
  };
  image?: string | undefined; // Recibimos el base64 para subirlo a X y despues relacionar el ID
  nullcast?: boolean;
  poll?: {
    duration_minutes?: number;
    options?: string[];
    reply_settings?: 'mentionedUsers' | 'following' | 'everyone';
  };
  quote_tweet_id?: string;
  reply?: {
    exclude_reply_user_ids?: string[];
    in_reply_to_tweet_id?: string;
  };
  reply_settings?: 'mentionedUsers' | 'following' | 'everyone';
  text: string;
  media?: {
    media_ids: string[];
  };
}

export const XPost: React.FC<TweetRequest> = (props) => {
  const { addToast } = useToast();
  const token = useSelector((state: RootState) => state.xAuth.accessToken);
  const { mutate, loading } = useMutation<{ id: string }>(X_POST_TWEET, 'POST');
  const { mutate: uploadMedia, loading: uploadindMedia } = useMutation<{ id: string }>(X_UPLOAD_MEDIA, 'POST');
  const dispatch = useDispatch();

  const handleShare = async () => {
    const body = {
      ...props,
    };

    try {
      // Subimos imagen primero si existe
      if (props.image) {
        const response = await uploadMedia({ imageBase64: props.image }, { xAccessToken: token || '' });
        if (!response?.id) return;

        body.media = {
          media_ids: [response.id],
        };
        body.image = undefined;
      }

      const response = await mutate(body, { xAccessToken: token || '' });
      if (response?.id) {
        addToast('Post exitosamente publicado', 'success');
      }
    } catch (error) {
      let message = 'Ocurrió un error desconocido';

      try {
        const matches = (error as Error).message.match(/{.*}/);
        if ((error as Error).message.includes('401')) {
          dispatch(setAccessToken(null));
          addToast('Acceso de X expirado, por favor vuelve a iniciar sesión', 'info');
          return;
        }
        if (matches) {
          const json = JSON.parse(matches[0]);
          if (json.detail) {
            message = json.detail;
          }
        }
      } catch (err) {
        console.error(err);
      }
      addToast(message, 'danger');
    }
  };

  return (
    <button
      onClick={handleShare}
      disabled={loading || (!props.text && !props.image)}
      className={`flex px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition items-center ${loading || uploadindMedia || (!props.text && !props.image) ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {loading || uploadindMedia ? (
        'Cargando...'
      ) : (
        <>
          Compártelo en <FontAwesomeIcon icon={faXTwitter} className="ml-2" />
        </>
      )}
    </button>
  );
};
