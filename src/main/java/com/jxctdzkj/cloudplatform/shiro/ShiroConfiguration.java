package com.jxctdzkj.cloudplatform.shiro;

import at.pollux.thymeleaf.shiro.dialect.ShiroDialect;
import com.jxctdzkj.cloudplatform.config.Constant;
import com.jxctdzkj.cloudplatform.radis.RedisPoolManager;
import lombok.extern.slf4j.Slf4j;
import org.apache.shiro.authc.credential.HashedCredentialsMatcher;
import org.apache.shiro.session.mgt.SessionManager;
import org.apache.shiro.spring.LifecycleBeanPostProcessor;
import org.apache.shiro.spring.security.interceptor.AuthorizationAttributeSourceAdvisor;
import org.apache.shiro.spring.web.ShiroFilterFactoryBean;
import org.apache.shiro.web.mgt.DefaultWebSecurityManager;
import org.apache.shiro.web.session.mgt.DefaultWebSessionManager;
import org.crazycake.shiro.RedisCacheManager;
import org.crazycake.shiro.RedisManager;
import org.crazycake.shiro.RedisSessionDAO;
import org.springframework.aop.framework.autoproxy.DefaultAdvisorAutoProxyCreator;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.DelegatingFilterProxy;

import java.util.LinkedHashMap;
import java.util.Map;


/**
 * shiro配置类
 * Created by cdyoue on 2016/10/21.
 */
@Slf4j
@Configuration
@Component
public class ShiroConfiguration {
    private static Map<String, String> filterChainDefinitionMap = new LinkedHashMap<String, String>();

    @Bean
    public FilterRegistrationBean delegatingFilterProxy() {
        FilterRegistrationBean filterRegistrationBean = new FilterRegistrationBean();
        DelegatingFilterProxy proxy = new DelegatingFilterProxy();
        proxy.setTargetFilterLifecycle(true);
        proxy.setTargetBeanName("shiroFilter");
        filterRegistrationBean.setFilter(proxy);
        return filterRegistrationBean;
    }

    /**
     * LifecycleBeanPostProcessor，这是个DestructionAwareBeanPostProcessor的子类，
     * 负责org.apache.shiro.util.Initializable类型bean的生命周期的，初始化和销毁。
     * 主要是AuthorizingRealm类的子类，以及EhCacheManager类。
     */
    @Bean(name = "lifecycleBeanPostProcessor")
    public LifecycleBeanPostProcessor lifecycleBeanPostProcessor() {
        log.info("lifecycleBeanPostProcessor");
        return new LifecycleBeanPostProcessor();
    }

//    /**
//     * HashedCredentialsMatcher，这个类是为了对密码进行编码的，
//     * 防止密码在数据库里明码保存，当然在登陆认证的时候，
//     * 这个类也负责对form里输入的密码进行编码。
//     */
//    @Bean(name = "hashedCredentialsMatcher")
//    public HashedCredentialsMatcher hashedCredentialsMatcher() {
//        log.info("hashedCredentialsMatcher  Shiro");
//        HashedCredentialsMatcher credentialsMatcher = new HashedCredentialsMatcher();
//        credentialsMatcher.setHashAlgorithmName("MD5");
//        credentialsMatcher.setHashIterations(2);
//        credentialsMatcher.setStoredCredentialsHexEncoded(true);
//        return credentialsMatcher;
//    }

    /**
     * 凭证匹配器
     * （由于我们的密码校验交给Shiro的SimpleAuthenticationInfo进行处理了
     * 所以我们需要修改下doGetAuthenticationInfo中的代码;
     * ）
     *
     * @return
     */
    @Bean
    public HashedCredentialsMatcher hashedCredentialsMatcher() {
        HashedCredentialsMatcher hashedCredentialsMatcher = new HashedCredentialsMatcher();
        hashedCredentialsMatcher.setHashAlgorithmName("md5");//散列算法:这里使用MD5算法;
        hashedCredentialsMatcher.setHashIterations(1);//散列的次数，
        return hashedCredentialsMatcher;
    }

    /**
     * ShiroRealm，这是个自定义的认证类，继承自AuthorizingRealm，
     * 负责用户的认证和权限的处理，可以参考JdbcRealm的实现。
     */
    @Bean(name = "shiroRealm")
    @DependsOn("lifecycleBeanPostProcessor")
    public ShiroRealm shiroRealm() {
        log.info("lifecycleBeanPostProcessor  ShiroRealm");
        ShiroRealm realm = new ShiroRealm();
//        realm.setCredentialsMatcher(hashedCredentialsMatcher());
        return realm;
    }

//    /**
//     * EhCacheManager，缓存管理，用户登陆成功后，把用户信息和权限信息缓存起来，
//     * 然后每次用户请求时，放入用户的session中，如果不设置这个bean，每个请求都会查询一次数据库。
//     */
//    @Bean(name = "ehCacheManager")
//    @DependsOn("lifecycleBeanPostProcessor")
//    public EhCacheManager ehCacheManager() {
//        return new EhCacheManager();
//    }

    /**
     * SecurityManager，权限管理，这个类组合了登陆，登出，权限，session的处理，是个比较重要的类。
     * //
     */
    @Bean(name = "securityManager")
    public DefaultWebSecurityManager securityManager() {
        DefaultWebSecurityManager securityManager = new DefaultWebSecurityManager();
        securityManager.setRealm(shiroRealm());
        if (Constant.Redis.ENABLE) {
            // 自定义缓存实现 使用redis
            securityManager.setCacheManager(cacheManager());
            // 自定义session管理 使用redis
            securityManager.setSessionManager(sessionManager());
        }
        //注入记住我管理器;
//        securityManager.setRememberMeManager(rememberMeManager());
        return securityManager;
    }

    /**
     * //    /**
     * //     * ShiroFilterFactoryBean，是个factorybean，为了生成ShiroFilter。
     * //     * 它主要保持了三项数据，securityManager，filters，filterChainDefinitionManager。
     * //
     * ShiroFilterFactoryBean 处理拦截资源文件问题。
     * 注意：单独一个ShiroFilterFactoryBean配置是或报错的，以为在
     * 初始化ShiroFilterFactoryBean的时候需要注入：SecurityManager
     * <p>
     * Filter Chain定义说明
     * 1、一个URL可以配置多个Filter，使用逗号分隔
     * 2、当设置多个过滤器时，全部验证通过，才视为通过
     * 3、部分过滤器可指定参数，如perms，roles
     */
    @Bean(name = "shiroFilter")
    public ShiroFilterFactoryBean getShiroFilterFactoryBean() {
        log.info("ShiroConfigration.getShiroFilterFactoryBean()");
        MyShiroFilterFactoryBean shiroFilterFactoryBean = new MyShiroFilterFactoryBean();
        // 必须设置 SecurityManager
        shiroFilterFactoryBean.setSecurityManager(securityManager());

        /*HashMap<String, Filter> permFilter = new HashMap<>();
        permFilter.put("myPerm", new MyPermissionFilter());
        shiroFilterFactoryBean.setFilters(permFilter);*/

//        anno代表不需要授权即可访问，对于静态资源，访问权限都设置为anno
//        authc表示需要登录才可访问
///userList=roles[admin]的含义是要访问/userList需要有admin这个角色，如果没有此角色访问此URL会返回无授权页面
///userList=authc,perms[/userList]的含义是要访问/userList需要有/userList的权限，要是没分配此权限访问此URL会返回无授权页面

        /**
         * anon,authc,authcBasic,user是第一组认证过滤器
         * perms,port,rest,roles,ssl是第二组授权过滤器
         */

        //配置退出 过滤器,其中的具体的退出代码Shiro已经替我们实现了
        //filterChainDefinitionMap.put("/**", "authc");
        //filterChainDefinitionMap.put("/index", "anon");
        filterChainDefinitionMap.put("/doLogin", "anon");
        filterChainDefinitionMap.put("/isLogin", "anon");
        filterChainDefinitionMap.put("/static/**", "anon");
        filterChainDefinitionMap.put("/unrestricted/**", "anon");
        filterChainDefinitionMap.put("/logout", "logout");
        filterChainDefinitionMap.put("/templates/**", "authc");
        filterChainDefinitionMap.put("/login", "anon");
        filterChainDefinitionMap.put("/err404", "anon");
        filterChainDefinitionMap.put("/err500", "anon");
//        filterChainDefinitionMap.put("/getUpdateInfo", "anon");
//        filterChainDefinitionMap.put("/getCode", "anon");
        //filterChainDefinitionMap.put("/user/register/main", "anon");
        //filterChainDefinitionMap.put("/user/resetPassword/main", "anon");

        //filterChainDefinitionMap.put("/socket", "perms[ROLE_USER]");
        //filterChainDefinitionMap.put("/login2", "perms[ROLE_ADMON]");
//        filterChainDefinitionMap.put("/login2", "authc");
//        filterChainDefinitionMap.put("/login3", "authc,roles[ROLE_USER]");


        //filterChainDefinitionMap.put("/monitor/**", "authc");

        filterChainDefinitionMap.put("/", "authc");
        filterChainDefinitionMap.put("/monitor/**", "authc");
        filterChainDefinitionMap.put("/device/**", "authc");
        filterChainDefinitionMap.put("/home/**", "authc");
        filterChainDefinitionMap.put("/area/**", "authc");
        filterChainDefinitionMap.put("/loginState", "authc");
        filterChainDefinitionMap.put("/sensor/**", "authc");
        filterChainDefinitionMap.put("/template/**", "authc");
        filterChainDefinitionMap.put("/group/**", "authc");
        filterChainDefinitionMap.put("/groupManage/**", "authc,perms[../groupManage]");
        filterChainDefinitionMap.put("/deviceManage/**", "authc");
        filterChainDefinitionMap.put("/roleManage/**", "authc,perms[../roleManage]");
        //因渔业个人信息点击无权限，暂时设定个人信息接口为开放模式
        //,perms[../userManage/myInfo]
        //
        //filterChainDefinitionMap.put("/userManage/myInfo", "authc");
        //filterChainDefinitionMap.put("/userManage/**", "authc,perms[../userManage]");
        filterChainDefinitionMap.put("/userManage/**", "authc");


        filterChainDefinitionMap.put("/sensorTemplate/**", "authc,perms[../sensorTemplate]");
        filterChainDefinitionMap.put("/rights/**", "authc");
        filterChainDefinitionMap.put("/cameraManage/**", "authc");
        //帮助文档
        filterChainDefinitionMap.put("/consolePanel", "anon");
        // 水产养殖
        filterChainDefinitionMap.put("/aquaculture", "authc");
        filterChainDefinitionMap.put("/aquaculturePondRecord/**", "authc");
        // 水产养殖-生产管理
        filterChainDefinitionMap.put("/productionManage", "authc");
        // 水产养殖-统计分析
        filterChainDefinitionMap.put("/statisticalAnalysis", "authc");
        // 水产养殖-物联网管理-设备控制
        filterChainDefinitionMap.put("/aquacultureUserSensor", "authc");
        // 水产养殖-报表管理
        filterChainDefinitionMap.put("/aquaculturePondRecord", "authc");
        // 曲线分析
        filterChainDefinitionMap.put("/curveAnalysis", "authc");
        //  农业系统相关页面（王致远客户使用）
        filterChainDefinitionMap.put("/agriculture", "authc");
//        Gps转换查询
        filterChainDefinitionMap.put("/coordinate", "authc");
        //智慧公厕
        filterChainDefinitionMap.put("/publicToilet/**", "authc");

        // 如果不设置默认会自动寻找Web工程根目录下的"/login.jsp"页面
        shiroFilterFactoryBean.setLoginUrl("/doLogin");

        //未授权界面;
        shiroFilterFactoryBean.setUnauthorizedUrl("/unauthorized");
        shiroFilterFactoryBean.setSuccessUrl("/index");

        shiroFilterFactoryBean.setFilterChainDefinitionMap(filterChainDefinitionMap);
        return shiroFilterFactoryBean;
    }


    /**
     * cacheManager 缓存 redis实现
     * 使用的是shiro-redis开源插件
     *
     * @return
     */
    public RedisCacheManager cacheManager() {
        RedisCacheManager redisCacheManager = new RedisCacheManager();
        redisCacheManager.setRedisManager(redisManager());
        return redisCacheManager;
    }

    /**
     * 配置shiro redisManager
     * 使用的是shiro-redis开源插件
     *
     * @return
     */
    public RedisManager redisManager() {
        RedisManager redisManager = new RedisPoolManager();

//        RedisManager redisManager = new RedisManager();
//        redisManager.setHost(Constant.Redis.host);
//        redisManager.setPort(Constant.Redis.port);
//        redisManager.setExpire(2 * 60 * 60 * 1000);// 配置缓存过期时间
//        redisManager.setTimeout(2 * 60 * 60 * 1000);
//        redisManager.setPassword("jxctdzkj");

        return redisManager;
    }

    /**
     * DefaultAdvisorAutoProxyCreator，Spring的一个bean，由Advisor决定对哪些类的方法进行AOP代理。
     */
    @Bean
    @ConditionalOnMissingBean
    public DefaultAdvisorAutoProxyCreator defaultAdvisorAutoProxyCreator() {
        DefaultAdvisorAutoProxyCreator defaultAAP = new DefaultAdvisorAutoProxyCreator();
        defaultAAP.setProxyTargetClass(true);
        return defaultAAP;
    }

    /**
     * AuthorizationAttributeSourceAdvisor，shiro里实现的Advisor类，
     * 内部使用AopAllianceAnnotationsAuthorizingMethodInterceptor来拦截用以下注解的方法。
     */
    @Bean
    public AuthorizationAttributeSourceAdvisor authorizationAttributeSourceAdvisor() {
        AuthorizationAttributeSourceAdvisor aASA = new AuthorizationAttributeSourceAdvisor();
        aASA.setSecurityManager(securityManager());
        return aASA;
    }

    /**
     * RedisSessionDAO shiro sessionDao层的实现 通过redis
     * 使用的是shiro-redis开源插件
     */
    @Bean
    public RedisSessionDAO redisSessionDAO() {
        RedisSessionDAO redisSessionDAO = new RedisSessionDAO();
        redisSessionDAO.setRedisManager(redisManager());
        return redisSessionDAO;
    }


    /**
     * shiro session的管理
     */
    @Bean
    public SessionManager sessionManager() {
        DefaultWebSessionManager sessionManager = new DefaultWebSessionManager();
        //删除过期的session
        sessionManager.setDeleteInvalidSessions(true);
        sessionManager.setSessionIdUrlRewritingEnabled(false);
        sessionManager.setSessionDAO(redisSessionDAO());
        sessionManager.setSessionIdCookieEnabled(true);
        redisManager().setExpire(2 * 60 * 60 * 1000);
        return sessionManager;
    }

    /**
     * cookie对象;
     *
     * @return
    //     */
//    public SimpleCookie rememberMeCookie() {
//        //这个参数是cookie的名称，对应前端的checkbox的name = rememberMe
//        SimpleCookie simpleCookie = new SimpleCookie("rememberMe");
//        //<!-- 记住我cookie生效时间7天 ,单位秒;-->
//        simpleCookie.setMaxAge(2 * 60 * 60 * 1000);
//        simpleCookie.setValue(Encrypt.e("" + System.currentTimeMillis()));
//        return simpleCookie;
//    }

    /**
     * cookie管理对象;记住我功能
     *
     * @return
     */
//    @Bean
//    public CookieRememberMeManager rememberMeManager() {
//        CookieRememberMeManager cookieRememberMeManager = new CookieRememberMeManager();
//        cookieRememberMeManager.setCookie(rememberMeCookie());
//        //rememberMe cookie加密的密钥 建议每个项目都不一样 默认AES算法 密钥长度(128 256 512 位)
//        cookieRememberMeManager.setCipherKey("3AvVhmFLUs0KTA3Kprsdag==".getBytes());
//        return cookieRememberMeManager;
//    }

    /**
     * thymeleaf shiro  依赖
     *
     * @return 2018/10/20
     */
    @Bean
    public ShiroDialect shiroDialect() {
        return new ShiroDialect();
    }
}





