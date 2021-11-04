package com.jxctdzkj.cloudplatform.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.jxctdzkj.cloudplatform.bean.DemoAddressBean;
import com.jxctdzkj.cloudplatform.config.Constant;
import com.jxctdzkj.cloudplatform.opLog.EnableOpLog;
import com.jxctdzkj.cloudplatform.utils.ControllerHelper;
import com.jxctdzkj.cloudplatform.utils.FlieHttpUtil;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import com.jxctdzkj.cloudplatform.utils.Utils;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.dao.pager.Pager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import java.io.File;
import java.util.List;

/**
 * 演示地址管理
 * whp 2019年5月31日08:52:21
 */
@Slf4j
@RequestMapping({"demoAddress"})
@RestController
public class DemoAddressController {

    @Autowired
    Dao dao;

    // 演示地址管理页面跳转
    @RequestMapping(value = "toDemoAddress")
    public ModelAndView toDemoAddress(){
        return new ModelAndView("demoAddress/list");
    }

    // 新增-跳转
    @RequestMapping(value = "toAdd")
    public ModelAndView toAdd(){
        return new ModelAndView("demoAddress/addOrUpdate", "bean", new DemoAddressBean());
    }

    // 修改-跳转
    @RequestMapping(value = "toUpdate")
    public ModelAndView toUpdate(String id){
        DemoAddressBean bean = dao.fetch(DemoAddressBean.class, Cnd.where("id", "=", id));
        return new ModelAndView("demoAddress/addOrUpdate", "bean", bean);
    }

    /**
     *  李英豪 2019-08-02 修改sql语句，增加对大屏展示表升序排序 根据sort
     */
    // 获取列表
    @RequestMapping(value = "/getList")
    @ResponseBody
    public ResultObject getList(int page, int size, String name, String status){
        try {
//            String userName = ControllerHelper.getInstance(dao).getLoginUserName();
            Cnd cnd  = Cnd.where("1", "=", "1");
            if(StringUtils.isNotBlank(name)){
                cnd = cnd.and("demo_name", "like", "%" + name + "%");
            }
            if(StringUtils.isNotBlank(status)){
                cnd = cnd.and("status", "=", status);
            }
            //2019-08-02
            cnd = (Cnd) cnd.asc("sort");
            List<DemoAddressBean> list = dao.query(DemoAddressBean.class, cnd, new Pager(page, size));
            int count = dao.count(DemoAddressBean.class, cnd);
            return ResultObject.okList(list, page, size, count);
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResultObject.apiError("fail");
        }
    }

    /**
     * 李英豪 2019-08-02  新增修改时传入参数sort,用于大屏展示排序
     *
     *
     */
    // 新增或修改
    @RequestMapping(value = "/save")
    @ResponseBody
    @EnableOpLog(Constant.ModifyType.SAVE)
    public ResultObject save(DemoAddressBean bean){
        try {
            String userName = ControllerHelper.getInstance(dao).getLoginUserName();
            // 新增
            if(bean.getId() == 0){
                bean.setCreateTime(Utils.getCurrentTimestamp());
                bean.setCreateUser(userName);
                bean.setStatus("1");
                bean.setDeleteFlag("0");
                //2019-08-02
                bean.setSort("2");
                return dao.insert(bean) != null ? ResultObject.ok("success") : ResultObject.apiError("fail");
            }else{
                DemoAddressBean oldBean = dao.fetch(DemoAddressBean.class, Cnd.where("id", "=", bean.getId()));
                if(oldBean != null){
                    oldBean.setAddress(bean.getAddress());
                    oldBean.setImgUrl(bean.getImgUrl());
                    oldBean.setDemoName(bean.getDemoName());
                    oldBean.setUserName(bean.getUserName());
                    oldBean.setPassword(bean.getPassword());
                    return dao.update(oldBean) > 0 ? ResultObject.ok("success") : ResultObject.apiError("fail");
                }else{
                    return ResultObject.apiError("fail");
                }
            }
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResultObject.apiError("fail");
        }
    }

    // 删除
    @RequestMapping(value = "/del")
    @ResponseBody
    @EnableOpLog(Constant.ModifyType.DELETE)
    public ResultObject del(String id){
        try {
            DemoAddressBean bean = dao.fetch(DemoAddressBean.class, Cnd.where("id", "=", id));
            if(bean != null){
                bean.setDeleteFlag("1");
                return dao.update(bean) > 0 ? ResultObject.ok("success") : ResultObject.apiError("fail");
            }else{
                return ResultObject.apiError("fail");
            }
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResultObject.apiError("fail");
        }
    }

    // 更新启用/停用状态
    @RequestMapping(value = "/updateStatus")
    @ResponseBody
    @EnableOpLog
    public ResultObject updateStatus(String id, String status){
        try {
            DemoAddressBean bean = dao.fetch(DemoAddressBean.class, Cnd.where("id", "=", id));
            if(bean != null){
                bean.setStatus(status);
                return dao.update(bean) > 0 ? ResultObject.ok("success") : ResultObject.apiError("fail");
            }else{
                return ResultObject.apiError("fail");
            }
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResultObject.apiError("fail");
        }
    }

    /**
     * 上传照片
     * @param file
     * @return
     */
    @RequestMapping("uploadImg")
    @ResponseBody
    public ResultObject uploadImg(MultipartFile file) {
        if (file == null) {
            return ResultObject.apiError("文件为空");
        }
        //上传图片
        String fileName = "";
        String oriName = "";
        try {
            oriName = file.getOriginalFilename();
            String suffix = oriName.substring(oriName.lastIndexOf("."));
            // 5.保存图片
            File tempFile = File.createTempFile("demo", suffix);
            file.transferTo(tempFile);
            String uploadResult = FlieHttpUtil.uploadFile(Constant.Url.FILE_UPLOAD_URL, tempFile);
            JSONObject json = JSON.parseObject(uploadResult);
            fileName = json.getJSONObject("data").getString("fileName");
            if (StringUtils.isBlank(fileName)) {
                throw new Exception("fileName  isEmpty");
            }
            tempFile.delete();
            return ResultObject.ok(Constant.Url.FILE_DOWNLOAD_PATH + fileName);
        } catch (Exception e) {
            log.error(e.toString(), e);
            return ResultObject.apiError("fail");
        }
    }
}
