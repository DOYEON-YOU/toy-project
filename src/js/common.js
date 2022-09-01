import { followAPI, unFollowAPI } from './API';

export const errorInfo = {
  login: '아이디 혹은 비밀번호가 틀렸습니다.\n다시 시도해 주세요.',
  wrongPw: '기존 비밀번호가 틀렸습니다.\n다시 입력해 주세요.',
  server: '잠시 후 다시 시도해 주세요.',
  defaultError: '새로 고침 후 다시 시도해 주세요.',
  sameUser: '동일한 이메일 혹은 아이디가 이미 존재합니다.',
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

export const changeState = (setState, key, value) => {
  setState(prev => {
    const clone = {...prev};
    clone[key] = value;
    return clone;
  })
}

export const readImage = (file, setUser) => {
  const reader = new FileReader();
  reader.onload = () => {
    const imageUrl = reader.result;
    changeState(setUser, 'img', imageUrl)
  };
  reader.readAsDataURL(new Blob([file], { type: 'image/png' }));
};
