package com.jxctdzkj.cloudplatform.mode;

/**
 * <pre>
 *     @author  : FlySand
 *     @e-mail  : 1156183505@qq.com
 *     @time    : 2018/12/1.
 *     @desc    :
 * </pre>
 */
public class SocketMode extends Mode {

    public static SocketMode getAlarmMode(Object data) {
        return new SocketMode("alarm", data);
    }

    private SocketMode() {

    }

    private SocketMode(String type, Object data) {
        this.type = type;
        this.data = data;
    }

    private String type;

    private Object data;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    @Override
    public String toString() {
        return "SocketMode{" +
                "type='" + type + '\'' +
                ", data=" + data +
                '}';
    }
}
