package com.jxctdzkj.cloudplatform.utils;

import org.apache.commons.httpclient.HttpStatus;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 返回数据
 * 基本格式 其中   state data  msg 要求必须有不允许缺失！！
 * 返回list data为datas以区分列表数据
 *
 * <p>正常返回</p>
 * {
 * "state": "success",
 * "msg": "ok",
 * "data": {
 * *     "userName": "12"
 * *  }
 * }
 *
 * <p>分页返回</p>
 * {
 * "size": 0,
 * "isLast": true,
 * "datas": [],
 * "count": 0,
 * "state": "success",
 * "page": 1
 * }
 *
 * <p>系统错误返回</p>
 * {
 * "state": "500",
 * "data": "java.lang.NullPointerException",
 * "msg": "系统维护中"
 * }
 *
 * <p>成功时返回<p>
 * ResultObject.ok();
 * <p>返回数据<p>
 * ResultObject.ok(data);
 * <p>返回提示信息<p>
 * ResultObject.ok("msg");
 * <p>返回提示信息+data<p>
 * ResultObject.ok("msg").data(obj)
 * <p>返回提示信息+data1 + data2+...<p>
 * ResultObject.ok("msg").data("data1",data1).data("data2", data2);
 *
 * <h>分页列表返回</h>
 * <p>不分页全部返回(不建议使用)</p>
 * ResultObject.okList(List<T> list);
 * <p>正常分页返回</p>
 * ResultObject okList(List<T> list, int page, int size)
 * <p>正常分页返回带总个数</p>
 * ResultObject okList(List<T> list, int page, int size, int count)
 *
 * <p>失败返回<p>
 * ResultObject.apiError();
 * ResultObject.apiError(msg);
 *
 * <p>系统错误返回<p>
 * ResultObject error();
 * ResultObject error(msg);
 */
public class ResultObject extends HashMap<String, Object> {
    private static final long serialVersionUID = 1L;
    Map dataMap = new HashMap();

    /**
     * 构造方法不允许new 直接调用ok或者apiError
     */
    private ResultObject() {
        put("state", "success");
        put("data", dataMap);

    }


    /**
     * 接口查询成功时调用
     *
     * @param msg 提示信息
     * @return
     */
    public static ResultObject ok(String msg) {
        ResultObject r = new ResultObject();
        r.put("msg", msg);
        return r;
    }

    /**
     * 不再使用 ，用的话调用  ResultObject.ok(Object o)
     *
     * @param map
     * @return
     * @Linke ok(Object o)
     */
    @Deprecated
    public static ResultObject ok(Map<String, Object> map) {
        ResultObject r = new ResultObject();
        r.putAll(map);
        return r;
    }

    /**
     * @param name
     * @param value
     * @return
     * @Linke ok(Object o)
     */
    @Deprecated
    public static ResultObject ok(String name, Object value) {
        ResultObject r = new ResultObject();
        Map map = new HashMap();
        map.put(name, value);
        r.putAll(map);
        return r;
    }

    /**
     * 查询成功返回默认数据
     * state跟data
     *
     * @return
     */
    public static ResultObject ok() {
        return new ResultObject();
    }

    /**
     * 一次性返回全部列表 (数据量较小的情况使用)
     *
     * @param list 列表
     * @param <T>
     * @return
     */
    public static <T> ResultObject okList(List<T> list) {
        ResultObject object = new ResultObject();
        object.remove("data");
        object.put("datas", list);
        object.put("page", 1);
        object.put("size", list.size());
        object.put("isLast", true);
        return object;
    }

    /**
     * 返回列表信息
     *
     * @param list 列表
     * @param page 页
     * @param size 大小
     * @param <T>
     * @return
     */
    public static <T> ResultObject okList(List<T> list, int page, int size) {
        ResultObject object = new ResultObject();
        object.remove("data");
        object.put("datas", list);
        object.put("page", page);
        object.put("size", list.size());
        object.put("isLast", list.size() < size);
        return object;
    }

    /**
     * 返回列表信息 带count总条数
     *
     * @param list  列表
     * @param page  页
     * @param size  大小
     * @param count 总条数
     * @param <T>
     * @return
     */
    public static <T> ResultObject okList(List<T> list, int page, int size, long count) {
        ResultObject object = new ResultObject();
        object.remove("data");
        object.put("datas", list);
        object.put("page", page);
        object.put("size", list.size());
        object.put("isLast", list.size() < size);
        object.put("count", count);
        return object;
    }

    /**
     * 正常接口返回数据
     *
     * @param o 返回对象
     * @return
     */
    public static ResultObject ok(Object o) {
        return new ResultObject().data(o);
    }

    /**
     * 返回其他数据
     *
     * @param key
     * @param value
     * @return
     * @Link ok(data)
     */
    public ResultObject put(String key, Object value) {
        super.put(key, value);
        return this;
    }

    /**
     * 正常返回酒叟数据
     *
     * @param value 对象
     * @return
     */
    public ResultObject data(Object value) {
        super.put("data", value);
        return this;
    }

    /**
     * 有多个对象时用
     * data会包含多个对象
     *
     * @param key   每个对象的key
     * @param value 对象的值
     * @return
     */
    public ResultObject data(String key, Object value) {
        dataMap.put(key, value);
        super.put("data", dataMap);
        return this;
    }

    /**
     * 接口失败时调用
     *
     * @param msg 错误信息
     * @return
     */
    public static ResultObject apiError(String msg) {
        return error("failed", msg);
    }

    /**
     * 系统错误时调用
     *
     * @return
     */
    public static ResultObject error() {
        return error(HttpStatus.SC_INTERNAL_SERVER_ERROR, "未知异常，请联系管理员");
    }

    /**
     * 系统错误自定义返回信息
     *
     * @param msg 错误信息
     * @return
     */
    public static ResultObject error(String msg) {
        return error(HttpStatus.SC_INTERNAL_SERVER_ERROR, msg);
    }

    /**
     * 系统错误自定义返回信息
     *
     * @param state 状态码
     * @param msg   错误信息
     * @return
     */
    public static ResultObject error(Object state, String msg) {
        ResultObject r = new ResultObject();
        r.put("state", state);
        r.put("msg", msg);
        return r;
    }

}
