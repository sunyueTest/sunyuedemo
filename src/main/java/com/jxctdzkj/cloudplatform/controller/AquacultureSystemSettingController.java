package com.jxctdzkj.cloudplatform.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.jxctdzkj.cloudplatform.bean.AquacultureExpertsBean;
import com.jxctdzkj.cloudplatform.bean.AquacultureExpertsDiagnosisBean;
import com.jxctdzkj.cloudplatform.bean.SysUserBean;
import com.jxctdzkj.cloudplatform.bean.Ys7TokenBean;
import com.jxctdzkj.cloudplatform.config.Constant;
import com.jxctdzkj.cloudplatform.utils.ControllerHelper;
import com.jxctdzkj.cloudplatform.utils.FlieHttpUtil;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.dao.sql.Sql;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.util.*;

@Controller
@Slf4j
@RequestMapping({"aquacultureSystemSetting"})
public class AquacultureSystemSettingController {

    @Autowired
    Dao dao;

    /**
     * 添加专家-跳转
     *
     * @return
     */
    @RequestMapping(value = "toAddExperts")
    public ModelAndView toAddExperts() {
        return new ModelAndView("aquaculture/systemSetting/addExperts");
    }

    /**
     * 修改专家信息-跳转
     *
     * @return
     */
    @RequestMapping(value = "toUpdateExperts")
    public ModelAndView toUpdateExperts(String id) {
        return new ModelAndView("aquaculture/systemSetting/addExperts", "id", id);
    }
    /**
     * 修改萤石云秘钥-跳转
     *
     * @return
     */
    @RequestMapping(value = "updateYs7Token")
    public ModelAndView updateYs7Token() {
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        if (StringUtils.isBlank(userName)) {
            log.error("用户未登录");
            return null;
        }
        Ys7TokenBean hkToken = new Ys7TokenBean(), dhToken = new Ys7TokenBean();
        List<Ys7TokenBean> tokens = dao.query(Ys7TokenBean.class, Cnd.where("user_name", "=", userName));
        if (tokens != null && tokens.size() > 0) {
            String curCameraType = "";
            for (int i = 0; i < tokens.size(); i++) {
                curCameraType = tokens.get(i).getCameraType();
                if (curCameraType.equals(Constant.CameraType.HAI_KANG)) {
                    hkToken = tokens.get(i);
                } else if (curCameraType.equals(Constant.CameraType.DA_HUA)) {
                    dhToken = tokens.get(i);
                }
            }
        }

        HashMap<String, Ys7TokenBean> map = new HashMap<>();
        map.put("hkToken", hkToken);
        map.put("dhToken", dhToken);
        return new ModelAndView("aquaculture/systemSetting/updateYs7Token", "ys7Token", map);
    }

    /**
     * 添加专家
     *
     * @param paramBean
     * @return
     */
    @RequestMapping(value = "addExperts", method = RequestMethod.POST)
    @ResponseBody
    public ResultObject addExperts(AquacultureExpertsBean paramBean) {
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        try {
            if(paramBean.getId() != 0){
                AquacultureExpertsBean bean = dao.fetch(AquacultureExpertsBean.class, Cnd.where("id", "=", paramBean.getId()));
                if(bean != null){
                    paramBean.setCreateUser(bean.getCreateUser());
                    paramBean.setCreateTime(bean.getCreateTime());
                    dao.update(paramBean);
                    return ResultObject.ok();
                }else{
                    return ResultObject.apiError("fail");
                }
            }else{
                paramBean.setCreateTime(new Date());
                paramBean.setCreateUser(userName);
                paramBean.setExamine("1");
                paramBean.setIsDelete("0");
                //新增
                if (dao.insert(paramBean) != null) {
                    return ResultObject.ok();
                } else {
                    return ResultObject.apiError("fail");
                }
            }
        } catch (Exception e) {
            return ResultObject.apiError("fail");
        }
    }

    /**
     * 根据当前用户查询专家列表
     * @User null
     * 2019-08-06
     * 将原本只有创建人才可以查看渔技专家信息，改为所有用户都可以查看，增加是否删除判断
     * @User 李英豪
     *
     */
    @RequestMapping(value = "getExpertsList", method = RequestMethod.POST)
    @ResponseBody
    public ResultObject getExpertsList(@RequestParam(value = "type", required = false, defaultValue = "1")String type) {
        //String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        try {
        //List<AquacultureExpertsBean> list = dao.query(AquacultureExpertsBean.class, Cnd.where("createUser", "=", userName));
            List<AquacultureExpertsBean> list = dao.query(AquacultureExpertsBean.class,Cnd.where("is_delete","=","0").and("examine","=","1").and("type","=",type));
            return ResultObject.ok(list);
        } catch (Exception e) {
            return ResultObject.apiError("fail");
        }
    }

    /**
     * 点击专家管理查看专家信息
     * 如果是一级用户可以查看所有专家，进行操作
     * 如果是普通用户是不允许他查看所有专家的，如果他自己是个专家，就只可以查看他自己创建的，并且对自己进行操作
     * @User 李英豪
     */
    @RequestMapping(value = "getExpertsUser", method = RequestMethod.POST)
    @ResponseBody
    public ResultObject getExpertsUser() {
        try {
            SysUserBean userBean = ControllerHelper.getInstance(dao).getLoginUser();
            List<AquacultureExpertsBean>list =new ArrayList<AquacultureExpertsBean>();
            if(userBean.getLevel()<=1){
                list = dao.query(AquacultureExpertsBean.class,Cnd.where("is_delete","=","0"));

            }else{
                list = dao.query(AquacultureExpertsBean.class, Cnd.where("createUser", "=", userBean.getUserName()));
            }
            return ResultObject.ok(list);
        } catch (Exception e) {
            return ResultObject.apiError("fail");
        }
    }

    /**
     * 查询专家信息by id
     *
     * @return
     */
    @RequestMapping(value = "loadExpertsById", method = RequestMethod.POST)
    @ResponseBody
    public ResultObject loadExpertsById(String id) {
        AquacultureExpertsBean bean = dao.fetch(AquacultureExpertsBean.class, Cnd.where("id", "=", id));
        if(bean != null){
            return ResultObject.ok(bean);
        }else{
            return ResultObject.apiError("fail");
        }
    }

    /**
     * 上传专家照片
     * @param file
     * @param request
     * @return
     */
    @RequestMapping("uploadFile")
    @ResponseBody
    public ResultObject uploadFile(MultipartFile file, HttpServletRequest request) {

        if (file == null) {
            return ResultObject.apiError("文件为空");
        }
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
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
            File tempFile = File.createTempFile("expert", suffix);
            file.transferTo(tempFile);
            String uploadResult = FlieHttpUtil.uploadFile(Constant.Url.FILE_UPLOAD_URL, tempFile);
            log.info("uploadResult :" + uploadResult);
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


    /**
     * 查询有没有用户发给专家的未读信息
     * @return
     * @User 李英豪
     */
    @RequestMapping("findNews")
    @ResponseBody
    public ResultObject findNews(){
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        //获取当前登录用户的所有创建的专家账号id
        List<AquacultureExpertsBean> list=dao.query(AquacultureExpertsBean.class,
                Cnd.where("create_user","=",userName).
                        and("is_delete","=","0"));
        String experts_id="";
        Sql sql;
        if(list.size()>0){
            for(int i=0;i<list.size();i++){
                if(i!=0){
                    experts_id+=",";
                }
                experts_id+=list.get(i).getId();
            }
        List<AquacultureExpertsDiagnosisBean> diagnosisList=dao.query(AquacultureExpertsDiagnosisBean.class,
                Cnd.where("experts_id","in",experts_id).
                        and("answer_flag","=","0"));
            return ResultObject.ok(diagnosisList);
        }
        return ResultObject.apiError("fail");
    }


    /**
     * 查询有没有用户发给专家的信息
     * @return
     * @User 李英豪
     */
    @RequestMapping("in_findNews")
    @ResponseBody
    public ResultObject in_findNews(){
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        //获取当前登录用户的所有创建的专家账号id
        List<AquacultureExpertsBean> list=dao.query(AquacultureExpertsBean.class,
                Cnd.where("create_user","=",userName).
                        and("is_delete","=","0"));
        String experts_id="";
        Sql sql;
        if(list.size()>0){
            for(int i=0;i<list.size();i++){
                if(i!=0){
                    experts_id+=",";
                }
                experts_id+=list.get(i).getId();
            }
            List<AquacultureExpertsDiagnosisBean> diagnosisList=dao.query(AquacultureExpertsDiagnosisBean.class,
                    Cnd.where("experts_id","in",experts_id));
            return ResultObject.ok(diagnosisList);
        }
        return ResultObject.apiError("fail");
    }


    /**
     * 富文本图片上传上传照片
     *
     * @return
     */
    @RequestMapping("uploadImgTwo")
    @ResponseBody
    public String uploadImgTwo(HttpServletRequest request, HttpServletResponse response) {
        MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;

        Iterator item = multipartRequest.getFileNames();
        while (item.hasNext()) {
            String fileName = (String) item.next();

            MultipartFile file = multipartRequest.getFile(fileName);
            if (file == null) {
                return getError("文件为空");
            }
            fileName = "";
            String oriName = "";
            try {
                oriName = file.getOriginalFilename();
                String suffix = oriName.substring(oriName.lastIndexOf("."));
                // 5.保存图片
                File tempFile = File.createTempFile("expert", suffix);
                file.transferTo(tempFile);
                String uploadResult = FlieHttpUtil.uploadFile("http://demo.sennor.net:885/file/upload", tempFile);
                JSONObject json = JSON.parseObject(uploadResult);
                fileName = json.getJSONObject("data").getString("fileName");
                tempFile.delete();
                JSONObject obj = new JSONObject();
                obj.put("error", 0);
                obj.put("url", "http://demo.sennor.net:885/file/" + fileName);
                System.out.println(obj.toJSONString());
                return obj.toJSONString();


            }catch(Exception e) {
                return getError("上传文件失败。");
            }

        }

        return  null;
    }


    private String getError(String message) {
        JSONObject obj = new JSONObject();
        obj.put("error", 1);
        obj.put("message", message);
        return obj.toJSONString();
    }
}
