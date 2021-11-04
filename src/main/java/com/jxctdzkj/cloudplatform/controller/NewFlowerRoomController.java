package com.jxctdzkj.cloudplatform.controller;


import com.jxctdzkj.cloudplatform.bean.NewFlowerRoomAddBean;
import com.jxctdzkj.cloudplatform.utils.ControllerHelper;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.dao.pager.Pager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

@RequestMapping("newFlowerRoom")
@Controller
public class NewFlowerRoomController {

    @Autowired
    Dao dao;

    @RequestMapping("addPerson")
    public ModelAndView addPerson() {
        return  new ModelAndView("newFlowerRoomAdd","bean",new NewFlowerRoomAddBean());
    }

    @RequestMapping("getOperationRecord")
    @ResponseBody
    public ResultObject getOperationRecord() {
        String creatUser = ControllerHelper.getLoginUserName();
        Cnd cnd = Cnd.where("creatUser", "=", creatUser);
        List<NewFlowerRoomAddBean> list = dao.query(NewFlowerRoomAddBean.class,cnd.desc("id"));
        return ResultObject.ok(list);
    }

    //存储或更新
    @RequestMapping("saveOperationRecord")
    @ResponseBody
    public ResultObject saveOperationRecord(NewFlowerRoomAddBean bean) {
        String creatUser = ControllerHelper.getLoginUserName();
        if (bean.getId() == 0) {
            bean.setCreatUser(creatUser);
            dao.insert(bean);
            return ResultObject.ok("success");
        }
        bean.setCreatUser(creatUser);
        dao.update(bean);
        return ResultObject.ok("success");
    }

//    @RequestMapping("saveOperationRecord")
//    @ResponseBody
//    public ResultObject saveOperationRecord(NewFlowerRoomAddBean newFlowerRoomAddBean) {
//        dao.insert(newFlowerRoomAddBean);
//        return ResultObject.ok("success");
//    }

     //获取人员操作记录列表
    @RequestMapping("getOperationRecordList")
    public String getOperationRecordList(){
        return "newFlowerRoom/newFlowerRoomList";
    }

    @RequestMapping("getInfoList")
    @ResponseBody
    public ResultObject getInfoList(int page, int limit){
        Cnd cnd = Cnd.where("1", "=", 1);
        List<NewFlowerRoomAddBean> list = dao.query(NewFlowerRoomAddBean.class, cnd.desc("id"), new Pager(page, limit));
        int count = dao.count(NewFlowerRoomAddBean.class, cnd);
        return ResultObject.okList(list, page, limit, count);
    }

    //跳转企业更新
    @RequestMapping(value = "toUpdateOperationRecord")
    public ModelAndView toUpdateOperationRecord(@RequestParam long id) {
        NewFlowerRoomAddBean bean = dao.fetch(NewFlowerRoomAddBean.class, id);
        return new ModelAndView("newFlowerRoomAdd", "bean", bean);
    }

    @RequestMapping(value = "deleteOperationRecord")
    @ResponseBody
    public ResultObject delProject(@RequestParam long id) {
        NewFlowerRoomAddBean bean = dao.fetch(NewFlowerRoomAddBean.class, id);
        dao.delete(bean);
        return ResultObject.ok("success");
    }



}
