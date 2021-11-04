package com.jxctdzkj.cloudplatform.utils;

import com.jxctdzkj.cloudplatform.radis.RedisUtil;

/**
 * <pre>
 *     author  : FlySand
 *     e-mail  : 1156183505@qq.com
 *     time    : 2018/8/1.
 *     desc    : 验证码工具类
 * </pre>
 */
public class CodeUtil {

    public static Object checkCode(String phone, String code) {
        //读取获取验证码时间
        RedisUtil redis = RedisUtil.getInstance();
        long getCodeTime = Long.valueOf(redis.getSaveString("time:" + phone, "0"));
        if (getCodeTime == 0) {
            return ResultObject.apiError("请先获取验证码");
        }
        if (System.currentTimeMillis() - getCodeTime > 300000) {
            return ResultObject.apiError("验证码失效，请重新获取");
        }

        if (!code.equals(redis.getSaveString("code:" + phone, ""))) {
            return ResultObject.apiError("验证码错误");
        }
        return null;
    }

    public static void resetCode(String phone) {
        //重置验证码时间
        RedisUtil redis = RedisUtil.getInstance();
        redis.delKey("time:" + phone);
        redis.delKey("code:" + phone);
    }
}
