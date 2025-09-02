export const securityNonce = () => {

  let text = '';
  const possible = 'ABCD@#LMNO+_21&@!TUVWXYZabcde*&&v14jklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};
