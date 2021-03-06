package com.jxctdzkj.cloudplatform.exception;

import com.jxctdzkj.cloudplatform.utils.ReturnObject;

import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@ControllerAdvice
public class BaseExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ModelAndView handleException(HttpServletRequest request, Exception e) {

        ReturnObject data = new ReturnObject();
        try {
            data.setMsg(e.getMessage());
            log.error(request.getRequestURI() + e.getMessage(), e);
        } catch (Exception e1) {
            data.setMsg(e1.toString());
            log.error(e1.toString() + request.getMethod(), e);
        }
        return new ModelAndView("error/error");
    }
//
//    (BaseExceptionHandler.java:29)- java.io.IOException: 远程主机强迫关闭了一个现有的连接。
//    org.apache.catalina.connector.ClientAbortException: java.io.IOException: 远程主机强迫关闭了一个现有的连接。
//    at org.apache.catalina.connector.OutputBuffer.doFlush(OutputBuffer.java:321)
//    at org.apache.catalina.connector.OutputBuffer.flush(OutputBuffer.java:284)
//    at org.apache.catalina.connector.CoyoteOutputStream.flush(CoyoteOutputStream.java:118)
//    at com.fasterxml.jackson.core.json.UTF8JsonGenerator.flush(UTF8JsonGenerator.java:1100)
//    at com.fasterxml.jackson.databind.ObjectWriter.writeValue(ObjectWriter.java:915)
//    at org.springframework.http.converter.json.AbstractJackson2HttpMessageConverter.writeInternal(AbstractJackson2HttpMessageConverter.java:286)
//    at org.springframework.http.converter.AbstractGenericHttpMessageConverter.write(AbstractGenericHttpMessageConverter.java:102)
//    at org.springframework.web.servlet.mvc.method.annotation.AbstractMessageConverterMethodProcessor.writeWithMessageConverters(AbstractMessageConverterMethodProcessor.java:272)
//    at org.springframework.web.servlet.mvc.method.annotation.RequestResponseBodyMethodProcessor.handleReturnValue(RequestResponseBodyMethodProcessor.java:180)
//    at org.springframework.web.method.support.HandlerMethodReturnValueHandlerComposite.handleReturnValue(HandlerMethodReturnValueHandlerComposite.java:82)
//    at org.springframework.web.servlet.mvc.method.annotation.ServletInvocableHandlerMethod.invokeAndHandle(ServletInvocableHandlerMethod.java:119)
//    at org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter.invokeHandlerMethod(RequestMappingHandlerAdapter.java:877)
//    at org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter.handleInternal(RequestMappingHandlerAdapter.java:783)
//    at org.springframework.web.servlet.mvc.method.AbstractHandlerMethodAdapter.handle(AbstractHandlerMethodAdapter.java:87)
//    at org.springframework.web.servlet.DispatcherServlet.doDispatch(DispatcherServlet.java:991)
//    at org.springframework.web.servlet.DispatcherServlet.doService(DispatcherServlet.java:925)
//    at org.springframework.web.servlet.FrameworkServlet.processRequest(FrameworkServlet.java:974)
//    at org.springframework.web.servlet.FrameworkServlet.doGet(FrameworkServlet.java:866)
//    at javax.servlet.http.HttpServlet.service(HttpServlet.java:687)
//    at org.springframework.web.servlet.FrameworkServlet.service(FrameworkServlet.java:851)
//    at javax.servlet.http.HttpServlet.service(HttpServlet.java:790)
//    at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:231)
//    at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:166)
//    at org.apache.tomcat.websocket.server.WsFilter.doFilter(WsFilter.java:52)
//    at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:193)
//    at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:166)
//    at org.apache.shiro.web.servlet.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:112)
//    at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:193)
//    at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:166)
//    at org.apache.shiro.web.servlet.ProxiedFilterChain.doFilter(ProxiedFilterChain.java:61)
//    at org.apache.shiro.web.servlet.AdviceFilter.executeChain(AdviceFilter.java:108)
//    at org.apache.shiro.web.servlet.AdviceFilter.doFilterInternal(AdviceFilter.java:137)
//    at org.apache.shiro.web.servlet.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:125)
//    at org.apache.shiro.web.servlet.ProxiedFilterChain.doFilter(ProxiedFilterChain.java:66)
//    at org.apache.shiro.web.servlet.AbstractShiroFilter.executeChain(AbstractShiroFilter.java:449)
//    at org.apache.shiro.web.servlet.AbstractShiroFilter$1.call(AbstractShiroFilter.java:365)
//    at org.apache.shiro.subject.support.SubjectCallable.doCall(SubjectCallable.java:90)
//    at org.apache.shiro.subject.support.SubjectCallable.call(SubjectCallable.java:83)
//    at org.apache.shiro.subject.support.DelegatingSubject.execute(DelegatingSubject.java:383)
//    at org.apache.shiro.web.servlet.AbstractShiroFilter.doFilterInternal(AbstractShiroFilter.java:362)
//    at org.apache.shiro.web.servlet.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:125)
//    at org.springframework.web.filter.DelegatingFilterProxy.invokeDelegate(DelegatingFilterProxy.java:357)
//    at org.springframework.web.filter.DelegatingFilterProxy.doFilter(DelegatingFilterProxy.java:270)
//    at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:193)
//    at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:166)
//    at org.springframework.web.filter.RequestContextFilter.doFilterInternal(RequestContextFilter.java:99)
//    at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:107)
//    at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:193)
//    at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:166)
//    at org.springframework.web.filter.HttpPutFormContentFilter.doFilterInternal(HttpPutFormContentFilter.java:109)
//    at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:107)
//    at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:193)
//    at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:166)
//    at org.springframework.web.filter.HiddenHttpMethodFilter.doFilterInternal(HiddenHttpMethodFilter.java:93)
//    at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:107)
//    at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:193)
//    at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:166)
//    at org.springframework.web.filter.CharacterEncodingFilter.doFilterInternal(CharacterEncodingFilter.java:200)
//    at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:107)
//    at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:193)
//    at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:166)
//    at org.apache.catalina.core.StandardWrapperValve.invoke(StandardWrapperValve.java:198)
//    at org.apache.catalina.core.StandardContextValve.invoke(StandardContextValve.java:96)
//    at org.apache.catalina.authenticator.AuthenticatorBase.invoke(AuthenticatorBase.java:496)
//    at org.apache.catalina.core.StandardHostValve.invoke(StandardHostValve.java:140)
//    at org.apache.catalina.valves.ErrorReportValve.invoke(ErrorReportValve.java:81)
//    at org.apache.catalina.core.StandardEngineValve.invoke(StandardEngineValve.java:87)
//    at org.apache.catalina.connector.CoyoteAdapter.service(CoyoteAdapter.java:342)
//    at org.apache.coyote.http11.Http11Processor.service(Http11Processor.java:803)
//    at org.apache.coyote.AbstractProcessorLight.process(AbstractProcessorLight.java:66)
//    at org.apache.coyote.AbstractProtocol$ConnectionHandler.process(AbstractProtocol.java:790)
//    at org.apache.tomcat.util.net.NioEndpoint$SocketProcessor.doRun(NioEndpoint.java:1468)
//    at org.apache.tomcat.util.net.SocketProcessorBase.run(SocketProcessorBase.java:49)
//    at java.util.concurrent.ThreadPoolExecutor.runWorker(Unknown Source)
//    at java.util.concurrent.ThreadPoolExecutor$Worker.run(Unknown Source)
//    at org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:61)
//    at java.lang.Thread.run(Unknown Source)
//    Caused by: java.io.IOException: 远程主机强迫关闭了一个现有的连接。
//    at sun.nio.ch.SocketDispatcher.write0(Native Method)
//    at sun.nio.ch.SocketDispatcher.write(Unknown Source)
//    at sun.nio.ch.IOUtil.writeFromNativeBuffer(Unknown Source)
//    at sun.nio.ch.IOUtil.write(Unknown Source)
//    at sun.nio.ch.SocketChannelImpl.write(Unknown Source)
//    at org.apache.tomcat.util.net.NioChannel.write(NioChannel.java:134)
//    at org.apache.tomcat.util.net.NioBlockingSelector.write(NioBlockingSelector.java:101)
//    at org.apache.tomcat.util.net.NioSelectorPool.write(NioSelectorPool.java:157)
//    at org.apache.tomcat.util.net.NioEndpoint$NioSocketWrapper.doWrite(NioEndpoint.java:1276)
//    at org.apache.tomcat.util.net.SocketWrapperBase.doWrite(SocketWrapperBase.java:670)
//    at org.apache.tomcat.util.net.SocketWrapperBase.flushBlocking(SocketWrapperBase.java:607)
//    at org.apache.tomcat.util.net.SocketWrapperBase.flush(SocketWrapperBase.java:597)
//    at org.apache.coyote.http11.Http11OutputBuffer$SocketOutputBuffer.flush(Http11OutputBuffer.java:646)
//    at org.apache.coyote.http11.filters.ChunkedOutputFilter.flush(ChunkedOutputFilter.java:169)
//    at org.apache.coyote.http11.Http11OutputBuffer.flush(Http11OutputBuffer.java:252)
//    at org.apache.coyote.http11.Http11Processor.flush(Http11Processor.java:1564)
//    at org.apache.coyote.AbstractProcessor.action(AbstractProcessor.java:352)
//    at org.apache.coyote.Response.action(Response.java:173)
//    at org.apache.catalina.connector.OutputBuffer.doFlush(OutputBuffer.java:317)
//            ... 76 common frames omitted
}
