package com.jxctdzkj.cloudplatform.controller;

import com.jxctdzkj.cloudplatform.bean.CameraBean;
import com.jxctdzkj.cloudplatform.bean.DeviceBean;
import com.jxctdzkj.cloudplatform.bean.NewAquacultureTraceSourceInfoBean;
import com.jxctdzkj.cloudplatform.bean.NewAquacultureTraceSourceSendBean;
import com.jxctdzkj.cloudplatform.bean.SysUserBean;
import com.jxctdzkj.cloudplatform.utils.ControllerHelper;
import com.jxctdzkj.cloudplatform.utils.ResultObject;

import org.apache.commons.lang3.StringUtils;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.dao.pager.Pager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequestMapping("newTraceSource")
public class ATSNewController {

    @Autowired
    Dao dao;

    //展示所有
    @RequestMapping("newViewAllTrace")
    public String newViewAllTrace() {
        return "newTraceability/newViewAllTrace";
    }

    @ResponseBody//所有数据页面展示
    @RequestMapping("newGetTraceSourceList")
    public Object newGetTraceSourceList(
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            @RequestParam(value = "size", required = false, defaultValue = "100") int size,
            String name) {
        Pager pager = dao.createPager(page, size);
        Cnd cnd = Cnd.where("is_del", "=", "0");
        List<NewAquacultureTraceSourceInfoBean> beanList;
        if(name != null && name.length() > 0){//进入模糊查询
            beanList = dao.query(NewAquacultureTraceSourceInfoBean.class, cnd.and("name", "like", "%"+name+"%"), pager);
        }else{//查所有
            beanList = dao.query(NewAquacultureTraceSourceInfoBean.class, cnd, pager);
        }
        long count = dao.count(NewAquacultureTraceSourceInfoBean.class, cnd);
        return ResultObject.okList(beanList, page, size, count);
    }

    //主图产品介绍
    @RequestMapping("newCustomizedTraceSource")
    public ModelAndView newCustomizedTraceSource(String productCode) {
        if (StringUtils.isBlank(productCode)) {
            return new ModelAndView("error");
        }
        NewAquacultureTraceSourceInfoBean bean = dao.fetch(NewAquacultureTraceSourceInfoBean.class, Cnd.where("product_code", "=", productCode));
        if (bean == null) {
            bean = new NewAquacultureTraceSourceInfoBean();
        }
        return new ModelAndView("traceability/index", "data", bean);
    }

    //通过产品编码进行溯源
    @RequestMapping("newGetTraceSourceToProductCode")
    public ModelAndView newGetTraceSourceToProductCode(String productCode) {
        NewAquacultureTraceSourceInfoBean traceSourceBean = dao.fetch(NewAquacultureTraceSourceInfoBean.class, Cnd.where("product_code", "=", productCode));
        if (traceSourceBean == null) {
            traceSourceBean = new NewAquacultureTraceSourceInfoBean();
        }
        return new ModelAndView("traceability/newTraceability-data", "data", traceSourceBean);
    }

    //建立溯源档案
    @RequestMapping("newNFile")
    public String newFile() {
        return "addTraceArchive";
    }

    @ResponseBody//添加溯源档案
    @RequestMapping("newAddTraceSource")
    public ResultObject newAddTraceSource(NewAquacultureTraceSourceInfoBean nATSInfoBean) {
        if (StringUtils.isBlank(nATSInfoBean.getRelayNumber())) {
            return ResultObject.error("继电器编号为空");
        }
        if (StringUtils.isBlank(nATSInfoBean.getCameraNumber())) {
            return ResultObject.error("摄像头编号为空");
        }
        if (StringUtils.isBlank(nATSInfoBean.getPosition())) {
            return ResultObject.error("经纬度为空");
        }
        if (StringUtils.isBlank(nATSInfoBean.getProductCode())) {
            return ResultObject.error("产品编号为空");
        }else if(nATSInfoBean.getProductCode().length() != 8){
            return ResultObject.error("产品编码长度为八位，请重新检查");
        }
        if (StringUtils.isBlank(nATSInfoBean.getName())) {
            return ResultObject.error("产品名称为空");
        }
        if (StringUtils.isBlank(nATSInfoBean.getTitle())) {
            return ResultObject.error("标题为空");
        }
        if(StringUtils.isBlank(nATSInfoBean.getProductTime())){
            return ResultObject.error("成熟时间不能为空");
        }
        if (StringUtils.isBlank(nATSInfoBean.getAquacultureArea())) {
            return ResultObject.error("养殖面积为空");
        }
        if (StringUtils.isBlank(nATSInfoBean.getYield())) {
            return ResultObject.error("产量为空");
        }
        if (StringUtils.isBlank(nATSInfoBean.getPlaceOfOrigin())) {
            return ResultObject.error("产地为空");
        }
        if (StringUtils.isBlank(nATSInfoBean.getMessage())) {
            return ResultObject.error("产品简介为空");
        }
        NewAquacultureTraceSourceInfoBean old = dao.fetch(NewAquacultureTraceSourceInfoBean.class, Cnd.where("product_code", "=", nATSInfoBean.getProductCode()));
        if (old != null) {
            return ResultObject.error("产品编号已存在，请勿重复添加");
        }
        try {
            dateConversion(nATSInfoBean);
        }catch (Exception e){
            log.error(e.toString(), e);
            return ResultObject.error("日期填写错误");
        }
        nATSInfoBean.setUserName(ControllerHelper.getLoginUserName());
        nATSInfoBean = dao.insert(nATSInfoBean);
        return ResultObject.ok().data(nATSInfoBean);
    }

    //添加溯源信息。页面跳转
    @RequestMapping("traceSourceInfo")
    public ModelAndView  traceSourceInfo(String id) {
        return new ModelAndView("newTraceability/Traceability-info","data",id);
    }

    @ResponseBody//为溯源产品添加阶段
    @RequestMapping("newAddTraceSourceInfo")
    public ResultObject newAddTraceSourceInfo(String[] data, NewAquacultureTraceSourceSendBean nATSSendBean, int sendid) {
        if (StringUtils.isBlank(nATSSendBean.getPresent())) {
            return ResultObject.error("阶段名称不能为空");
        }
        if (StringUtils.isBlank(nATSSendBean.getImgInfo())) {
            return ResultObject.error("溯源信息简介不能为空");
        }
        NewAquacultureTraceSourceSendBean fetch = dao.fetch(NewAquacultureTraceSourceSendBean.class, Cnd.where("send_id", "=", sendid).and("type", "=", 0).and("stage", "=", nATSSendBean.getStage()));
        if(fetch != null){
            return ResultObject.error("此阶段已存在，请勿重复添加");
        }
        if (data != null) {//对图片路径进行分割、拼接
            String s = "";
            for (String i : data) {
                s = s + i + "+";
            }
            nATSSendBean.setImgUrl(s);
            nATSSendBean.setSendId(sendid);
        }
        nATSSendBean.setImgCount(data.length);
        nATSSendBean.setUserName(ControllerHelper.getLoginUserName());
        nATSSendBean.setType(0);
        dao.insert(nATSSendBean);
        return ResultObject.ok();
    }

    //添加溯源功能出溯源阶段外的所有图片。
    @RequestMapping("newFileProcess")
    public ModelAndView newFileProcess(String id) {
        return new ModelAndView("newTraceability/newTracebility-process","data",id);
    }

    @ResponseBody//添加查询详情界面的轮播图
    @RequestMapping("addBannerImg")
    public ResultObject addBannerImg(String[] data, int sendId) {
        NewAquacultureTraceSourceSendBean fetch = dao.fetch(NewAquacultureTraceSourceSendBean.class, Cnd.where("sendId", "=", sendId).and("type", "=", 1));
        if(fetch != null){
            return ResultObject.error("该产品的轮播图已存在，请先删除后添加");
        }
        NewAquacultureTraceSourceSendBean n = setNewAquacultureTraceSourceSendBeanValues(data, sendId, "轮播图", 1);
        dao.insert(n);
        return ResultObject.ok();
    }

    @ResponseBody//上传产品标签
    @RequestMapping("addQualifiedLabel")
    public ResultObject addQualifiedLabel(String[] data, int sendId){
        NewAquacultureTraceSourceSendBean fetch = dao.fetch(NewAquacultureTraceSourceSendBean.class, Cnd.where("sendId", "=", sendId).and("type", "=", "2"));
        if(fetch != null){
            return ResultObject.error("该产品的产品标签已存在，请先删除后添加");
        }
        NewAquacultureTraceSourceSendBean n = setNewAquacultureTraceSourceSendBeanValues(data, sendId, "产品标签", 2);
        dao.insert(n);
        return ResultObject.ok();
    }

    @ResponseBody//上传产品监测证书
    @RequestMapping("addCertificate")
    public ResultObject addCertificate(String[] data, int sendId){
        NewAquacultureTraceSourceSendBean fetch = dao.fetch(NewAquacultureTraceSourceSendBean.class, Cnd.where("sendId", "=", sendId).and("type", "=", "3"));
        if(fetch != null){
            return ResultObject.error("该产品的检测证书已存在，请先删除后添加");
        }
        NewAquacultureTraceSourceSendBean n = setNewAquacultureTraceSourceSendBeanValues(data, sendId, "产品监测书", 3);
        dao.insert(n);
        return ResultObject.ok();
    }

    @ResponseBody//上传企业信息
    @RequestMapping("addEnterpriseInfo")
    public ResultObject addEnterpriseInfo(String[] data, int sendId){
        NewAquacultureTraceSourceSendBean fetch = dao.fetch(NewAquacultureTraceSourceSendBean.class, Cnd.where("sendId", "=", sendId).and("type", "=", "4"));
        if(fetch != null){
            return ResultObject.error("该产品的企业信息已存在，请先删除后添加");
        }
        NewAquacultureTraceSourceSendBean n = setNewAquacultureTraceSourceSendBeanValues(data, sendId, "企业信息", 4);
        dao.insert(n);
        return ResultObject.ok();
    }

    @ResponseBody//级联假删
    @RequestMapping("newDeleteTraceSource")
    public ResultObject deleteTraceSource(int id) {
        NewAquacultureTraceSourceInfoBean id2 = dao.fetch(NewAquacultureTraceSourceInfoBean.class, Cnd.where("id", "=", id));
        id2.setIsDel(1);
        dao.update(id2);
        List<NewAquacultureTraceSourceSendBean> sendId = dao.query(NewAquacultureTraceSourceSendBean.class, Cnd.where("sendId", "=", id));
        for(int i=0; i<sendId.size(); i++){
            sendId.get(i).setIsDel(1);
            dao.update(sendId.get(i));
        }
        return ResultObject.ok();
    }

    @ResponseBody//针对单独溯源阶段的假删
    @RequestMapping("deleteToTraceSourceStage")
    public ResultObject deleteToTraceSourceStage(int id){
        NewAquacultureTraceSourceSendBean fetch = dao.fetch(NewAquacultureTraceSourceSendBean.class, id);
        fetch.setIsDel(1);
        dao.update(fetch);
        return ResultObject.ok();
    }

    //修改页面的跳转
    @RequestMapping("updataTraceSourceMessage")
    public ModelAndView updataTraceSourceMessage(int id){
        return new ModelAndView("newTraceability/updataTraceSourceMessage", "id", id);
    }

    @ResponseBody//根据ID查询产品所有信息
    @RequestMapping("getTraceSourceMessageForId")
    public ResultObject getTraceSourceMessageForId(int id){
        NewAquacultureTraceSourceInfoBean id1 = dao.fetch(NewAquacultureTraceSourceInfoBean.class, Cnd.where("id", "=", id));
        return ResultObject.ok().data(id1);
    }

    @ResponseBody//修改溯源基本信息
    @RequestMapping("updataTraceSourceBasicMessage")
    public ResultObject updataTraceSourceBasicMessage(NewAquacultureTraceSourceInfoBean n){
        n.setUserName(ControllerHelper.getLoginUserName());
        try {
            dateConversion(n);
        }catch (Exception e){
            log.error(e.toString(), e);
            return ResultObject.error("日期填写错误");
        }
        dao.update(n);
        return ResultObject.ok();
    }

    @ResponseBody//根据ID获取banner
    @RequestMapping("getTraceSourceBannerForId")
    public ResultObject getTraceSourceBannerForId(int id){
        NewAquacultureTraceSourceSendBean id1 = dao.fetch(NewAquacultureTraceSourceSendBean.class, Cnd.where("sendId", "=", id).and("type", "=", "1"));
        return ResultObject.ok().data(id1);
    }

    @ResponseBody//修改轮播图
    @RequestMapping("updateBannerImg")
    public ResultObject updateBannerImg(String[] data, int sendId){
        return updateMessage(data, sendId, 1);
    }

    @ResponseBody//追加修改轮播图
    @RequestMapping("updateBannerImgAppendImg")
    public ResultObject updateBannerImgAppendImg(String[] data, int sendId, String[] oldImg){
        return updateBannerImg(appenImg(data, oldImg), sendId);
    }

    @ResponseBody//根据ID获取产品标签
    @RequestMapping("qualifiedLabel")
    public ResultObject qualifiedLabel(int id) {
        NewAquacultureTraceSourceSendBean fetch = dao.fetch(NewAquacultureTraceSourceSendBean.class, Cnd.where("sendId", "=", id).and("type", "=", 2));
        return ResultObject.ok().data(fetch);
    }

    @ResponseBody//根据Id修改产品标签
    @RequestMapping("updateQualifiedLabelImg")
    public ResultObject updateQualifiedLabelImg(String[] data, int sendId){
        return updateMessage(data, sendId, 2);
    }

    @ResponseBody//根据ID获取产品监测证书
    @RequestMapping("Certificate")
    public ResultObject Certificate(int id) {
        NewAquacultureTraceSourceSendBean fetch = dao.fetch(NewAquacultureTraceSourceSendBean.class, Cnd.where("send_id", "=", id).and("type", "=", 3));
        return ResultObject.ok().data(fetch);
    }

    @ResponseBody//根据Id修改产品监测证书
    @RequestMapping("updateCertificateImg")
    public ResultObject updateCertificateImg(String[] data, int sendId){
        return updateMessage(data, sendId, 3);
    }

    @ResponseBody//根据Id修改产品监测证书,追加图片
    @RequestMapping("updateCertificateImgAppendImg")
    public ResultObject updateCertificateImgAppendImg(String[] data, int sendId, String[] oldImg){
        return updateCertificateImg(appenImg(data, oldImg), sendId);
    }

    @ResponseBody//根据ID查询企业信息
    @RequestMapping("enterpriseInfo")
    public ResultObject enterpriseInfo(int id) {
        NewAquacultureTraceSourceSendBean fetch = dao.fetch(NewAquacultureTraceSourceSendBean.class, Cnd.where("send_id", "=", id).and("type", "=", 4));
        return ResultObject.ok().data(fetch);
    }

    @ResponseBody//根据Id修改企业信息
    @RequestMapping("updateEnterpriseInfoImg")
    public ResultObject updateEnterpriseInfoImg(String[] data, int sendId){
        return updateMessage(data, sendId, 4);
    }

    @ResponseBody//根据Id修改企业信息,追加图片
    @RequestMapping("updateEnterpriseInfoImgAppenImg")
    public ResultObject updateEnterpriseInfoImgAppenImg(String[] data, int sendId, String[] oldImg){
        return updateEnterpriseInfoImg(appenImg(data, oldImg), sendId);
    }

    @ResponseBody//查询所有溯源阶段
    @RequestMapping("selectAllTraceabilityStage")
    public ResultObject selectAllTraceabilityStage(int sendId){
        List<NewAquacultureTraceSourceSendBean> query = dao.query(NewAquacultureTraceSourceSendBean.class, Cnd.where("send_id", "=", sendId).and("type", "=", 0).and("is_del", "=", 0).orderBy("stage,id", "asc"));
        return ResultObject.ok().data(query);
    }

    //根据溯源阶段的Id查询溯源的阶段
    @RequestMapping("selectTraceabilityStageToId")
    public ModelAndView selectTraceabilityStageToId(int id){
        NewAquacultureTraceSourceSendBean id1 = dao.fetch(NewAquacultureTraceSourceSendBean.class, Cnd.where("id", "=", id));
        return new ModelAndView("newTraceability/traceabilityStageMessage", "data", id1);
    }

    @ResponseBody//修改溯源阶段的信息
    @RequestMapping("updateTraceSourceMessage")
    public ResultObject updateTraceSourceMessage(String[] data, String present, String imgInfo, int stage, int id) {
        NewAquacultureTraceSourceSendBean id1 = dao.fetch(NewAquacultureTraceSourceSendBean.class, Cnd.where("id", "=", id));
        id1.setImgUrl(getImgUrl(data));
        id1.setPresent(present);
        id1.setImgInfo(imgInfo);
        id1.setImgCount(data.length);
        id1.setStage(stage);
        dao.update(id1);
        return ResultObject.ok();
    }

    @ResponseBody//修改溯源阶段的信息,追加图片
    @RequestMapping("updateTraceSourceMessageAppenImg")
    public ResultObject updateTraceSourceMessageAppenImg(String[] data, String present, String imgInfo, int stage, int id, String[] oldImg) {
        return updateTraceSourceMessage(appenImg(data, oldImg), present, imgInfo, stage, id);
    }

    /*
     * 以下主要针对普通用户
     * */

    //根据权限进行页面跳转
    @RequestMapping("newViewTraceSource")
    public String newViewTraceSource(){
        String loginUserName = ControllerHelper.getLoginUserName();
        SysUserBean user = dao.fetch(SysUserBean.class, Cnd.where("userName", "=", loginUserName));
        if(user.getRole() == 26){
            return "newTraceability/newTraceIndex";
        }
        return "newTraceability/newTrace";
    }

    @ResponseBody//根据产品的编号查询产品，返回展示，携带banner、产品标签、产品监测证书、企业信息
    @RequestMapping("newGetTraceSource")
    public ModelAndView newGetTraceSource(String productCode){
        String userName = ControllerHelper.getLoginUserName();
        NewAquacultureTraceSourceInfoBean master = dao.fetch(NewAquacultureTraceSourceInfoBean.class, Cnd.where("productCode", "=", productCode));
        NewAquacultureTraceSourceSendBean imgUrlType1 = dao.fetch(NewAquacultureTraceSourceSendBean.class, Cnd.where("sendId", "=", master.getId()).and("type", "=", "1"));
        NewAquacultureTraceSourceSendBean imgUrlType2 = dao.fetch(NewAquacultureTraceSourceSendBean.class, Cnd.where("sendId", "=", master.getId()).and("type", "=", "2"));
        NewAquacultureTraceSourceSendBean imgUrlType3 = dao.fetch(NewAquacultureTraceSourceSendBean.class, Cnd.where("sendId", "=", master.getId()).and("type", "=", "3"));
        NewAquacultureTraceSourceSendBean imgUrlType4 = dao.fetch(NewAquacultureTraceSourceSendBean.class, Cnd.where("sendId", "=", master.getId()).and("type", "=", "4"));
        //格式化时间变为 yyyy-MM-dd
        String strn = new SimpleDateFormat("yyyy-MM-dd").format(master.getMaturityTime());
        master.setProductTime(strn);
        master.setType1ImgUrl(getImgUrlSplit(imgUrlType1.getImgUrl()));
        master.setType2ImgUrl(getImgUrlSplit(imgUrlType2.getImgUrl()));
        master.setType3ImgUrl(getImgUrlSplit(imgUrlType3.getImgUrl()));
        master.setType4ImgUrl(getImgUrlSplit(imgUrlType4.getImgUrl()));
        return new ModelAndView("bohaiBay/bohaiBay", "data", master);
    }

    @ResponseBody//根据摄像头ID查询摄像头
    @RequestMapping("getCameraToCameraId")
    public ResultObject getCameraToCameraId(String ncode){
        CameraBean id = dao.fetch(CameraBean.class, Cnd.where("ncode", "=", ncode));
        return ResultObject.ok().data(id);
    }

    @ResponseBody//获取实时数据
    @RequestMapping("getMessageToDeviceId")
    public ResultObject getMessageToDeviceId(String ncode){
        DeviceBean ncode1 = dao.fetch(DeviceBean.class, Cnd.where("deviceNumber", "=", ncode));
        return ResultObject.ok().data(ncode1);
    }

    @ResponseBody//获取所有溯源阶段
    @RequestMapping("getListToNewAquacultureTraceSourceSendAndType0")
    public ResultObject getListToNewAquacultureTraceSourceSendAndType0(String id){
        List<NewAquacultureTraceSourceSendBean> sendId = dao.query(NewAquacultureTraceSourceSendBean.class, Cnd.where("sendId", "=", id).and("type", "=", "0").and("is_del", "=", "0").orderBy("stage,id", "asc"));
        return ResultObject.ok().data(sendId);
    }

    @ResponseBody//获取所有轮播图
    @RequestMapping("getListToNewAquacultureTraceSourceSendAndType1")
    public ResultObject getListToNewAquacultureTraceSourceSendAndType1(String id){
        List<NewAquacultureTraceSourceSendBean> sendId = dao.query(NewAquacultureTraceSourceSendBean.class, Cnd.where("sendId", "=", id).and("type", "=", "1").and("is_del", "=", "0").orderBy("stage,id", "asc"));
        return ResultObject.ok().data(sendId);
    }

    @ResponseBody//只针对溯源功能的图片上传
    @RequestMapping("newUpLoadImg")
    public ResultObject newUpLoadImg(MultipartFile file, HttpServletRequest request){
        AquacultureTraceSourceController aquacultureTraceSourceController = new AquacultureTraceSourceController();
        return aquacultureTraceSourceController.uploadImg(file, request);
    }

    @ResponseBody//获取产品编码，判断是否合法
    @RequestMapping("selectAllTraceSourceToId")
    public ResultObject selectAllTraceSourceToId(String productCode){
        if(StringUtils.isBlank(productCode)){
            return ResultObject.error("产品编码不能为空");
        }else if(productCode.length() != 8){
            return ResultObject.error("产品编码长度为八位，请重新检查");
        }
        NewAquacultureTraceSourceInfoBean id1 = dao.fetch(NewAquacultureTraceSourceInfoBean.class, Cnd.where("productCode", "=", productCode).and("isDel", "=", 0));
        if(id1 == null){
            return ResultObject.error("产品编码输入有误，未找到该产品");
        }
        NewAquacultureTraceSourceSendBean imgUrlType0 = dao.fetch(NewAquacultureTraceSourceSendBean.class, Cnd.where("sendId", "=", id1.getId()).and("type", "=", "0"));
        if(imgUrlType0 == null){
            return ResultObject.error("已找到该产品，信息尚在完善中，请稍后再试");
        }
        NewAquacultureTraceSourceSendBean imgUrlType1 = dao.fetch(NewAquacultureTraceSourceSendBean.class, Cnd.where("sendId", "=", id1.getId()).and("type", "=", "1"));
        if(imgUrlType1 == null){
            return ResultObject.error("已找到该产品，信息尚在完善中，请稍后再试");
        }
        NewAquacultureTraceSourceSendBean imgUrlType2 = dao.fetch(NewAquacultureTraceSourceSendBean.class, Cnd.where("sendId", "=", id1.getId()).and("type", "=", "2"));
        if(imgUrlType2 == null){
            return ResultObject.error("已找到该产品，信息尚在完善中，请稍后再试");
        }
        NewAquacultureTraceSourceSendBean imgUrlType3 = dao.fetch(NewAquacultureTraceSourceSendBean.class, Cnd.where("sendId", "=", id1.getId()).and("type", "=", "3"));
        if(imgUrlType3 == null){
            return ResultObject.error("已找到该产品，信息尚在完善中，请稍后再试");
        }
        NewAquacultureTraceSourceSendBean imgUrlType4 = dao.fetch(NewAquacultureTraceSourceSendBean.class, Cnd.where("sendId", "=", id1.getId()).and("type", "=", "4"));
        if(imgUrlType4 == null){
            return ResultObject.error("已找到该产品，信息尚在完善中，请稍后再试");
        }
        return ResultObject.ok().data(id1);
    }

    @ResponseBody//根据ID获取图片路径
    @RequestMapping("getImgUrlFormId")
    public ResultObject getImgUrlFormId(int id){
        NewAquacultureTraceSourceSendBean id1 = dao.fetch(NewAquacultureTraceSourceSendBean.class, Cnd.where("id", "=", id));
        return ResultObject.ok().data(id1);
    }


    //以下均为共性抽取
    //日期转换
    public void dateConversion(NewAquacultureTraceSourceInfoBean n) throws Exception{
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
        Date date = simpleDateFormat.parse(n.getProductTime());
        Timestamp productDate = new Timestamp(date.getTime());
        n.setMaturityTime(productDate);
    }

    //共性抽取.增
    public NewAquacultureTraceSourceSendBean setNewAquacultureTraceSourceSendBeanValues(String[] data, int sendId, String present, int type){
        NewAquacultureTraceSourceSendBean newAquacultureTraceSourceSendBean = new NewAquacultureTraceSourceSendBean();
        String s = "";
        for (String i : data) {
            s = s + i + "+";
        }
        newAquacultureTraceSourceSendBean.setPresent(present);
        newAquacultureTraceSourceSendBean.setUserName(ControllerHelper.getLoginUserName());
        newAquacultureTraceSourceSendBean.setImgUrl(s);
        newAquacultureTraceSourceSendBean.setImgCount(data.length);
        newAquacultureTraceSourceSendBean.setSendId(sendId);
        newAquacultureTraceSourceSendBean.setType(type);
        return newAquacultureTraceSourceSendBean;
    }

    //以+分割图片URL
    public String[] getImgUrlSplit(String s){
        return s.split("\\+");
    }

    //对前端传过来的图片进行分割
    public String getImgUrl(String[] data){
        String s = "";
        for(int i=0; i<data.length; i++){
            s = s+data[i]+"+";
        }
        return s;
    }

    //改
    public ResultObject updateMessage(String[] data, int sendId, int type){
        NewAquacultureTraceSourceSendBean fetch = dao.fetch(NewAquacultureTraceSourceSendBean.class, Cnd.where("sendId", "=", sendId).and("type", "=", type));
        fetch.setImgUrl(getImgUrl(data));
        fetch.setImgCount(data.length);
        dao.update(fetch);
        return ResultObject.ok();
    }

    //追加图片
    public String[] appenImg(String[] data, String[] oldImg){
        if(oldImg == null || oldImg.length == 0){
            return data;
        }
        if(data == null || data.length == 0){
            return java.util.Arrays.copyOf(oldImg, oldImg.length-1);
        }
        int flag = 0;
        String[] oldImgTwo = java.util.Arrays.copyOf(oldImg, data.length+(oldImg.length-1));
        for(int i=(oldImg.length-1); i<oldImgTwo.length; i++){
            oldImgTwo[i] = data[flag];
            flag++;
        }
        return oldImgTwo;
    }
}
