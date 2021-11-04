package com.jxctdzkj.cloudplatform.interceptor;

import org.apache.commons.lang3.StringUtils;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import java.io.IOException;
import java.lang.reflect.Method;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import lombok.extern.slf4j.Slf4j;

/**
 *
 */
@Slf4j
public class MyInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

        boolean flag = true;
        try {
            String ip = request.getRemoteAddr();
            long startTime = System.currentTimeMillis();
            request.setAttribute("requestStartTime", startTime);
            String path = request.getServletPath();
            if (path.contains("doLogin") && !path.equals("/doLogin")) {
                loginHandle(request, response);
                return false;
            }

            log.info(ip + "   status: " + response.getStatus() + "  path: " + path);

            if (handler instanceof HandlerMethod) {
                HandlerMethod handlerMethod = (HandlerMethod) handler;
                Method method = handlerMethod.getMethod();
                if (method.getName().equals("doLogin")) {
                    return true;
                }
//                log.info("  user: " + SecurityUtils.getSubject().getSession().getAttribute("user"));
            }

        } catch (Exception e) {
//            e.printStackTrace();
//            log.info(e.toString(), e);
        }
//        //判断错误码
//        if(response.getStatus()==500){
//            response.sendRedirect("index");//重定向
//            log.info("重定向 err500");
//            flag = false;
//        }else if(response.getStatus()==404){
//            response.sendRedirect("err404");//重定向
//            log.info("重定向 err404");
//            flag = false;
//        }
//        RequestAttributes ra = RequestContextHolder.getRequestAttributes();
//        HttpServletRequest req = ((ServletRequestAttributes) ra).getRequest();
//        Object testStr = (Object) req.getSession(true).getAttribute("user");
//        SysUser user = (SysUser) request.getSession().getAttribute("user");
//        if (null == user) {
//            response.sendRedirect("login");
//            flag = false;
//        } else {
//            flag = true;
//        }
//        flag = false;//拦截
        return flag;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        try {
            HandlerMethod handlerMethod = (HandlerMethod) handler;
            Method method = handlerMethod.getMethod();
            long startTime = (Long) request.getAttribute("requestStartTime");
            long endTime = System.currentTimeMillis();
            long executeTime = endTime - startTime;
            // 打印方法执行时间
            if (executeTime > 1000) {
                log.info("[" + method.getDeclaringClass().getName() + "." + method.getName() + "] 执行耗时 : "
                        + executeTime + "ms");
            } else {
                log.info("[" + method.getDeclaringClass().getSimpleName() + "." + method.getName() + "] 执行耗时 : "
                        + executeTime + "ms");
            }
            StringUtils.isBlank("  ");
        } catch (Exception e) {
//            e.printStackTrace();
        }
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {

    }

    private void loginHandle(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String path = request.getServletPath();
        String contextPath = request.getContextPath();
        String[] params = path.split("/");
        if (null != params && params.length > 1) {
            String p0 = params[1];
            if (StringUtils.isNotBlank(p0) && p0.contains("=")) {//登录页类型
                String userType = p0.substring(p0.indexOf("=")).replace("=", "");
                if (StringUtils.isNotBlank(userType)) {
                    Cookie userTypeC = new Cookie("userType", userType);
                    userTypeC.setMaxAge(30 * 24 * 60 * 60);// 设置为30天
                    response.addCookie(userTypeC);
                }
            }

            if (params.length > 2) {//中性化登录页
                String p1 = params[2];
                Cookie loginCookie = new Cookie("doLogin", p1);
                loginCookie.setMaxAge(30 * 24 * 60 * 60);// 设置为30天
                response.addCookie(loginCookie);
            }
            String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + contextPath + "/doLogin";
            response.sendRedirect(basePath);
        }
    }
}
