package com.jxctdzkj.cloudplatform.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.jxctdzkj.cloudplatform.bean.AquacultureTraceSourceBean;
import com.jxctdzkj.cloudplatform.bean.TraceSourceDetailBean;
import com.jxctdzkj.cloudplatform.config.Constant;
import com.jxctdzkj.cloudplatform.utils.ControllerHelper;
import com.jxctdzkj.cloudplatform.utils.FlieHttpUtil;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.dao.Sqls;
import org.nutz.dao.sql.Sql;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RequestMapping({"traceSource"})
@Controller
public class AquacultureTraceSourceController {

    @Autowired
    Dao dao;

    @RequestMapping("")
    public String index() {

        //判断权限
        String userName = ControllerHelper.getLoginUserName();
        if (StringUtils.isBlank(userName)) {
            return "error";
        }
        Sql sql = Sqls.create("SELECT count(1) FROM sys_role_rights a , sys_user_role b,sys_rights c,sys_user d where a.role_id =b.role_id and a.rights_id= c.id and b.user_id=d.id and d.user_name =@userName and c.url =@url ");
        sql.params().set("url", "/traceSource/add");
        sql.params().set("userName", userName);
        sql.setCallback(Sqls.callback.integer());
        dao.execute(sql);
        if (sql.getInt() > 0) {
            return "traceability/traceIndex";
        } else {
            return "traceability/trace";
        }

    }

    @RequestMapping("traceList")
    public String traceList() {
        return "traceability/traceList";
    }

    @RequestMapping("customizedTraceSource")
    public ModelAndView customizedTraceSource(String productCode) {

        if (StringUtils.isBlank(productCode)) {
            return new ModelAndView("error");
        }
        AquacultureTraceSourceBean bean = dao.fetch(AquacultureTraceSourceBean.class, Cnd.where("product_code", "=", productCode));
        if (bean == null) {
            bean = new AquacultureTraceSourceBean();
        }
        return new ModelAndView("traceability/customizedTraceSource", "data", bean);
    }


    @RequestMapping("getTraceSourceList")
    @ResponseBody
    public ResultObject getTraceSourceList(String name) {

        List<AquacultureTraceSourceBean> list = null;
        Sql sql = null;
        if (StringUtils.isNotBlank(name)) {
            list = dao.query(AquacultureTraceSourceBean.class, Cnd.where("name", "like", "%" + name + "%").and(Cnd.exps("is_del", "=", "0").or("is_del", "is", null)));
            sql = Sqls.create(" SELECT count(1) from aquaculture_trace_source where name like @name and is_del=0");
            sql.params().set("name", "%" + name + "%");
        } else {
            list = dao.query(AquacultureTraceSourceBean.class, Cnd.where("1", "=", "1").and(Cnd.exps("is_del", "=", "0").or("is_del", "is", null)));
            sql = Sqls.create(" SELECT count(1) from aquaculture_trace_source where  is_del=0");
        }
        sql.setCallback(Sqls.callback.integer());
        dao.execute(sql);
        return ResultObject.ok().data(list).put("count", sql.getInt()).put("code", 0);
    }

    @RequestMapping("getTraceSource")
    public ModelAndView getTraceSource(String productCode) {

        AquacultureTraceSourceBean traceSourceBean = dao.fetch(AquacultureTraceSourceBean.class, Cnd.where("product_code", "=", productCode));
        if (traceSourceBean == null) {
            traceSourceBean = new AquacultureTraceSourceBean();
        }
        return new ModelAndView("traceability/Traceability-data", "data", traceSourceBean);
    }

    @RequestMapping("addTraceSource")
    @ResponseBody
    public ResultObject addTraceSource(AquacultureTraceSourceBean traceSourceBean) {
        String productCode = traceSourceBean.getProductCode();
        if (StringUtils.isBlank(productCode)) {
            return ResultObject.error("产品编码为空");
        }
        if (StringUtils.isBlank(traceSourceBean.getName())) {
            return ResultObject.error("产品名称为空");
        }
        if (StringUtils.isBlank(traceSourceBean.getLogistics())) {
            return ResultObject.error("物流信息为空");
        }
        if (StringUtils.isBlank(traceSourceBean.getDrugUse())) {
            return ResultObject.error("药物使用为空");
        }
        if (StringUtils.isBlank(traceSourceBean.getFeedSource())) {
            return ResultObject.error("饲料来源为空");
        }
        if (StringUtils.isBlank(traceSourceBean.getSpecs())) {
            return ResultObject.error("规格为空");
        }
        if (StringUtils.isBlank(traceSourceBean.getOriginPlace())) {
            return ResultObject.error("产地为空");
        }
        if (StringUtils.isBlank(traceSourceBean.getSeedSource())) {
            return ResultObject.error("苗种来源为空");
        }
        if (StringUtils.isBlank(traceSourceBean.getProcessService())) {
            return ResultObject.error("加工服务为空");
        }
        AquacultureTraceSourceBean old = dao.fetch(AquacultureTraceSourceBean.class, Cnd.where("product_code", "=", productCode));
        if (old != null) {
            return ResultObject.error("产品编码已存在");
        }
        try {
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
            Date date = simpleDateFormat.parse(traceSourceBean.getProductTime());
            Timestamp productDate = new Timestamp(date.getTime());
            traceSourceBean.setProductDate(productDate);
        } catch (Exception e) {
            log.error(e.toString(), e);
            return ResultObject.error("日期解析失败");
        }
        traceSourceBean = dao.insert(traceSourceBean);
        return ResultObject.ok().data(traceSourceBean);
    }

    @RequestMapping("newFile")
    public String newFile() {
        return "traceability/Traceability-file";
    }

    @RequestMapping("updateTraceSource")
    @ResponseBody
    public ResultObject updateTraceSource(AquacultureTraceSourceBean traceSourceBean) {
        if (traceSourceBean.getId() == null) {
            return ResultObject.error("id is null");
        }
        dao.update(traceSourceBean);
        return ResultObject.ok();
    }

    @RequestMapping("deleteTraceSource")
    @ResponseBody
    public ResultObject deleteTraceSource(Integer id) {
        if (id == null) {
            return ResultObject.error("id is null");
        }
        Sql sql = Sqls.create("update aquaculture_trace_source set is_del =1 where id=@id");
        sql.params().set("id", id);
        dao.execute(sql);
        return ResultObject.ok();
    }

    //商品图片上传功能。
    @RequestMapping("uploadFile")
    @ResponseBody
    public ResultObject uploadFile(MultipartFile file, HttpServletRequest request) {

        if (file == null) {
            return ResultObject.error().put("error", 1).put("message", "文件为空");
        }
        String userName = SecurityUtils.getSubject().getSession().getAttribute("user") + "";
        if (StringUtils.isBlank(userName) || "null".equals(userName)) {
            return ResultObject.error("用户未登录");
        }
        //上传图片
        String fileName = "";
        String oriName = "";
        try {
            oriName = file.getOriginalFilename();
            String suffix = oriName.substring(oriName.lastIndexOf("."));
            // 5.保存图片
            File tempFile = File.createTempFile("goods", suffix);
            file.transferTo(tempFile);
            String uploadResult = FlieHttpUtil.uploadFile(Constant.Url.FILE_UPLOAD_URL, tempFile);
            log.info("uploadResult :" + uploadResult);
            JSONObject json = JSON.parseObject(uploadResult);
            fileName = json.getJSONObject("data").getString("fileName");
            if (StringUtils.isBlank(fileName)) {
                throw new Exception("fileName  isEmpty");
            }
            tempFile.delete();
            String realPath = Constant.Url.FILE_DOWNLOAD_PATH + fileName;
            return ResultObject.ok().put("error", 0).put("url", realPath);

        } catch (Exception e) {
            log.error(e.toString(), e);
            return ResultObject.error().put("error", 1).put("message", e.getMessage());
        }
    }

    @RequestMapping("isExist")
    @ResponseBody
    public ResultObject isExist(String productCode) {
        AquacultureTraceSourceBean traceSourceBean = dao.fetch(AquacultureTraceSourceBean.class, Cnd.where("product_code", "=", productCode));
        if (traceSourceBean == null) {
            return ResultObject.error("您输入的编码有误");
        }
        return ResultObject.ok();
    }

    @RequestMapping(value = "uploadImg", method = RequestMethod.POST)
    @ResponseBody
    public ResultObject uploadImg(MultipartFile imgFile, HttpServletRequest request) {
        if (imgFile == null) {
            return ResultObject.error().put("error", 1).put("message", "文件为空");
        }
        String userName = SecurityUtils.getSubject().getSession().getAttribute("user") + "";
        if (StringUtils.isBlank(userName) || "null".equals(userName)) {
            return ResultObject.error("用户未登录");
        }
        //上传图片
        String fileName = "";
        String oriName = "";
        try {
            oriName = imgFile.getOriginalFilename();
            String suffix = oriName.substring(oriName.lastIndexOf("."));
            // 5.保存图片
            File tempFile = File.createTempFile("goods", suffix);
            imgFile.transferTo(tempFile);
            String uploadResult = FlieHttpUtil.uploadFile(Constant.Url.FILE_UPLOAD_URL, tempFile);
            log.info("uploadResult :" + uploadResult);
            JSONObject json = JSON.parseObject(uploadResult);
            fileName = json.getJSONObject("data").getString("fileName");
            if (StringUtils.isBlank(fileName)) {
                throw new Exception("fileName  isEmpty");
            }
            tempFile.delete();
            String realPath = Constant.Url.FILE_DOWNLOAD_PATH + fileName;
            return ResultObject.ok().put("error", 0).put("url", realPath);

        } catch (Exception e) {
            log.error(e.toString(), e);
            return ResultObject.error().put("error", 1).put("message", e.getMessage());
        }
    }

    @RequestMapping("traceConfig")
    public String traceConfig() {
        return "traceability/traceConfig";
    }


    @RequestMapping("saveCustomizeTrace")
    @ResponseBody
    public ResultObject saveCustomizeTrace(AquacultureTraceSourceBean bean, String data) {

        Integer headerId = dao.insert(bean).getId();
        if (StringUtils.isNotBlank(data)) {
            JSONArray array = JSONArray.parseArray(data);
            for (int i = 0; i < array.size(); i++) {
                JSONObject obj = array.getJSONObject(i);
                String title = obj.getString("title");
                String content = obj.getString("content");
                TraceSourceDetailBean detail = new TraceSourceDetailBean();
                detail.setHeaderId(headerId);
                detail.setTitle(title);
                detail.setContent(content);
                detail.setCreateTime(new Timestamp(System.currentTimeMillis()));
                dao.insert(detail);
            }
        }
        return ResultObject.ok();
    }

    @RequestMapping("getCustomizeTrace")
    @ResponseBody
    public ResultObject getCustomizeTrace(String productCode) {
        if (StringUtils.isBlank(productCode)) {
            return ResultObject.error("产品编码为空");
        }
        AquacultureTraceSourceBean bean = dao.fetch(AquacultureTraceSourceBean.class, Cnd.where("product_code", "=", productCode));
        if (bean == null) {
            return ResultObject.error("产品不存在");
        }
        Integer id = bean.getId();
        List<TraceSourceDetailBean> list = dao.query(TraceSourceDetailBean.class, Cnd.where("header_id", "=", id));
        Map<String, Object> map = new HashMap();
        map.put("header", bean);
        map.put("detail", list);
        return ResultObject.ok().data(map);
    }


    @RequestMapping("getCustomizeTraceDetail")
    @ResponseBody
    public ResultObject getCustomizeTraceDetail(Integer headerId) {
        if (headerId == null) {
            return ResultObject.error("headerId为空");
        }
        List<TraceSourceDetailBean> list = dao.query(TraceSourceDetailBean.class, Cnd.where("header_id", "=", headerId));
        return ResultObject.ok().data(list);
    }


    @RequestMapping("updateCustomizeTrace")
    @ResponseBody
    public ResultObject updateCustomizeTrace(AquacultureTraceSourceBean bean, String data) {

        dao.update(bean);
        if (StringUtils.isNotBlank(data)) {
            JSONArray array = JSONArray.parseArray(data);
            for (int i = 0; i < array.size(); i++) {
                JSONObject obj = array.getJSONObject(i);
                Integer id =obj.getInteger("id");
                String title = obj.getString("title");
                String content = obj.getString("content");
                TraceSourceDetailBean detail = new TraceSourceDetailBean();
                detail.setTitle(title);
                detail.setContent(content);
                detail.setHeaderId(bean.getId());
                if(id==null){
                    detail.setCreateTime(new Timestamp(System.currentTimeMillis()));
                    dao.insert(detail);
                }else{
                    detail.setId(id);
                    dao.update(detail);
                }

            }
        }
        return ResultObject.ok();
    }

    @RequestMapping("traceConfigEdit")
    public ModelAndView traceConfigEdit(String productCode){
        if(StringUtils.isBlank(productCode)){
            log.error("productCode 为空");
            return new ModelAndView("error");
        }
        AquacultureTraceSourceBean data=dao.fetch(AquacultureTraceSourceBean.class,Cnd.where("product_code","=",productCode));
        if(data==null){
            log.error("溯源档案不存在");
            return new ModelAndView("error");
        }
        return new ModelAndView("traceability/traceConfigEdit","data",data);
    }
}
