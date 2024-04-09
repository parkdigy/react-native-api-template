/********************************************************************************************************************
 * (Test) 인증 Controller
 * ******************************************************************************************************************/

import { MyRequest, MyResponse } from '@types';
import { Param_Email_Required, Param_Enum, Param_Password_Required } from '@common_param';

export default {
  /********************************************************************************************************************
   * 로그인 HTML
   * ******************************************************************************************************************/
  async getSignInHtml(req: MyRequest, res: MyResponse) {
    res.send(`
      <h1>로그인</h1>
      <form method="post">
        <input type="text" name="email" placeholder="이메일" />
        <input type="password" name="password" placeholder="비밀번호" />
        <input type="submit" value="로그인" />
      </form>
    `);
  },

  /********************************************************************************************************************
   * 로그인
   * ******************************************************************************************************************/
  async signIn(req: MyRequest, res: MyResponse) {
    const { email, password } = param(req, {
      email: Param_Email_Required(),
      password: Param_Password_Required(),
    });

    const userInfo = await db.User.infoForSignIn(req, email);
    if (userInfo == null || !util.password.check(password, userInfo.password)) {
      throw new Error('이메일 또는 비밀번호가 일치하지 않습니다.');
    }

    jwt.saveAccessToken(req, res, userInfo.id);

    res.redirect('/test');
  },

  /********************************************************************************************************************
   * 로그아웃
   * ******************************************************************************************************************/
  signOut(req: MyRequest, res: MyResponse) {
    jwt.clearAccessToken(res);

    res.redirect('/test');
  },

  /********************************************************************************************************************
   * 회원가입 HTML
   * ******************************************************************************************************************/
  getSignUpHtml(req: MyRequest, res: MyResponse) {
    res.send(`
      <h1>회원가입</h1>
      <form method="post">
        <input type="text" name="email" placeholder="이메일" />
        <input type="password" name="password" placeholder="비밀번호" />
        <input type="hidden" name="integer" value="111" />
        <input type="submit" value="가입" />
      </form>
    `);
  },

  /********************************************************************************************************************
   * 회원가입
   * ******************************************************************************************************************/
  async signUp(req: MyRequest, res: MyResponse) {
    const { email, password, status } = param(req, {
      email: Param_Email_Required(),
      password: Param_Password_Required(),
      status: Param_Enum(db.User.Status.getList(), { defaultValue: db.User.Status.On }),
    });

    if (await db.User.exists(req, { email })) {
      throw new Error('이미 사용 중인 이메일입니다.');
    }

    const userId = (
      await db.User.add(req, {
        email,
        password: util.password.hash(password),
        status: status,
        create_date: now(),
        update_date: now(),
      })
    )[0];

    jwt.saveAccessToken(req, res, userId);

    res.redirect('/test');
  },
};
