/**
 * 前端数据格式校验的代码集
 */

//邮箱正则表达式
let emailPattern = /.*@.*/;
//手机号码
let telPattern = /^1\d{10}$/;

/**
 * 校验邮箱号码
 * @param email
 * @returns {boolean}
 */
function checkEmail(email) {
    return emailPattern.test(email);
}

/**
 * 校验手机号码格式
 * @param tel
 * @returns {boolean}
 */
function checkTel(tel) {
    return telPattern.test(tel);
}

/**
 * 校验正整数
 * @param num
 * @returns {boolean}
 */
function checkPositiveInteger(num) {
    let r = /^\+?[1-9][0-9]*$/;
    return r.test(num);
}