package com.jxctdzkj.cloudplatform.controller;

import com.jxctdzkj.cloudplatform.bean.SysUserBean;
import com.jxctdzkj.cloudplatform.config.Constant;
import com.jxctdzkj.cloudplatform.utils.ControllerHelper;
import com.jxctdzkj.cloudplatform.utils.ResultObject;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.session.Session;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;

/**
 * <pre>
 *     @author  : FlySand
 *     @e-mail  : 1156183505@qq.com
 *     @time    : 2019/3/12.
 *     @desc    :
 * </pre>
 */
@Slf4j
@RestController
@RequestMapping("agreement")
public class AgreementController extends BaseController {


    @RequestMapping(value = "agree", method = RequestMethod.POST)
    public Object agree() {
        SysUserBean userBean = ControllerHelper.getInstance(dao).getLoginUser();
        if (userBean != null) {
            userBean.setAgreementVersion(Constant.Define.AGREEMENT_VERSION);
            dao.update(userBean);
            Session session = SecurityUtils.getSubject().getSession();
            session.setAttribute("agreement", Constant.Define.AGREEMENT_VERSION);
        }
        return ResultObject.ok();
    }

}
