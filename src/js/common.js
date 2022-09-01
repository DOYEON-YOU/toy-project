import { followAPI, unFollowAPI } from './API';

const idRegExp = /^[a-zA-Z0-9]*$/;
const emailRegExp = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
const pwRegExp =
  /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{6,15}$/;

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
    const clone = { ...prev };
    clone[key] = value;
    return clone;
  });
};

export const readImage = (file, setUser) => {
  const reader = new FileReader();
  reader.onload = () => {
    const imageUrl = reader.result;
    changeState(setUser, 'img', imageUrl);
  };
  reader.readAsDataURL(new Blob([file], { type: 'image/png' }));
};

export const checkForm = (str, user, setUser, pwChk, setPwChk, pwGuide) => {
  let password;

  if (str === 'signUp') {
    password = user.password;
    if (user.id.trim() === '') {
      alert('아이디를 입력해 주세요.');
      return false;
    } else if (!idRegExp.test(user.id)) {
      changeState(setUser, 'id', '');
      alert('아이디는 영문(대소문자)와 숫자만 사용 가능합니다.');
      return false;
    }
  } else password = user.new_password;
  if (user.password.trim() === '') {
    if (str === 'edit')
      alert('프로필을 수정하시려면 기존 비밀번호를 입력해 주세요.');
    else alert('비밀번호를 입력해 주세요.');
    return false;
  } else if (!emailRegExp.test(user.email) || user.email.trim() === '') {
    alert('이메일을 정확히 입력해 주세요.');
    return false;
  } else if (user.name.trim() === '') {
    alert('닉네임을 입력해 주세요.');
    return false;
  } else if (password && !pwRegExp.test(password)) {
    changeState(setUser, str === 'edit' ? 'new_password' : 'password', '');
    setPwChk('');
    alert(
      '비밀번호는 숫자, 영문, 특수문자 포함 6~15자리 이내만 사용 가능합니다.'
    );
    return false;
  } else if (password && pwChk.trim() === '') {
    if (str === 'edit')
      alert('비밀번호를 변경하시려면 새 비밀번호 확인이 필요합니다.');
    else alert('비밀번호 확인을 입력해 주세요.');
    return false;
  } else if (pwGuide.className === 'notSame') {
    if (str === 'edit') alert('새 비밀번호와 새 비밀번호 확인이 다릅니다.');
    else alert('비밀번호와 비밀번호 확인이 다릅니다.');
    return false;
  } else if (user.profile.trim() === '') {
    alert('한줄소개를 입력해 주세요.');
    return false;
  } else if (user.profile.length < 5) {
    alert('한줄소개는 최소 5글자 이상 입력해 주세요.');
    return false;
  } else if (user.profile.length > 30) {
    changeState(
      setUser,
      'profile',
      user.profile.slice(0, -(user.profile.length - 30))
    );
    alert('한줄소개는 최대 30글자까지 입력 가능합니다.');
    return false;
  } else return true;
};
