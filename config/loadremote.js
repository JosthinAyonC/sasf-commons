export async function loadRemote(remoteUrl, scope) {
  await new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = remoteUrl;
    script.type = 'text/javascript';
    script.async = true;
    script.onload = () => {
      console.log(`Remote ${scope} loaded`);
      resolve();
    };
    script.onerror = () => {
      console.error(`Error loading remote ${scope}`);
      reject();
    };
    document.head.appendChild(script);
  });

  await __webpack_init_sharing__('default');
  const container = window[scope];
  await container.init(__webpack_share_scopes__.default);
}
