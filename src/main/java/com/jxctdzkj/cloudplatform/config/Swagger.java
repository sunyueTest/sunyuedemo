package com.jxctdzkj.cloudplatform.config;

import org.springframework.context.annotation.Conditional;
import org.springframework.context.annotation.Configuration;

import lombok.extern.slf4j.Slf4j;

/**
 * <pre>
 *     @author  : FlySand
 *     @e-mail  : 1156183505@qq.com
 *     @time    : 2019/4/16.
 *     @desc    :
 * </pre>
 */
@Slf4j
@Configuration
//@EnableSwagger2
@Conditional(Constant.class)
public class Swagger {

    Swagger() {
        log.info("Swagger2 init");
    }

}
