package com.jxctdzkj.cloudplatform.radis;

import org.crazycake.shiro.RedisManager;

import java.util.Set;

import lombok.extern.slf4j.Slf4j;

/**
 * <pre>
 *     @author  : FlySand
 *     @e-mail  : 1156183505@qq.com
 *     @time    : 2019/3/22.
 *     @desc    :
 * </pre>
 */
@Slf4j
public class RedisPoolManager extends RedisManager {

    boolean isLog = false;

    public RedisPoolManager() {
    }

    public void init() {

    }

    public byte[] get(byte[] key) {
        byte[] value = RedisUtil.getInstance().get(key);
        try {
            if (isLog)
                log.info("get key:" + new String(key) + " value:" + new String(value));
        } catch (Exception e) {
            log.info("get  value:" + new String(value));
            log.info(e.toString());
        }
        return value;
    }

    public byte[] set(byte[] key, byte[] value) {
        if (isLog)
            log.info("set key:" + new String(key) + " value:" + new String(value));
        return RedisUtil.getInstance().set(key, value);
    }

    public byte[] set(byte[] key, byte[] value, int expire) {
        if (isLog)
            log.info("set key:" + new String(key) + " value:" + new String(value) + " expire：" + expire);
        return RedisUtil.getInstance().set(key, value, expire);
    }

    public void del(byte[] key) {
        if (isLog)
            log.info("del " + new String(key));
        RedisUtil.getInstance().delKey(key);
    }

    public void flushDB() {
        log.error("flushDB");
    }

    public Long dbSize() {
        Long dbSize = 0L;
        log.error("dbSize");
        return dbSize;
    }

    public Set<byte[]> keys(String pattern) {
        return RedisUtil.getInstance().hkeys(pattern.getBytes());
    }

}
