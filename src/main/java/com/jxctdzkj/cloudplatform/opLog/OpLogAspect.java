package com.jxctdzkj.cloudplatform.opLog;

import com.alibaba.fastjson.JSON;
import com.jxctdzkj.cloudplatform.bean.OpLogBean;
import com.jxctdzkj.cloudplatform.config.Constant;
import com.jxctdzkj.cloudplatform.service.OpLogService;
import com.jxctdzkj.cloudplatform.utils.*;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.*;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.lang.reflect.Method;

/**
 * @Description
 * @Author chanmufeng
 * @Date 2019/7/24 8:54
 **/
@Aspect
@Slf4j
@Component
@Scope("prototype")
@Order(1)
public class OpLogAspect {

    @Autowired
    OpLogService opLogService;

    @Pointcut("@annotation(EnableOpLog)")
    public void logPointCut() {
    }


    OpLogBean sysLog;

    @Before(value = "@annotation(EnableOpLog)")
    public void doBefore(JoinPoint joinPoint, EnableOpLog EnableOpLog) {
        Object[] args = joinPoint.getArgs();

        if (args.length == 0)
            return;

        sysLog = new OpLogBean();

        switch (EnableOpLog.value()) {
            case Constant.ModifyType.DELETE:
                sysLog.setOperation("删除");
                break;
            case Constant.ModifyType.UPDATE:
                sysLog.setOperation("更新");
                break;
            case Constant.ModifyType.SAVE:
                sysLog.setOperation("新建");
                break;
            default:
                sysLog.setOperation("/");
        }
    }

    /**
     * @param joinPoint
     * @param res       连接点方法的返回值
     * @return
     */
    @AfterReturning(pointcut = "logPointCut()", returning = "res")
    public Object doReturning(JoinPoint joinPoint, Object res) {

        try {
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();

            /**
             * 操作结果出错不会记录日志，直接返回结果
             */
            HttpServletResponse response = attributes.getResponse();
            if (response.getStatus() != 200) return res;

            if (res instanceof ReturnObject) {
                if (!((ReturnObject) res).isSuccess()) return res;
            } else if (res instanceof ResultObject) {
                if (!((ResultObject) res).get("state").equals("success")) return res;
            }

            HttpServletRequest request = attributes.getRequest();
            sysLog.setUserName(ControllerHelper.getLoginUserName());

            String ip = Utils.getRemoteHost(request);
            log.info("获取远程ip: " + ip);
            sysLog.setIp(ip);
            sysLog.setOpTime(Utils.getCurrentTimestamp());

            log.info("获取接口url： " + request.getServletPath());
            sysLog.setMethod(request.getServletPath());

            //请求的参数
            Object[] args = joinPoint.getArgs();
            //将参数所在的数组转换成json
            String params = JSON.toJSONString(args);
            log.info("获取请求的参数： " + params);
            sysLog.setParams(params);

            //从切面织入点处通过反射机制获取织入点处的方法
            MethodSignature signature = (MethodSignature) joinPoint.getSignature();
            //获取切入点所在的方法
            Method method = signature.getMethod();
            log.info("打印切入点所在的方法名称");
            log.info(method.getName());

            //调用service保存SysLog实体类到数据库
            opLogService.save(sysLog);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return res;
    }

}
