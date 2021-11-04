package com.jxctdzkj.cloudplatform.controller;

import com.jxctdzkj.cloudplatform.bean.SysUserBean;
import com.jxctdzkj.cloudplatform.config.Constant;
import com.jxctdzkj.cloudplatform.utils.ControllerHelper;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import com.jxctdzkj.cloudplatform.utils.Utils;
import com.jxctdzkj.support.utils.Encrypt;
import com.jxctdzkj.support.utils.TextUtils;

import org.apache.commons.lang3.StringUtils;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * <pre>
 *     @author  : FlySand
 *     @e-mail  : 1156183505@qq.com
 *     @time    : 2019/5/14.
 *     @desc    :
 * </pre>
 */
@RequestMapping("system")
@RestController
public class SystemController {
    @Autowired
    Dao dao;

    /**
     * 通用websocket链接接口
     *
     * @param type 参见Constant.WebSocketAddressType
     * @return
     */
    @RequestMapping("socketAddress")
    public Object socketAddress(@RequestParam(value = "type", defaultValue = "1") int type, Long toiletId) {
        String userName = ControllerHelper.getLoginUserName();
        if (userName == null) {
            return ResultObject.apiError("logout");
        }
        SysUserBean userBean = dao.fetch(SysUserBean.class, Cnd.where("user_name", "=", userName).and("is_del", "=", 0));
        String lastLoginTime, token;
        if (userBean == null) {
            return ResultObject.apiError("logout");
        }
        switch (type) {
            //普通报警
            case Constant.WebSocketAddressType.SOCKET:
                return ResultObject.ok().data(Constant.Address.SOCKET + userName);
            //一键报警
            case Constant.WebSocketAddressType.ALARM:
                lastLoginTime = userBean.getLastLoginTime() == null ? Utils.getCurrentTimestamp().toString() : userBean.getLastLoginTime().toString();
                token = Encrypt.e(userName + lastLoginTime);
                return ResultObject.ok().data(Constant.Address.ALARM + "type=" + type + "&userName=" + userName + "&token=" + token);
        }
        return ResultObject.ok().data(Constant.Address.SOCKET + userName);
    }



    /**
     * topic 专家会话接口
     */
    @RequestMapping("topicAddress")
    public Object topicAddress() {
//      http://129.211.109.203:8080/sendMessage?user=fishtest&json={"type":"alarm","data":{"name":"test"}}
        String userName = ControllerHelper.getLoginUserName();
        if (TextUtils.isEmpty(userName)) {
            return ResultObject.apiError("logout");
        }
        return ResultObject.ok().data("address", Constant.Address.SOCKET_TOPIC)
                .data("userName", userName).data("password", "%");
    }
}
