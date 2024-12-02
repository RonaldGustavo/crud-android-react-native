import axios from 'axios';

export const sendNotifFirebase = async (tokenMobile, type) => {
  // hard code token oauth2
  const serverKey =
    'AAAAdHfwx-g:APA91bE3rIZZgiJsOlxcHpM9tREqnpjsRR-vDVQ36wyOye8Bl9jyDj6-ihYJ4H4k7aUleITu7c18d9_sXganbBXZds4fvpzLYsuerc6Hg_0uBD1FpsSLgftbsO0JODryK8zSO8BIWnuJ';
  const body = {
    to: tokenMobile,
    notification: {
      body: 'success firebase',
      title: type,
    },
  };

  const response = await axios({
    url: 'https://fcm.googleapis.com/fcm/send',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `key= ${serverKey}`,
    },
    data: body,
  });

  console.log('response firebase', response);

  return response.data;
};
