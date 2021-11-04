package com.jxctdzkj.cloudplatform.shiro;


import com.jxctdzkj.cloudplatform.bean.SysUserBean;
import com.jxctdzkj.cloudplatform.config.Constant;
import com.jxctdzkj.cloudplatform.coustum.UserNotExistAuthenticationException;
import com.jxctdzkj.cloudplatform.radis.RedisUtil;
import com.jxctdzkj.cloudplatform.service.RightsService;

import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import lombok.extern.slf4j.Slf4j;

/**
 * Created by cdyoue on 2016/10/21.
 */
@Slf4j
public class ShiroRealm extends AuthorizingRealm {


    @Autowired
    Dao dao;

    @Autowired
    RightsService rightsService;

    /**
     * 获取授权信息
     */
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
        log.info("获取授权信息 doGetAuthorizationInfo  PrincipalCollection= " + principalCollection.toString());
        System.out.println("获取授权信息");
        //用户名
        String userName = (String) principalCollection.getPrimaryPrincipal();
        String redisKey = "doGetAuthorizationInfo" + userName;
        List<String> rights = null;
        if (Constant.Redis.ENABLE) {
            rights = RedisUtil.getInstance().getSaveObject(redisKey);
        }
        if (rights == null) {
            rights = rightsService.getRealm(userName);
        }
        if (Constant.Redis.ENABLE) {
            RedisUtil.getInstance().saveObject(redisKey, rights);
            RedisUtil.getInstance().expire(redisKey, 24 * 60 * 60 * 1000);//缓存一天
        }
        log.info("rights:" + rights);
        Set<String> rs = new HashSet(rights);
        log.info("用户+++++++++++++++++++++++++++++++++++++++++++++++++++++++++" + userName);
        SimpleAuthorizationInfo authorizationInfo = new SimpleAuthorizationInfo();
        authorizationInfo.addStringPermissions(rs);
        return authorizationInfo;

    }


    /**
     * 登录验证
     */
    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException {
        log.info("验证 doGetAuthenticationInfo AuthenticationToken =" + authenticationToken.toString());
        //令牌——基于用户名和密码的令牌
        UsernamePasswordToken token = (UsernamePasswordToken) authenticationToken;
        //令牌中可以取出用户名
        String userName = token.getUsername();
        //查重
        SysUserBean loginUser = dao.fetch(SysUserBean.class, Cnd.where("user_name", "=", userName).and("is_del", "=", 0));
        log.info("loginUser = " + loginUser);
        if (loginUser == null) {
            throw new UserNotExistAuthenticationException("用户未注册");
        }
        String password = loginUser.getPassword();
        SimpleAuthenticationInfo authenticationInfo = new SimpleAuthenticationInfo(
                userName, password, userName);
        return authenticationInfo;
    }
}
