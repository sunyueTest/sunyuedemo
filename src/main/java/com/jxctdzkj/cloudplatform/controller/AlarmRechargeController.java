package com.jxctdzkj.cloudplatform.controller;

import com.jxctdzkj.cloudplatform.bean.AlarmRechargeRecordBean;
import com.jxctdzkj.cloudplatform.bean.SysUserBean;
import com.jxctdzkj.cloudplatform.bean.SysUserInfoBean;
import com.jxctdzkj.cloudplatform.utils.ControllerHelper;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import com.jxctdzkj.cloudplatform.utils.ReturnObject;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.dao.Sqls;
import org.nutz.dao.pager.Pager;
import org.nutz.dao.sql.Sql;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import java.sql.Timestamp;
import java.util.List;

@Slf4j
@Controller
@RequestMapping({"alarmRecharge"})
public class AlarmRechargeController {

    @Autowired
    Dao dao;

    @RequestMapping()
    public String index() {
        return "userInfo/userInfoList";
    }

    @RequestMapping("rechargeDetail")
    public ModelAndView rechargeDetail(String userName) {

        if(StringUtils.isNotBlank(userName)){
            SysUserInfoBean userInfo =dao.fetch(SysUserInfoBean.class,Cnd.where("user_name","=",userName));
            if(userInfo!=null)
                return new ModelAndView("alarmRecharge","data",userInfo) ;
        }
        return new ModelAndView("alarmRecharge","data",new SysUserInfoBean());
    }

    @RequestMapping(value = "/recharge")
    @ResponseBody
    public ResultObject recharge(Integer count,String userName){

        //判断用户权限
        SysUserBean user = ControllerHelper.getInstance(dao).getLoginUser();
        if(user==null){
            return ResultObject.error("用户未登录");
        }
        if(user.getLevel()>0){
            return ResultObject.error("只有管理员有充值权限");
        }
        if(count==null || count<0){
            return ResultObject.error("充值数量格式不正确");
        }
        if(StringUtils.isBlank(userName)){
            return ResultObject.error("充值用户不能为空");
        }
        SysUserInfoBean userInfo= dao.fetch(SysUserInfoBean.class, Cnd.where("user_name","=",userName));
        if(userInfo==null){
            return ResultObject.error("用户不存在");
        }
        //充值动作
        Sql sql= Sqls.create("update sys_user_info set sms_count=sms_count+@count where user_name=@userName");
        sql.params().set("userName",userName);
        sql.params().set("count",count);
        dao.execute(sql);
        //保存充值记录
        AlarmRechargeRecordBean record = new AlarmRechargeRecordBean();
        record.setCount(count);
        record.setBeforeCount(userInfo.getSmsCount());
        record.setSendCount(userInfo.getSmsSendCount());
        record.setUserName(userName);
        record.setRechargeDate(new Timestamp(System.currentTimeMillis()));
        dao.insert(record);
        return ResultObject.ok("ok8");

    }

    @RequestMapping(value = "/getUserSelect")
    @ResponseBody
    public ReturnObject getUserSelect(String userName,Integer page,Integer limit){
        ReturnObject result =new ReturnObject();
        Pager pager =new Pager(page,limit);
        Cnd cnd = Cnd.NEW();
        if(StringUtils.isNotBlank(userName)){
            cnd= cnd.where("user_name","like","%" + userName + "%");
        }
        List<SysUserInfoBean> list =dao.query(SysUserInfoBean.class,cnd,pager);
        result.setData(list);
        result.setCount(list.size());
        result.setCode(0);
        return result;
    }
    @RequestMapping(value = "/getUserInfo")
    @ResponseBody
    public ResultObject getUserInfo(String userName){
        if(StringUtils.isBlank(userName)){
            return ResultObject.error("用户名为空");
        }
        SysUserInfoBean userInfo =dao.fetch(SysUserInfoBean.class,Cnd.where("user_name","=",userName));
        return ResultObject.ok("ok8").data(userInfo);
    }

}
