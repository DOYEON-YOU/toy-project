import axios from 'axios';
import { getCookie } from './cookie';

const headers = {
  'Content-Type': 'application/json',
};

const myId = getCookie('myId');

const errorHandling = error => {
  const status = error?.response?.status;
  switch (status) {
    case 401:
      return 'login';
    case 500:
      return 'server';
    default:
      return null;
  }
};

export const loginAPI = async (id, pw) => {
  try {
    return await axios.post(`/api/login?id=${id}&password=${pw}`);
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
    return await axios.get(`/api/user_list?user_id=${myId}`);
  } catch (error) {
    return errorHandling(error);
  }
};

export const getTweetAPI = async (target, other_user_id) => {
  try {
    return await axios.get(
      `/api/timeline?target=${target}&user_id=${myId}${
        target === 'other_user' ? `&other_user_id=${other_user_id}` : ''
      }`
    );
  } catch (error) {
    return errorHandling(error);
  }
};

export const newTweetAPI = async tweet => {
  try {
    return await axios.post(`/api/tweet?user_id=${myId}&tweet=${tweet}`);
  } catch (error) {
    return errorHandling(error);
  }
};

export const followAPI = async target => {
  try {
    return await axios.post(`/api/follow?user_id=${myId}&follow_id=${target}`);
  } catch (error) {
    return errorHandling(error);
  }
};

export const unFollowAPI = async target => {
  try {
    return await axios.post(
      `/api/unfollow?user_id=${myId}&unfollow_id=${target}`
    );
  } catch (error) {
    return errorHandling(error);
  }
};

export const updateTweetAPI = async (tweet_id, update_tweet) => {
  try {
    return await axios.post(
      `/api/tweet_update?user_id=${myId}&tweet_id=${tweet_id}&update_tweet=${update_tweet}`
    );
  } catch (error) {
    return errorHandling(error);
  }
};

export const deleteTweetAPI = async tweet_id => {
  try {
    return await axios.post(`/api/tweet_delete?user_id=${myId}&tweet_id=${tweet_id}`)
  } catch(error) {
    return errorHandling(error)
  }
}