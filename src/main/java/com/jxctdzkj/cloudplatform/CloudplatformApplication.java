package com.jxctdzkj.cloudplatform;

import com.jxctdzkj.utils.InfoLog;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

import java.util.Collections;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.SessionCookieConfig;
import javax.servlet.SessionTrackingMode;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@SpringBootApplication
public class CloudplatformApplication extends SpringBootServletInitializer {

    public static void main(String[] args) {
        SpringApplication.run(CloudplatformApplication.class, args);
        InfoLog.printPid();
    }

    /**
     * jsessionid  去掉
     *
     * @param servletContext
     * @throws ServletException
     */
    @Override
    public void onStartup(ServletContext servletContext) throws ServletException {
        super.onStartup(servletContext);
        servletContext.setSessionTrackingModes(Collections.singleton(SessionTrackingMode.COOKIE));
        SessionCookieConfig sessionCookieConfig =
                servletContext.getSessionCookieConfig();
        sessionCookieConfig.setHttpOnly(true);
    }
}
