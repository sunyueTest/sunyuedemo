package com.jxctdzkj.cloudplatform.radis;

import com.jxctdzkj.cloudplatform.config.Constant;
import com.jxctdzkj.support.utils.TextUtils;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import lombok.extern.slf4j.Slf4j;
import redis.clients.jedis.HostAndPort;
import redis.clients.jedis.JedisCluster;
import redis.clients.jedis.JedisPoolConfig;

/**
 * <pre>
 *     author  : FlySand
 *     e-mail  : 1156183505@qq.com
 *     time    : 2018/7/31.
 *     desc    :
 * </pre>
 */
@Slf4j
public class RedisUtil {
    private volatile static RedisUtil instance;
    //    JedisCluster jedis;
//    Jedis jedis2;
    JedisCluster jedis;

    private RedisUtil() {
    }

    private void init() {

//        JedisShardInfo shardInfo = new JedisShardInfo("radis://192.168.2.174:6380");//这里是连接的本地地址和端口
//        shardInfo.setPassword("jxctdzkj");//这里是密码
//        Jedis jedis = new Jedis(shardInfo);
//        jedis.connect();

        try {
//             Jedis连接池配置
            JedisPoolConfig jedisPoolConfig = new JedisPoolConfig();
            // 最大空闲连接数, 默认100个
            jedisPoolConfig.setMaxIdle(100);
            // 最大连接数, 默认500个
            jedisPoolConfig.setMaxTotal(500);
            //最小空闲连接数, 默认1
            jedisPoolConfig.setMinIdle(10);
            // 获取连接时的最大等待毫秒数(如果设置为阻塞时BlockWhenExhausted),如果超时就抛异常, 小于零:阻塞不确定的时间,  默认-1
            jedisPoolConfig.setMaxWaitMillis(2000); // 设置2秒
            //对拿到的connection进行validateObject校验
//            jedisPoolConfig.setTestOnBorrow(true);
            Set<HostAndPort> jedisClusterNode = new HashSet<>();
            if (Constant.Redis.DEBUG) {
                jedisClusterNode.add(new HostAndPort("192.168.2.11", 6380));
                jedisClusterNode.add(new HostAndPort("192.168.2.11", 6381));
                jedisClusterNode.add(new HostAndPort("192.168.2.11", 6382));
            } else {
                jedisClusterNode.add(new HostAndPort("172.17.0.3", 6380));
                jedisClusterNode.add(new HostAndPort("172.17.0.2", 6381));
                jedisClusterNode.add(new HostAndPort("172.17.0.7", 6382));
            }
            jedis = new JedisCluster(jedisClusterNode, 3000, 3000, 1, "jxctdzkj", jedisPoolConfig);
            jedis.set("inittest".getBytes(), "32424".getBytes());
            log.info("redisUtil.init " + jedis.get("inittest".getBytes()));

        } catch (Exception e) {
            log.error(e.toString(), e);
        }
    }

    public static RedisUtil getInstance() {
        if (instance == null) {
            synchronized (RedisUtil.class) {
                if (instance == null) {
                    instance = new RedisUtil();
                    instance.init();
                }
            }
        }
        return instance;
    }

    public byte[] get(byte[] key) {
        byte[] value = {};
        try {
            value = jedis.get(key);
        } catch (Exception e) {
            log.error(e.toString(), e);
            init();
        }
        return value;
    }

    public byte[] set(byte[] key, byte[] value) {
        try {
            jedis.set(key, value);
        } catch (Exception e) {
            log.error(e.toString(), e);
            init();
        }
        return value;
    }

    public byte[] set(byte[] key, byte[] value, int expire) {
        try {
            jedis.set(key, value);
            if (expire != 0) {
                jedis.expire(key, expire);
            }
        } catch (Exception e) {
            log.error(e.toString(), e);
            init();
        }
        return value;
    }

    public void delKey(byte[] key) {
        try {
            jedis.del(key);
        } catch (Exception e) {
            log.error(e.toString(), e);
            init();
        }
    }

    public boolean saveObject(String key, Object object) {
        if (key == null) {
            throw new RuntimeException("key is null");
        }
        // 存入一个 user对象
        try {
            byte[] obj = SerializationUtil.serialize(object);
            if (obj == null) {
                throw new RuntimeException("object is null");
            }
            jedis.set(key.getBytes(), obj);
            return true;
        } catch (Exception e) {
            log.error(e.toString(), e);
            init();
        }
        return false;
    }

    public <T> T getSaveObject(String key) throws ClassCastException {
        if (key == null || key.length() == 0) {
            return null;
        }
        try {
            // 获取
            byte[] bs = jedis.get(key.getBytes());
            T instent = (T) SerializationUtil.deserialize(bs);
            return instent;
        } catch (Exception e) {
            log.error(e.toString(), e);
            init();
            return null;
        }
    }

    public boolean saveMap(String key, Map<String, String> map) {
        try {
            // 存入一个map
            jedis.hmset(key, map);
            return true;
        } catch (Exception e) {
            log.error(e.toString(), e);
            init();
        }
        return false;
    }

    public long getSaveMapSize(String key) {
        try {
            // map key的个数
            return jedis.hlen(key);
        } catch (Exception e) {
            log.error(e.toString(), e);
            init();
        }
        return 0;
    }

    public String getMapValue(String key, String field) {
        try {
            return jedis.hmget(key, field).get(0);
        } catch (Exception e) {
            log.error(e.toString(), e);
            init();
        }
        return "";
    }

    public Set<String> getAllMapKey(String key) {
        try {
            return jedis.hkeys(key);
        } catch (Exception e) {
            log.error(e.toString(), e);
            init();
        }
        Set<String> strings = new HashSet<>();
        return strings;
    }

    public boolean delMapValue(String key, String field) {
        try {
            jedis.hdel(key, field);
            return true;
        } catch (Exception e) {
            log.error(e.toString(), e);
            init();
        }
        return false;
    }

    public boolean saveString(String key, String val) {
        try {
            jedis.set(key, val);
            return true;
        } catch (Exception e) {
            log.error(e.toString(), e);
            init();
        }
        return false;
    }

    public boolean saveValue(String key, Object val) {
        try {
            jedis.set(key, val.toString());
            return true;
        } catch (Exception e) {
            log.error(e.toString(), e);
            init();
        }
        return false;
    }

    public String getSaveString(String key, String defoutVal) {
        try {
            String body = jedis.get(key);
            return TextUtils.isEmpty(body) ? defoutVal : body;
        } catch (Exception e) {
            log.error(e.toString(), e);
            init();
        }
        return defoutVal;
    }

    public int getSaveInt(String key, int defoutVal) {
        try {
            String body = jedis.get(key);
            return Integer.parseInt(body);
        } catch (NumberFormatException e1) {

        } catch (Exception e) {
            log.error(e.toString(), e);
            init();
        }
        return defoutVal;
    }

    public void saveLong(String key, long val) {
        try {
            jedis.set(key, val + "");
        } catch (Exception e) {
            log.error(e.toString(), e);
            init();
        }
    }

    public long getSaveLong(String key, long defoutVal) {
        try {
            String body = jedis.get(key);
            return Long.parseLong(body);
        } catch (NumberFormatException e1) {

        } catch (Exception e) {
            log.error(e.toString(), e);
            init();
        }
        return defoutVal;
    }

    public boolean delKey(String key) {
        try {
            jedis.del(key);
            return true;
        } catch (Exception e) {
            log.error(e.toString(), e);
            init();
        }
        return false;
    }

    public boolean exists(String key) {
        try {
            return !TextUtils.isEmpty(jedis.get(key));
        } catch (Exception e) {
            log.error(e.toString(), e);
            init();
        }
        return false;
    }

    public Set<byte[]> hkeys(byte[] bytes) {

        try {
            return jedis.hkeys(bytes);
        } catch (Exception e) {
            log.error(e.toString(), e);
            init();
        }
        return new HashSet<>();
    }

    /**
     * Redis Incr 命令将 key 中储存的数字值增一。
     * 如果 key 不存在，那么 key 的值会先被初始化为 0 ，然后再执行 INCR 操作。
     * 如果值包含错误的类型，或字符串类型的值不能表示为数字，那么返回一个错误。
     * 本操作的值限制在 64 位(bit)有符号数字表示之内。
     */
    public void incr(String key) {
        try {
            jedis.incr(key);
        } catch (Exception e) {
            log.error(e.toString(), e);
            init();
        }
    }


    /**
     * 设置生存时间
     *
     * @param key
     * @param val 单位s
     *            <p>
     *            expire 设置生存时间（单位/秒）
     *            pexpire 设置生存时间(单位/毫秒)
     */
    public void expire(String key, int val) {
        try {
            jedis.expire(key, val);
        } catch (Exception e) {
            log.error(e.toString(), e);
            init();
        }
    }

}
