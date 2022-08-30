import { followAPI, unFollowAPI } from './API';

export const errorInfo = {
  login: '아이디 혹은 비밀번호가 틀렸습니다.\n다시 시도해 주세요.',
  server: '잠시 후 다시 시도해 주세요.',
};

export const enterFn = (e, fn) => {
  if (e.keyCode === 13) fn();
  else return;
};

export const follow = async target => {
  return await followAPI(target);
};

export const unFollow = async target => {
  return await unFollowAPI(target);
};
