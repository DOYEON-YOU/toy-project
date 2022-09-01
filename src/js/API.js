import axios from 'axios';

const headers = {
  'Content-Type': 'application/json',
};

const errorHandling = async error => {
  const status = error?.response?.status;
  const detail = error?.response?.data?.detail;
  switch (status) {
    case 401:
      if (detail === 'wrongPw') return 'wrongPw';
      else if (detail === 'password incorrect') return 'login';
      break;
    case 403:
      return await detail;
    case 422:
      return 'defaultError';
    case 402:
    case 500:
    case 501:
    case 502:
      return 'server';
    default:
      return null;
  }
};

export const loginAPI = async (id, pw) => {
  try {
    return await axios.post(`/api/login?user_id=${id}&password=${pw}`);
  } catch (error) {
    return errorHandling(error);
  }
};

export const signUpAPI = async query => {
  try {
    return await axios.post(`/api/sign-up`, query, { headers });
  } catch (error) {
    return errorHandling(error);
  }
};

export const getUserAPI = async () => {
  try {
    return await axios.get(
      `/api/user_list?user_id=${sessionStorage.getItem('myId')}`
    );
  } catch (error) {
    return errorHandling(error);
  }
};

export const getTweetAPI = async (target, other_user_id) => {
  try {
    return await axios.get(
      `/api/timeline?target=${target}&user_id=${sessionStorage.getItem(
        'myId'
      )}${target === 'other_user' ? `&other_user_id=${other_user_id}` : ''}`
    );
  } catch (error) {
    return errorHandling(error);
  }
};

export const newTweetAPI = async tweet => {
  try {
    return await axios.post(
      `/api/tweet?user_id=${sessionStorage.getItem('myId')}&tweet=${tweet}`
    );
  } catch (error) {
    return errorHandling(error);
  }
};

export const followAPI = async target => {
  try {
    return await axios.post(
      `/api/follow?user_id=${sessionStorage.getItem(
        'myId'
      )}&follow_id=${target}`
    );
  } catch (error) {
    return errorHandling(error);
  }
};

export const unFollowAPI = async target => {
  try {
    return await axios.post(
      `/api/unfollow?user_id=${sessionStorage.getItem(
        'myId'
      )}&unfollow_id=${target}`
    );
  } catch (error) {
    return errorHandling(error);
  }
};

export const updateTweetAPI = async (tweet_id, update_tweet) => {
  try {
    return await axios.post(
      `/api/tweet_update?user_id=${sessionStorage.getItem(
        'myId'
      )}&tweet_id=${tweet_id}&update_tweet=${update_tweet}`
    );
  } catch (error) {
    return errorHandling(error);
  }
};

export const deleteTweetAPI = async tweet_id => {
  try {
    return await axios.post(
      `/api/tweet_delete?user_id=${sessionStorage.getItem(
        'myId'
      )}&tweet_id=${tweet_id}`
    );
  } catch (error) {
    return errorHandling(error);
  }
};

export const editUserInfoAPI = async query => {
  try {
    return await axios.post(`/api/user_update`, query, { headers });
  } catch (error) {
    return errorHandling(error);
  }
};
