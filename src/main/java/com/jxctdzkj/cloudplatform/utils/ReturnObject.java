package com.jxctdzkj.cloudplatform.utils;

import java.io.Serializable;

public class ReturnObject implements Serializable {
    private static final long serialVersionUID = 1L;
    public static final Integer AUTH_ERROR_CODE = 1000;
    public static final Integer SYSTEM_ERROR_CODE = 2000;
    public static final Integer SERVICE_ERROR_CODE = 3000;
    public static final Integer UNKNOW_ERROR_CODE = 9000;
    private boolean success = false;
    private boolean isError = false;
    private long count;
    private String msg = "";
    private Object data = null;
    private Integer code;
    private boolean isLast;

    public ReturnObject() {
        this.code = UNKNOW_ERROR_CODE;
    }

    public boolean isSuccess() {
        return this.success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setCount(long count) {
        this.count = count;
    }

    public long getCount() {
        return this.count;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public Object getData() {
        return this.data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    public Integer getCode() {
        return this.code;
    }

    public void setCode(Integer code) {
        this.code = code;
    }

    public boolean getIsError() {
        return this.isError;
    }

    public void setError(boolean isError) {
        this.isError = isError;
    }

    public boolean isLast() {
        return isLast;
    }

    public void setLast(boolean last) {
        isLast = last;
    }
}







