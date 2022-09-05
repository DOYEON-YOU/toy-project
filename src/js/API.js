import axios from 'axios';

//= Header
const headers = {
  'Content-Type': 'application/json',
};

//= Error Handling
const errorHandling = async error => {
  const status = error?.response?.status;
  const detail = error?.response?.data?.detail;
  switch (status) {
    case 401:
      if (detail === 'password incorrect') return 'login';
      else if (detail === 'wrongPw') return 'wrongPw';
      else if (detail === 'samePw') return 'samePw';
      break;
    case 403:
      if (detail === 'sameId') return 'sameId';
      else if (detail === 'sameEmail') return 'sameEmail';
      break;
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

//= 로그인, 회원가입, 회원 탈퇴 등 Default API
//~ 로그인
export const signInAPI = async (id, pw) => {
  try {
    return await axios.post(`/api/sign-in?user_id=${id}&password=${pw}`);
  } catch (error) {
    return errorHandling(error);
  }
};

//~ 회원가입
export const signUpAPI = async query => {
  try {
    return await axios.post(`/api/sign-up`, query, { headers });
  } catch (error) {
    return errorHandling(error);
  }
};

//~ 회원탈퇴
export const resignAPI = async pw => {
  try {
    return await axios.post(
      `/api/resign?user_id=${sessionStorage.getItem('myId')}&password=${pw}`
    );
  } catch (error) {
    return errorHandling(error);
  }
};

//= USER API
//~ 유저 리스트
export const getUserAPI = async () => {
  try {
    return await axios.get(
      `/api/user/list?user_id=${sessionStorage.getItem('myId')}`
    );
  } catch (error) {
    return errorHandling(error);
  }
};

//~ 회원 정보 수정
export const editUserInfoAPI = async query => {
  try {
    return await axios.post(`/api/user/update`, query, { headers });
  } catch (error) {
    return errorHandling(error);
  }
};

//~ 유저 팔로우
export const followAPI = async target => {
  try {
    return await axios.post(
      `/api/user/follow?user_id=${sessionStorage.getItem(
        'myId'
      )}&follow_id=${target}`
    );
  } catch (error) {
    return errorHandling(error);
  }
};

//~ 유저 언팔로우
export const unFollowAPI = async target => {
  try {
    return await axios.post(
      `/api/user/unfollow?user_id=${sessionStorage.getItem(
        'myId'
      )}&unfollow_id=${target}`
    );
  } catch (error) {
    return errorHandling(error);
  }
};

//~ 팔로잉 / 팔로워 리스트
export const getFollowAPI = async (target, user_id) => {
  try {
    return await axios.get(`/api/user/${target}_list?user_id=${user_id}`);
  } catch (error) {
    return errorHandling(error);
  }
};

//= TWEET API
//~ 트윗 리스트
export const getTweetAPI = async (target, other_user_id) => {
  try {
    return await axios.get(
      `/api/tweet/list?target=${target}&user_id=${sessionStorage.getItem(
        'myId'
      )}${target === 'other_user' ? `&other_user_id=${other_user_id}` : ''}`
    );
  } catch (error) {
    return errorHandling(error);
  }
};

//~ 새 트윗 게시
export const newTweetAPI = async tweet => {
  try {
    return await axios.post(
      `/api/tweet/posting?user_id=${sessionStorage.getItem(
        'myId'
      )}&tweet=${tweet}`
    );
  } catch (error) {
    return errorHandling(error);
  }
};

//~ 내 트윗 수정
export const updateTweetAPI = async (tweet_id, update_tweet) => {
  try {
    return await axios.post(
      `/api/tweet/update?user_id=${sessionStorage.getItem(
        'myId'
      )}&tweet_id=${tweet_id}&update_tweet=${update_tweet}`
    );
  } catch (error) {
    return errorHandling(error);
  }
};

//~ 내 트윗 삭제
export const deleteTweetAPI = async tweet_id => {
  try {
    return await axios.post(
      `/api/tweet/delete?user_id=${sessionStorage.getItem(
        'myId'
      )}&tweet_id=${tweet_id}`
    );
  } catch (error) {
    return errorHandling(error);
  }
};

//~ 댓글 불러오기
export const getCommentAPI = async tweet_id => {
  try {
    return await axios.get(`/api/tweet/comment?tweet_id=${tweet_id}`, {
      headers,
    });
  } catch (error) {
    return errorHandling(error);
  }
};

//~ 댓글 작성
export const postCommentAPI = async (tweet_id, comment) => {
  try {
    return await axios.post(
      `/api/tweet/comment/posting?tweet_id=${tweet_id}&user_id=${sessionStorage.getItem(
        'myId'
      )}&comment=${comment}`
    );
  } catch (error) {
    return errorHandling(error);
  }
};

//~ 댓글 수정
export const editCommentAPI = async (comment_id, comment) => {
  try {
    return await axios.post(
      `/api/tweet/comment/update?user_id=${sessionStorage.getItem(
        'myId'
      )}&comment_id=${comment_id}&update_comment=${comment}`
    );
  } catch (error) {
    return errorHandling(error);
  }
};

//~ 댓글 삭제
export const delCommentAPI = async comment_id => {
  try {
    return await axios.post(
      `/api/tweet/comment/delete?user_id=${sessionStorage.getItem(
        'myId'
      )}&comment_id=${comment_id}`
    );
  } catch (error) {
    return errorHandling(error);
  }
};
