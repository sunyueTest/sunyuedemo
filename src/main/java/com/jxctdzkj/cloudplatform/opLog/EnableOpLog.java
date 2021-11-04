package com.jxctdzkj.cloudplatform.opLog;

import com.jxctdzkj.cloudplatform.config.Constant;

import java.lang.annotation.*;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface EnableOpLog {
    /**
     * 操作的类型说明
     * 类型参见Constant.ModifyType
     *
     * @return
     */
    String value() default Constant.ModifyType.UPDATE;

}
