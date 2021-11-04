package com.jxctdzkj.cloudplatform.filter;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class LoginFilter implements Filter {

	@Override
	public void destroy() {}

	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
		Subject currentUser = SecurityUtils.getSubject();
		log.info("LoginFilter  -> "+currentUser.getSession().getAttribute("user"));
		log.info("LoginFilter  -> "+SecurityUtils.getSubject().getSession().getAttribute("user"));
//		if (!currentUser.isAuthenticated()) {
//			HttpServletRequest req = (HttpServletRequest) request;
//			HttpServletResponse res = (HttpServletResponse) response;
//			String result = "qingdenglu";
//			PrintWriter out = response.getWriter();
//			try{
//				out.print(result);
//				out.flush();
//			} finally {
//				out.close();
//			}
//			return;
//		}
		chain.doFilter(request, response);
	}

	@Override
	public void init(FilterConfig filterConfig) throws ServletException {}

}
