package com.jxctdzkj.cloudplatform.interceptor;

import com.jxctdzkj.cloudplatform.config.Constant;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import com.jxctdzkj.cloudplatform.utils.Utils;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.servlet.ViewResolver;

import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Aspect
@Component
@Configuration//定义一个切面
public class LogRecordAspect {

    // 定义切点Pointcut
    @Pointcut("execution(* com.jxctdzkj.cloudplatform.controller..*.*(..))")
    public void excudeService() {
    }


    @Around("excudeService()")
    public Object doAround(ProceedingJoinPoint pjp) throws Throwable {
        Object result = (ViewResolver) (viewName, locale) -> null;
        try {

            RequestAttributes ra = RequestContextHolder.getRequestAttributes();
            ServletRequestAttributes sra = (ServletRequestAttributes) ra;
            if (sra == null) {
                return result;
            }
            HttpServletRequest request = sra.getRequest();

            String url = request.getRequestURL().toString();
            String method = request.getMethod();
            String queryString = request.getQueryString();
            Object[] args = pjp.getArgs();
            String params = "";
            //获取请求参数集合并进行遍历拼接
            if (args.length > 0) {
                if ("POST".equals(method)) {
//                    Object object = args[0];
                    try {
                        for (int i = 0; i < args.length; i++) {
                            params += args[i].toString() + "&";
                        }
//                        Map<String, Object> map = getKeyAndValue(object);
//                        for (String s : map.keySet()) {
//                            params += s + " =" + map.get(s) + "&";
//                        }
                    } catch (Exception e) {
//                        e.printStackTrace();
                    }
                } else if ("GET".equals(method)) {
                    params = queryString;
                }
            }
            String className = pjp.getTarget().getClass().getName();
            log.info("请求=======类型:" + method + " " + className);
            log.info("客户端=====地址:" + Utils.getRemortIP(request));
            log.info("请求开始===地址:" + url + "?" + params);
            // result的值就是被拦截方法的返回值
            result = pjp.proceed();
            String res = request + "";
            if (res.length() > 100) {
                res = res.substring(0, 100) + "...";
            }
            log.info("请求结束===返回值:" + res);
        } catch (Exception e) {
            e.printStackTrace();
            return ResultObject.error(Constant.HttpState.ERR_500, "系统维护中").data(e.toString());
        }
        return result;
    }

    public static Map<String, Object> getKeyAndValue(Object obj) {
        Map<String, Object> map = new HashMap<>();
        // 得到类对象
        Class userCla = obj.getClass();
        /* 得到类中的所有属性集合 */
        Field[] fs = userCla.getDeclaredFields();
        for (int i = 0; i < fs.length; i++) {
            Field f = fs[i];
            f.setAccessible(true); // 设置些属性是可以访问的
            Object val;
            try {
                val = f.get(obj);
                // 得到此属性的值
                map.put(f.getName(), val.toString());// 设置键值
            } catch (IllegalArgumentException e) {
                e.printStackTrace();
            } catch (IllegalAccessException e) {
                e.printStackTrace();
            }

        }
        return map;
    }
}