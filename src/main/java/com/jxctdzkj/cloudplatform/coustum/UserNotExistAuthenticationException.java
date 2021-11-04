package com.jxctdzkj.cloudplatform.coustum;

import org.apache.shiro.authc.AuthenticationException;

/**
 * <pre>
 *     author  : FlySand
 *     e-mail  : 1156183505@qq.com
 *     time    : 2018/7/31.
 *     desc    :
 * </pre>
 */
public class UserNotExistAuthenticationException extends AuthenticationException {
    /**
     * Constructs a new AuthenticationException.
     *
     * @param message the reason for the exception
     */
    public UserNotExistAuthenticationException(String message) {
        super(message);
    }
}
