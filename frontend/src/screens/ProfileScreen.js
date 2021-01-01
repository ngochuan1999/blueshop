import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { detailsUser, updateUserProfile } from '../actions/userActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants';

export default function ProfileScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;
  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const {
    success: successUpdate,
    error: errorUpdate,
    loading: loadingUpdate,
  } = userUpdateProfile;
  const dispatch = useDispatch();
  useEffect(() => {
    if (!user) {
      dispatch({ type: USER_UPDATE_PROFILE_RESET });
      dispatch(detailsUser(userInfo._id));
    } else {
      setName(user.name);
      setEmail(user.email);

    }
  }, [dispatch, userInfo._id, user]);;
  const submitHandler = (e) => {
    e.preventDefault();
    // dispatch update profile
    if (password !== confirmPassword) {
      alert('Nhập lại mật khẩu không khớp!');
    } else {
      dispatch(updateUserProfile({ userId: user._id, name, email, password }));
    }
  };
  return (
    <div>
      <form className="form" onSubmit={submitHandler}>
        <div>
          <h1>Thông tin tài khoản</h1>
        </div>
        {loading ? (
          <LoadingBox></LoadingBox>
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
              <>
                {loadingUpdate && <LoadingBox></LoadingBox>}
                {errorUpdate && (
                  <MessageBox variant="danger">{errorUpdate}</MessageBox>
                )}
                {successUpdate && (
                  <MessageBox variant="success">
                    Hồ sơ được cập nhật thành công!
                  </MessageBox>
                )}
                <div>
                  <label htmlFor="name">Tên</label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  ></input>
                </div>
                <div>
                  <label htmlFor="email">Địa chỉ Email</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Nhập email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  ></input>
                </div>
                <div>
                  <label htmlFor="password">Mật khẩu</label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Nhập mật khẩu"
                    onChange={(e) => setPassword(e.target.value)}
                  ></input>
                </div>
                <div>
                  <label htmlFor="confirmPassword">Nhập lại mật khẩu</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Nhập lại mật khẩu"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  ></input>
                </div>

                <div>
                  <label />
                  <button className="primary" type="submit">
                    Cập nhật
              </button>
                </div>
              </>
            )}
      </form>
    </div>
  );
}