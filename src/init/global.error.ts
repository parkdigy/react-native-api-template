import api, { ApiError } from '../common/api';

declare global {
  /**
   * 파라메터 정보가 유효하지 않음 Error 객체를 반환합니다.
   * @param name 파라메터 이름
   * @returns 에러 객체
   */
  function paramError(name?: string): ApiError;
}

/********************************************************************************************************************
 * parseError
 * ******************************************************************************************************************/
globalThis.paramError = (name?: string) => {
  if (name != null) {
    return api.newError(api.Error.Parameter, { text: `'${name}' 파라메터 정보가 유효하지 않습니다.` });
  } else {
    return api.Error.Parameter;
  }
};

export {};
