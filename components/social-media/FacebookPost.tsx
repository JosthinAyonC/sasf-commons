// import React, { useEffect, useState } from "react";
// import { FaFacebook } from "react-icons/fa";
// import { Button } from "~/form/fields";
// import { useMutation } from "~/hooks";
// // TODO> VERIFICAR COMO FUNCIONA ESTO CORRECTAMENTE.
// //https://developers.facebook.com/docs/pages-api/posts
// type FacebookPostProps = {
//     redirectUri?: string;
//     postData: {
//         message: string; // Mensaje del post
//         link?: string; // Si deseamos publicar una imagen en elk post
//         published?: boolean; // True para publicar de inmediaro, false para programar
//         scheduled_publish_time?: number;
//         url?: string; // url de la imagen que queremos en el post
//     };
// };
// export const FacebookPost: React.FC<FacebookPostProps> = ({ postData: { published = true, ...restPostData }, redirectUri = location.href }) => {
//     const postData = { published, ...restPostData };
//     const [accessToken, setAccessToken] = useState<string | null>(null);
//     const [userId, setUserId] = useState<string | null>(null);
//     // const [pages, setPages] = useState<{ id: string; name: string; access_token: string }[]>([]);
//     const { mutate: publicarInprofile } = useMutation<{ id: string, post_id: string }>(`https://graph.facebook.com/v22.0/${userId}/feed`, "POST");
//     const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
//     const SCOPES = process.env.FACEBOOK_SCOPES;
//     useEffect(() => {
//         fetchUserData(accessToken);
//     }, []);
//     // Iniciar login con Facebook
//     const loginWithFacebook = () => {
//         const authUrl = `https://www.facebook.com/v22.0/dialog/oauth?client_id=${FACEBOOK_APP_ID}&redirect_uri=${redirectUri}&scope=${SCOPES}&response_type=code`;
//         window.location.href = authUrl;
//     };
//     // Extraer el código de autorización de la URL
//     useEffect(() => {
//         const params = new URLSearchParams(window.location.search);
//         const code = params.get("code");
//         if (code) {
//             fetchAccessToken(code);
//         }
//     }, []);
//     // Intercambiar código de autorización por access_token (DEBE HACERSE EN BACKEND)
//     const fetchAccessToken = async (code: string) => {
//         try {
//             window.history.replaceState({}, document.title, window.location.pathname);
//             const response = await fetch(`https://graph.facebook.com/v19.0/oauth/access_token?client_id=${FACEBOOK_APP_ID}&redirect_uri=${redirectUri}&client_secret=${"secret"}&code=${code}`);
//             const data = await response.json();
//             // remove query params from URL
//             setAccessToken(data.access_token);
//             fetchUserData(data.access_token);
//         } catch (error) {
//             console.error("Error obteniendo el access_token:", error);
//         }
//     };
//     // Obtener datos del usuario
//     const fetchUserData = async (token: string) => {
//         try {
//             const response = await fetch(`https://graph.facebook.com/me?fields=id,name,email&access_token=${token}`);
//             const data = await response.json();
//             setUserId(data.id);
//             console.log("Usuario:", data);
//         } catch (error) {
//             console.error("Error obteniendo datos del usuario:", error);
//         }
//     };
//     // // Obtener páginas administradas
//     // const fetchUserPages = async () => {
//     //     if (!accessToken) return;
//     //     try {
//     //         const response = await fetch(`https://graph.facebook.com/me/accounts?access_token=${accessToken}`);
//     //         const data = await response.json();
//     //         setPages(data.data);
//     //     } catch (error) {
//     //         console.error("Error obteniendo páginas:", error);
//     //     }
//     // };
//     // Publicar en el perfil
//     const publishToFeed = async () => {
//         if (!accessToken) return;
//         try {
//             const response = await publicarInprofile(postData);
//             console.log("Publicación en perfil exitosa:", response);
//         } catch (error) {
//             console.error("Error publicando en perfil:", error);
//         }
//     };
//     // // Publicar en una página
//     // const publishToPage = async (pageId: string, pageAccessToken: string) => {
//     //     try {
//     //         const response = await fetch(`https://graph.facebook.com/${pageId}/feed?access_token=${pageAccessToken}`, {
//     //             method: "POST",
//     //             body: new URLSearchParams(postData),
//     //         });
//     //         const data = await response.json();
//     //         console.log("Publicación en página exitosa:", data);
//     //     } catch (error) {
//     //         console.error("Error publicando en página:", error);
//     //     }
//     // };
//     return (
//         <div>
//             {!accessToken ? (
//                 <Button className="bg-[#3C66C4] hover:bg-[#4870c7]" onClick={loginWithFacebook}><FaFacebook className="mr-2" />Iniciar sesión con Facebook</Button>
//             ) : (
//                 <>
//                     <p>Usuario autenticado 🎉</p>
//                     <Button onClick={publishToFeed}>Publicar en mi perfil</Button>
//                     {/* <Button onClick={fetchUserPages}>Obtener mis páginas</Button> */}
//                     {/* {pages.map((page) => (
//                         <div key={page.id}>
//                             <p>Página: {page.name}</p>
//                             <Button onClick={() => publishToPage(page.id, page.access_token)}>Publicar en esta página</Button>
//                         </div>
//                     ))} */}
//                 </>
//             )}
//         </div>
//     );
// };
import React from 'react';
import { Button } from '~/form/fields';

type FacebookPostProps = {
  url: string;
  quote: string;
  hashtag: string;
};

export const FacebookPost: React.FC<FacebookPostProps> = ({ url, quote, hashtag }) => {
  const handleFacebook = () => {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&description=${encodeURIComponent(quote)}&hashtag=${encodeURIComponent(hashtag)}`;
    window.open(shareUrl, 'facebook-share-dialog', 'width=900,height=750');
  };

  return (
    <div>
      <Button onClick={handleFacebook}>Compartir en Facebook</Button>
    </div>
  );
};
