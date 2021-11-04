package com.jxctdzkj.cloudplatform.controller;

import com.jxctdzkj.cloudplatform.bean.ConfigurationTypeBean;
import com.jxctdzkj.cloudplatform.bean.FarmInfoBean;
import com.jxctdzkj.cloudplatform.bean.UserDeviceBean;
import com.jxctdzkj.cloudplatform.service.ConfigurationService;
import com.jxctdzkj.cloudplatform.utils.ControllerHelper;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.dao.Sqls;
import org.nutz.dao.sql.Sql;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

/**
 * @Auther huangwei
 * @Date 2019/11/12
 **/
@Controller
@Slf4j
@RequestMapping("/configuration")
public class ConfigurationController {
   @Autowired
    Dao dao;

   @Autowired
   ConfigurationService configurationService;
   //参数列表跳转
    @RequestMapping("toList")
    public ModelAndView toList() {
        return new ModelAndView("configurationArguments/argumentsList");
    }
    //添加参数 页面跳转
    @RequestMapping("toAddArgs")
    public ModelAndView toAddArgs() {
        return new ModelAndView("configurationArguments/addArgs");
    }
    //修改页面跳转

    @RequestMapping("toUpdate")
    public ModelAndView toUpdate(String id) {
        ConfigurationTypeBean typeBean = dao.fetch(ConfigurationTypeBean.class, Cnd.where("id", "=", id));
        return new ModelAndView("configurationArguments/update","bean",typeBean);
    }

    @RequestMapping("toSpain")
    public String toSpain() {
         return "redirect:http://demo.sennor.net:8180/doLogin";
    }





    @RequestMapping("toAdd")
    public ModelAndView toAdd(@RequestParam(value = "type", required = false, defaultValue = "1") String type) {
        return new ModelAndView("configurationType/addOrUpdate", "bean", new FarmInfoBean()).addObject("type", type);

    }

    // 修改-跳转
    @RequestMapping(value = "toUpdateBase")
    public ModelAndView toUpdate(String id, @RequestParam(value = "type", required = false, defaultValue = "1") String type) {
        FarmInfoBean bean = dao.fetch(FarmInfoBean.class, Cnd.where("id", "=", id));
        return new ModelAndView("configurationType/addOrUpdate", "bean", bean).addObject("type", type);
    }




   //获取参数列表
    @RequestMapping("getArgsList" )
    @ResponseBody
    public ResultObject getArgsList(int page,int size,@RequestParam(required = false,defaultValue ="") String typeName){
        return  configurationService.getArgsList(page, size,typeName);
    }

    //添加参数
    @RequestMapping("addArgs" )
    @ResponseBody
    public ResultObject  addArgs(ConfigurationTypeBean bean){
        String userName = ControllerHelper.getLoginUserName();
        bean.setUserName(userName);
        dao.insert(bean);
        return ResultObject.ok();
    }

    //修改参数
    /**
     * @Author huangwei
     * @Description //TODO
     * @Date  2019/12/3
     * @Param [id, typeName, type, value, flag] flag 用来标识是前后端的修改
     * @return com.jxctdzkj.cloudplatform.utils.ResultObject
     **/

    @RequestMapping("save" )
    @ResponseBody
    public ResultObject  update(int id ,String typeName,String type,String value,@RequestParam(required = false,defaultValue = "") String flag){
        ConfigurationTypeBean typeBean = dao.fetch(ConfigurationTypeBean.class, Cnd.where("id", "=", id));
        if(typeBean!=null) {
            if(StringUtils.isNotBlank(flag)){
                typeBean.setValue(value);
            }else {
                typeBean.setTypeName(typeName);
                typeBean.setValue(value);
                typeBean.setType(type);
            }

            if (dao.update(typeBean) > 0) {
                return ResultObject.ok();
            }
        }
        return ResultObject.apiError("err228");
    }

    //删除参数
    @RequestMapping("del" )
    @ResponseBody
    public ResultObject  del(int  id){
        ConfigurationTypeBean typeBean = dao.fetch(ConfigurationTypeBean.class, Cnd.where("id", "=", id));
        if(typeBean!=null){
            typeBean.setIsDel(1);
            if(dao.update(typeBean)>0){
                return ResultObject.ok("ok3");
            }
        }
        return ResultObject.apiError("err228");
    }



    //  获取所有组态类型
    @RequestMapping("allType")
    @ResponseBody
    public ResultObject getAllType(){
        String userName = ControllerHelper.getLoginUserName();
        List<ConfigurationTypeBean> typeBeanList = dao.query(ConfigurationTypeBean.class, Cnd.where("user_name", "=", userName).and("is_del","=",0));
        return ResultObject.okList(typeBeanList);
    }


    // 通过参数id查询参数值
    @RequestMapping("getTypeValue")
    @ResponseBody
    public ResultObject getTypeById(Integer id){
        String userName = ControllerHelper.getLoginUserName();
        //设备总数
        int count = dao.count(UserDeviceBean.class, Cnd.where("user_name", "=", userName).and("is_del", "=", 0));
        //设备离线
        Sql sql = Sqls.create("select count(*) from  network  n left join  sys_user_to_devcie s on n.Ncode = s.Ncode  where s.user_name =@userName  and n.Nonlinestate = '0' and s.is_del = 0");
        sql.setCallback(Sqls.callback.integer());
        sql.setParam("userName", userName);
        dao.execute(sql);
        int offLineCount  = sql.getInt();
        //在线总数
        int onLine = count-offLineCount;
        //在线率
        double on = (double) onLine / count;
        //离线率
        double off = (double) offLineCount / count;

        //获得参数
        ConfigurationTypeBean typeBean = dao.fetch(ConfigurationTypeBean.class, Cnd.where("user_name", "=", userName).and("id", "=", id));
        if(typeBean!=null) {
            if (typeBean.getTypeName().equals("设备在线数")) {
                return ResultObject.ok().data(onLine);
            } else if (typeBean.getTypeName().equals("设备离线数")) {
                return ResultObject.ok().data(offLineCount);
            } else if (typeBean.getTypeName().equals("设备离线率")) {
                return ResultObject.ok().data((int)(off*10000)/100+"%");
            } else if (typeBean.getTypeName().equals("设备在线率")) {
                return ResultObject.ok().data((int)(on*10000)/100+"%");
            }
            return ResultObject.ok().data(typeBean.getValue());
        }
        return ResultObject.apiError("err228");

    }


}
