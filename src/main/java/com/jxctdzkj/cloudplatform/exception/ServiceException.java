package com.jxctdzkj.cloudplatform.exception;

public class ServiceException extends RuntimeException {
    private static final long serialVersionUID = 1L;
    public static final Integer AUTH_ERROR_CODE = 1000;
    public static final Integer SYSTEM_ERROR_CODE = 2000;
    public static final Integer SERVICE_ERROR_CODE = 3000;
    public static final Integer UNKNOW_ERROR_CODE = 9000;
    private Integer code;

    public Integer getCode() {
        return this.code;
    }

    public void setCode(Integer code) {
        this.code = code;
    }

    public ServiceException(Integer code, String message) {
        super(message);
        this.code = code;
    }

    public ServiceException(String message, Throwable e) {
        super(message, e);
        this.code = UNKNOW_ERROR_CODE;
    }

    public ServiceException(String message) {
        super(message);
        this.code = UNKNOW_ERROR_CODE;
    }
}

