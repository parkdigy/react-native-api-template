declare global {
  /**
   * 파라메터 정보가 유효하지 않음 Error 객체를 반환합니다.
   * @param name 파라메터 이름
   * @returns 에러 객체
   */
  function paramError(name?: string): Error;
}

/********************************************************************************************************************
 * parseError
 * ******************************************************************************************************************/
globalThis.paramError = (name?: string) => {
  if (name != null) {
    return new Error(`'${name}' 파라메터 정보가 유효하지 않습니다.`);
  } else {
    return new Error('파라메터 정보가 유효하지 않습니다.');
  }
};

export {};
