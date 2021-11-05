package com.jxctdzkj.cloudplatform.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jxctdzkj.cloudplatform.bean.*;
import com.jxctdzkj.cloudplatform.service.ConditionService;
import com.jxctdzkj.cloudplatform.service.ProductionManageService;
import com.jxctdzkj.cloudplatform.service.UserService;
import com.jxctdzkj.cloudplatform.utils.ControllerHelper;
import com.jxctdzkj.cloudplatform.utils.HttpUtilsNew;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import com.jxctdzkj.cloudplatform.utils.ReturnObject;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.protocol.HTTP;
import org.apache.http.util.EntityUtils;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.dao.FieldFilter;
import org.nutz.dao.Sqls;
import org.nutz.dao.pager.Pager;
import org.nutz.dao.sql.Sql;
import org.nutz.dao.util.Daos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import java.text.SimpleDateFormat;
import java.util.*;


@Controller
@Slf4j
@RequestMapping({"aquaculture"})
public class AquacultureController extends BaseController {

    @Autowired
    Dao dao;

    @Autowired
    protected Environment env;

    @Autowired
    ProductionManageService productionManageService;

    @Autowired
    UserService userService;

    @Autowired
    ConditionService conditionService;

    /**
     * 水厂养殖主页面跳转
     * @return
     */
   /* @RequestMapping({""})
    public ModelAndView index(HttpServletRequest request, HttpServletResponse response) {
        org.apache.shiro.session.Session subject = SecurityUtils.getSubject().getSession();
        Object o = subject.getAttribute("user");
        if (o == null) {
            return doLogin(request);

        }
        Map<String, Object> result = new HashMap<>();
        //查询用户的权限菜单
        List<SysRightsBean> menus = rightsService.getMenus(o.toString());
        Cookie[] cookies = request.getCookies();
        String language = "";
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                String name = cookie.getName();
                if (Constant.COOKIE_LANG.equals(name)) {
                    language = cookie.getValue();
                    break;
                }
            }
        }
        //判断用户
        result.put("lang", language);
        result.put("menus", menus);
        return new ModelAndView("aquaculture/aquaculture", "map", result);
    }*/

    /**
     * 物联网管理
     *
     * @return
     */
    @RequestMapping(value = "internetOfThingsManage")
    public ModelAndView internetOfThingsManageHomePage() {
        return new ModelAndView("aquaculture/internetOfThingsManage/internetOfThingsManage");
    }
    /**
     * 物联网管理（演示一下用，后期删除）
     *
     * @return
     */
    @RequestMapping(value = "internetOfThingsManageTwo")
    public ModelAndView internetOfThingsManageTwo() {
        return new ModelAndView("aquaculture/internetOfThingsManage/internetOfThingsManageTwo");
    }

    @RequestMapping(value = "conditionHistory")
    public ModelAndView conditionHistory() {
        return new ModelAndView("aquaculture/conditionConfig/conditionHistory");
    }

    @RequestMapping(value = "conditionAdd")
    public ModelAndView getCondition(Integer id) {
        if (id == null) {
            return new ModelAndView("aquaculture/conditionConfig/conditionAdd", "data", new ConditionConfigBean());
        } else {
            ConditionConfigBean bean = conditionService.getCondition(id);
            return new ModelAndView("aquaculture/conditionConfig/conditionAdd", "data", bean);
        }
    }

    @RequestMapping(value = "conditionList")
    public ModelAndView conditionList() {
        return new ModelAndView("aquaculture/conditionConfig/conditionList");
    }

    /**
     * 公厕大屏
     *
     * @return
     */
    @RequestMapping(value = "toToiletScreen")
    public ModelAndView toToiletScreen() {
        ConfigBean bean = dao.fetch(ConfigBean.class, Cnd.where("id", "=", 10));
        return new ModelAndView("monitor/toiletScreen", "interval_time", bean.getConfigValue());
    }

    /**
     * 管廊大屏
     *
     * @return
     */
    @RequestMapping(value = "toPipeRackScreen")
    public ModelAndView toPipeRackScreen() {
        return new ModelAndView("monitor/pipeRackScreen");
    }

    /**
     * 水产大屏
     *
     * @return
     */
    @RequestMapping(value = "toAquacultureScreen")
    public ModelAndView toAquacultureScreen() {
        ConfigBean bean = dao.fetch(ConfigBean.class, Cnd.where("id", "=", 10));
        return new ModelAndView("aquaculture/aquacultureScreen", "interval_time", bean.getConfigValue());
    }

    /**
     * 水产大屏2
     *
     * @return
     */
    @RequestMapping(value = "toAquacultureScreenForLine")
    public ModelAndView toAquacultureScreenForLine() {
        ConfigBean bean = dao.fetch(ConfigBean.class, Cnd.where("id", "=", 10));
        HashMap<String, Object> map = new HashMap<>();

        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        SysUserInfoBean userInfoBean = dao.fetch(SysUserInfoBean.class, Cnd.where("user_name", "=", userName));

        // 地图点切换间隔 单位毫秒
        map.put("interval_time", bean.getConfigValue());
        bean = dao.fetch(ConfigBean.class, Cnd.where("id", "=", 11));

        // 地图缩放级别
        map.put("map_zoom", bean.getConfigValue());

        // 大屏标题 根据用户配置获得
        if (userInfoBean != null) {
            map.put("company", userInfoBean.getCompany());
        } else {
            // 如果没有默认为 "监控大屏"
            map.put("company", "监控大屏");
        }
        return new ModelAndView("monitor/aquacultureScreenForLine", "map", map);
    }

    /**
     * 生产管理
     *
     * @return
     */
    @RequestMapping(value = "productionManage")
    public ModelAndView productionManage() {
        return new ModelAndView("aquaculture/productionManage/productionManage");
    }

    /**
     * 鱼技服务
     *
     * @return
     */
    @RequestMapping(value = "productService")
    public ModelAndView productService() {
        //获取狱友圈总页数;
        Sql sql = Sqls.create("SELECT count(1) from t_friend_circle_message where type=@type");
        sql.params().set("type", "fish");
        sql.setCallback(Sqls.callback.integer());
        dao.execute(sql);
        int count = sql.getInt();
        int totalPage = (int) Math.ceil((double) count / 10);
        return new ModelAndView("aquaculture/productService/productService", "totalPage", totalPage);
    }


    /**
     * 统计分析
     *
     * @return
     */
    @RequestMapping(value = "statisticalAnalysis")
    public ModelAndView statisticalAnalysis() {
        return new ModelAndView("aquaculture/statisticalAnalysis/statisticalAnalysis");
    }

    /**
     * 行业新闻页面跳转
     *
     * @return
     */
    @RequestMapping(value = "toIndustryNews")
    public ModelAndView toIndustryNews(String id) {
        return new ModelAndView("aquaculture/productService/industryNews", "id", id);
    }

    /**
     * 金融服务页面跳转
     *
     * @return
     */
    @RequestMapping(value = "toFinancialServices")
    public ModelAndView toFinancialServices() {
        Map<String, Object> map = new HashMap<>();


        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        if (StringUtils.isBlank(userName)) {
            return new ModelAndView("error");
        }
//        Sql sql0=Sqls.create("select sum(b.total_price) from  cloud_shop.order_info  b where b.seller=@userName");
//       sql0.params().set("userName",userName);
//       sql0.setCallback(Sqls.callback.integer());
//       dao.execute(sql0);
//       Integer orderAmount=sql0.getInt();
//       map.put("orderAmount",orderAmount);
//       Sql sql=Sqls.create("select sum(att5) from aquaculture_pond_record a,aquaculture_pond_record_detail b where a.detail_id=b.id and b.temp_Id=11 and user_name=@userName");
//       sql.params().set("userName",userName);
//       sql.setCallback(Sqls.callback.integer());
//       dao.execute(sql);
//       sql.getInt();
//        map.put("totalAmount",orderAmount+sql.getInt());
        map.put("orderAmount", 0);
        map.put("totalAmount", 0);
        map.put("expend", 0);
        return new ModelAndView("aquaculture/financialServices/financialServices", "data", map);
    }

    /**
     * 鱼资商城页面跳转
     *
     * @return
     */
    @RequestMapping(value = "toMall")
    public ModelAndView toMall() {
        ConfigBean bean = dao.fetch(ConfigBean.class, Cnd.where("id", "=", 9));
        return new ModelAndView("aquaculture/mall/mall", "url", bean.getRemark());
    }

    /**
     * 系统设置页面跳转
     *
     * @return
     */
    @RequestMapping(value = "toSystemSetting")
    public ModelAndView toSystemSetting() {
        return new ModelAndView("aquaculture/systemSetting/systemSetting");
    }

    /**
     * 系统设置页面跳转(客户演示后可删除)
     *
     * @return
     */
    @RequestMapping(value = "toSystemSettingTwo")
    public ModelAndView toSystemSettingTwo() {
        return new ModelAndView("aquaculture/systemSetting/systemSettingTwo");
    }

    /**
     * 库存管理跳转
     *
     * @return
     */
    @RequestMapping(value = "toAquacultureInventory")
    public ModelAndView toAquacultureInventory() {
        return new ModelAndView("aquaculture/aquacultureInventory/aquacultureInventory");
    }

    /**
     * 销售管理跳转
     *
     * @return
     */
    @RequestMapping(value = "toSalesManagement")
    public ModelAndView toSalesManagement() {
        return new ModelAndView("aquaculture/salesManagement/salesManagement");
    }

    /**
     * 销售管理-商品管理跳转
     *
     * @return
     */
    @RequestMapping(value = "toGoodsManagement")
    public ModelAndView toGoodsManagement() {
        return new ModelAndView("aquaculture/AddMerchandise/AddMerchandise");
    }

    /**
     * 销售管理-订单登记跳转
     *
     * @return
     */
    @RequestMapping(value = "toSellertools")
    public ModelAndView toSellertools() {
        return new ModelAndView("aquaculture/sellertools/sellertools");
    }

    /**
     * 水产品常见疾病名称查询
     *
     * @param speciesId
     * @return
     */
    @RequestMapping(value = "getDiseasesNameListBySpecies", method = RequestMethod.POST)
    @ResponseBody
    public Object getDiseasesNameListBySpecies(
            @RequestParam(value = "speciesId") String speciesId) {

        Map<String, Object> map = new HashMap<>();

        // 白名单过滤器
        FieldFilter ff1 = FieldFilter.create(AquacultureDiseasesBean.class, "^diseasesTypesId|diseasesTypes$");
        List<AquacultureDiseasesBean> beanList = Daos.ext(dao, ff1).query(AquacultureDiseasesBean.class,
                Cnd.where("speciesId", "=", speciesId).and("industryType", "=", "1")
                        .groupBy("diseasesTypes", "diseasesTypesId"));

        JSONArray jsonArray = new JSONArray();
        for (AquacultureDiseasesBean bean : beanList) {
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("diseasesTypes", bean.getDiseasesTypes());
            jsonObject.put("diseasesTypesId", bean.getDiseasesTypesId());

            // 白名单过滤器
            FieldFilter ff2 = FieldFilter.create(
                    AquacultureDiseasesBean.class, "^id|diseasesTypesId|diseasesTypes|diseasesName$");

            List<AquacultureDiseasesBean> diseasesNameList = Daos.ext(dao, ff2).query(AquacultureDiseasesBean.class,
                    Cnd.where("speciesId", "=", speciesId)
                            .and("diseasesTypesId", "=", bean.getDiseasesTypesId()));
            jsonObject.put("childData", diseasesNameList);
            jsonArray.add(jsonObject);
        }
        map.put("data", jsonArray);
        return ResultObject.ok(map);
    }

    /**
     * 疾病详情页面跳转
     *
     * @return
     */
    @RequestMapping(value = "toDiseasesContent")
    public ModelAndView toDiseasesContent(@RequestParam(value = "id") String id) {
        return new ModelAndView("aquaculture/productService/diseasesContent", "id", id);
    }

    /**
     * 自助诊断详情页面跳转
     *
     * @return
     */
    @RequestMapping(value = "toSelfDiagnosisContent")
    public ModelAndView toSelfDiagnosisContent(@RequestParam(value = "id") String id) {
        return new ModelAndView("aquaculture/productService/selfDiagnosisContent", "id", id);
    }

    /**
     * 获取水产疾病详情by Id
     *
     * @param id
     * @return
     */
    @RequestMapping(value = "getDiseasesContentById", method = RequestMethod.POST)
    @ResponseBody
    public Object getDiseasesContentById(
            @RequestParam(value = "id") String id) {
        //登录验证接口
        String account = env.getProperty("yun.zuotoujing.net.account");
        String password = env.getProperty("yun.zuotoujing.net.password");
        HashMap<String, String> map22 = new HashMap<String,String>();
        map22.put("account", account);
        map22.put("passwd", password);
        String s3 = HttpUtilsNew.doPost("http://yun.zuotoujing.net:8088/service-api-v3/wlx/user/03/login", map22);
        String data = JSON.parseObject(s3, HashMap.class).get("data").toString();
        String at = JSON.parseObject(data, HashMap.class).get("at").toString();
        String guid = JSON.parseObject(data, HashMap.class).get("guid").toString();
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");//格式化对象
        Date date1 = new Date() ;
        Date date = new Date(date1.getTime() - 240*30*1000) ;
        String dateaa = format.format(date).toString();

        String s4 = HttpUtilsNew.doGet("http://yun.zuotoujing.net:8088/service-api-v3/wlx/gatewayDev/03/viewHisCommon?guid="+guid+"&at="+at+"&devId="+id+"&startTime="+dateaa+"%2000%3A00%3A00");
        Map<String, Object> map = new HashMap<>();
        AquacultureDiseasesBean bean = new AquacultureDiseasesBean();
        bean.setDiseasesTypes(id);

        String datas = JSON.parseObject(s4, HashMap.class).get("data").toString();
        String datas1 = JSON.parseObject(datas, HashMap.class).get("reportData").toString();
        List<Object> list =JSON.parseArray(datas1);
        int i = 1 ;
        String a = "";
        for (Object object : list){
            Map<String,Object> ret = (Map<String, Object>) object;//取出list里面的值转为map
            Object locname = ret.get("locname");
            Object time = ret.get("time");
            String deviceReportList = ret.get("deviceReportList")+"";
            List<Object> list11 =JSON.parseArray(deviceReportList);
            a += "日期："+time +"  地址：" +  locname +"  温度："+list11.get(6) + "℃    湿度："+list11.get(10)+"%RH <br><br>";
            i+=1;
            if(i==10){
                break;
            }
        }

        bean.setDiseasesContent(a);
        map.put("data", bean);
        return ResultObject.ok(map);
    }

    /**
     * 获取水产疾病详情by Id for 移动端
     * @return
     */
    @RequestMapping(value = "getDiseasesContentByIdForMobile")
    public ModelAndView getDiseasesContentByIdForMobile(@RequestParam(value = "id") String id) {
        AquacultureDiseasesBean bean = dao.fetch(AquacultureDiseasesBean.class, Cnd.where("id", "=", id));
        return new ModelAndView("aquaculture/productService/diseasesContentForMobile", "bean", bean);
    }


    /**
     * 获取行业新闻list by 行业id
     *
     * @return
     */
    @RequestMapping(value = "getIndustryNewsListByIndustryType", method = RequestMethod.POST)
    @ResponseBody
    public Object getIndustryNewsListByIndustryType(String industryType) {
        Map<String, Object> map = new HashMap<>();
        FieldFilter ff = FieldFilter.create(IndustryNewsBean.class, "^id|newsTitle|newsType|createTime|imgUrl");
        List<IndustryNewsBean> list = Daos.ext(dao, ff).query(IndustryNewsBean.class,
                Cnd.where("industry_type", "=", industryType).and("delete_flag", "=", "0"));

        JSONArray jsonArray = new JSONArray();
        for (IndustryNewsBean bean : list) {
            JSONObject obj = new JSONObject();
            obj.put("id", bean.getId());
            obj.put("newsTitle", bean.getNewsTitle());
            obj.put("newsType", bean.getNewsType());
            obj.put("createTime", new SimpleDateFormat("yyyy-MM-dd").format(bean.getCreateTime()));
            obj.put("imgUrl", bean.getImgUrl());
            jsonArray.add(obj);
        }
        map.put("data", jsonArray);
        return ResultObject.ok(map);
    }

    /**
     * 获取新闻详情by Id
     *
     * @param id
     * @return
     */
    @RequestMapping(value = "getIndustryNewsContentById", method = RequestMethod.POST)
    @ResponseBody
    public Object getIndustryNewsContentById(
            @RequestParam(value = "id") String id) {
        Map<String, Object> map = new HashMap<>();
        IndustryNewsBean bean = dao.fetch(IndustryNewsBean.class, Cnd.where("id", "=", id));
        map.put("data", bean);
        return ResultObject.ok(map);
    }

    /**
     * 获取自助诊断的品类by species_id
     *
     * @param id
     * @return
     */
    @RequestMapping(value = "getSelfDiagnosisBySpeciesId", method = RequestMethod.POST)
    @ResponseBody
    public Object getSelfDiagnosisBySpeciesId(
            @RequestParam(value = "id") String id) {
        Map<String, Object> map = new HashMap<>();
        // 白名单过滤器
        FieldFilter ff1 = FieldFilter.create(AquacultureSelfDiagnosisBean.class, "^theWaterQualityId|theWaterQuality");
        List<AquacultureSelfDiagnosisBean> list = Daos.ext(dao, ff1).query(AquacultureSelfDiagnosisBean.class,
                Cnd.where("speciesId", "=", id).groupBy("theWaterQualityId", "theWaterQuality"));
        JSONArray jsonArray = new JSONArray();
        list.forEach(l -> {
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("theWaterQualityId", l.getTheWaterQualityId());
            jsonObject.put("theWaterQuality", l.getTheWaterQuality());

            List<AquacultureSelfDiagnosisBean> childList = dao.query(AquacultureSelfDiagnosisBean.class,
                    Cnd.where("speciesId", "=", id).and("theWaterQualityId", "=", l.getTheWaterQualityId()));
            jsonObject.put("childList", childList);
            jsonArray.add(jsonObject);
        });
        map.put("data", jsonArray);
        return ResultObject.ok(map);
    }

    /**
     * 获取自助诊断-症状
     *
     * @param id
     * @return
     */
    @RequestMapping(value = "getMinistriesByVarietiesId", method = RequestMethod.POST)
    @ResponseBody
    public Object getMinistriesByVarietiesId(
            @RequestParam(value = "id") String id) {
        Map<String, Object> map = new HashMap<>();
        List<AquacultureSelfDiagnosisMinistriesBean> list = dao.query(AquacultureSelfDiagnosisMinistriesBean.class, Cnd.where("self_diagnosis_id", "=", id));
        JSONArray jsonArray = new JSONArray();
        list.forEach(l -> {
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("self_diagnosis_id", l.getSelfDiagnosisId());
            jsonObject.put("ministries", l.getMinistries());
            jsonObject.put("ministriesId", l.getMinistriesId());
            List<AquacultureSelfDiagnosisPortrayalBean> PortrayalList = dao.query(AquacultureSelfDiagnosisPortrayalBean.class,
                    Cnd.where("self_diagnosis_id", "=", id).and("ministries_id", "=", l.getMinistriesId()));
            jsonObject.put("childList", PortrayalList);
            jsonArray.add(jsonObject);
        });
        map.put("data", jsonArray);
        return ResultObject.ok(map);
    }

    /**
     * 获取自助诊断-症状 by varieties_id
     *
     * @param data
     * @return
     */
    @RequestMapping(value = "getDiagnosis", method = RequestMethod.POST)
    @ResponseBody
    public Object getPortrayalByVarietiesId(
            @RequestParam(value = "data") String data) {
        Map<String, Object> map = new HashMap<>();
        try {

            CloseableHttpClient client = null;
            CloseableHttpResponse response = null;
            try {
                ObjectMapper objectMapper = new ObjectMapper();

                JSONObject dataObj = JSONObject.parseObject(data);
                HttpPost httpPost = new HttpPost("http://webapi.szjoin.net:8891/api/SelfFishResult/Gets");
                httpPost.setHeader(HTTP.CONTENT_TYPE, "application/json");
                httpPost.setEntity(new StringEntity(objectMapper.writeValueAsString(dataObj),
                        ContentType.create("text/json", "UTF-8")));

                client = HttpClients.createDefault();
                response = client.execute(httpPost);
                HttpEntity entity = response.getEntity();
                String result = EntityUtils.toString(entity);
                JSONArray jsonArray = JSONArray.parseArray(result);
                map.put("jsonArray", jsonArray);
            } finally {
                if (response != null) {
                    response.close();
                }
                if (client != null) {
                    client.close();
                }
            }
        } catch (Exception e) {

        }
        return ResultObject.ok(map);
    }

    /**
     * 获取自助诊断反馈的疾病详情
     *
     * @param id
     * @return
     */
    @RequestMapping(value = "selfFishResultShowDetail", method = RequestMethod.POST)
    @ResponseBody
    public Object selfFishResultShowDetail(
            @RequestParam(value = "id") String id) {
        Map<String, Object> map = new HashMap<>();
        try {

            CloseableHttpClient client = null;
            CloseableHttpResponse response = null;
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                Map<String, Object> data = new HashMap<>();
                data.put("PageIndex", "1");
                data.put("PageSize", "100");
                Map<String, Object> childMap = new HashMap<>();
                childMap.put("IllnessID", id);
                data.put("Entity", childMap);

                HttpPost httpPost = new HttpPost("http://webapi.szjoin.net:8891/api/SelfFishIllnesses/Get");
                httpPost.setHeader(HTTP.CONTENT_TYPE, "application/json");
                httpPost.setEntity(new StringEntity(objectMapper.writeValueAsString(data),
                        ContentType.create("text/json", "UTF-8")));

                client = HttpClients.createDefault();
                response = client.execute(httpPost);
                HttpEntity entity = response.getEntity();
                String result = EntityUtils.toString(entity);
                JSONObject jobj = JSONObject.parseObject(result);
                map.put("data", jobj);
            } finally {
                if (response != null) {
                    response.close();
                }
                if (client != null) {
                    client.close();
                }
            }
        } catch (Exception e) {

        }
        return ResultObject.ok(map);
    }

    /**
     * 获取水产大屏设备列表
     *
     * @param page
     * @param size
     * @return
     */
    @RequestMapping("/getDeviceList")
    @ResponseBody
    public ReturnObject getDeviceList(
            @RequestParam(value = "page", required = false, defaultValue = "1") int page,
            @RequestParam(value = "size", required = false, defaultValue = "100") int size) {
        ReturnObject result = new ReturnObject();
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        Pager pager = dao.createPager(page, size);
//        List<UserDeviceBean> data = dao.query(UserDeviceBean.class,
//                Cnd.where("is_del", "=", "0").and("user_name", "=", userName), pager);
        List<DeviceBean> list = productionManageService.getUserPondDeviceList(page, size, userName, null, null, "0","");
        result.setData(list);
        result.setLast(list.size() < size);
        result.setSuccess(true);
        return result;
    }

    @RequestMapping("/getSellMenu")
    @ResponseBody
    public ResultObject getSellMenu() {
        ConfigBean bean = dao.fetch(ConfigBean.class, Cnd.where("id", "=", 9));
        List<Map<String, String>> result = new ArrayList<>();
        Map map = new HashMap<String, String>();
        map.put("name", "商品管理");
        if (bean != null) {
            map.put("src", bean.getRemark() + "/goodsManage/APPCommodityManagement");
        } else {
            map.put("src", "http://localhost:8089/goodsManage/APPCommodityManagement");
        }
        result.add(map);
        Map map2 = new HashMap<String, String>();
        map2.put("name", "订单管理");
        if (bean != null) {
            map2.put("src", bean.getRemark() + "/goodsManage/APPtoSellertools");
        } else {
            map2.put("src", "http://localhost:8089/goodsManage/APPtoSellertools");
        }
        result.add(map2);
        return ResultObject.ok().data(result);
    }

    @RequestMapping("/getSensorCodeByName")
    @ResponseBody
    public ResultObject getSensorCodeByName(String sensorName, String deviceNumber) {
        SensorTemplateBean bean = dao.fetch(SensorTemplateBean.class,
                Cnd.where("sensor_ncode", "=", deviceNumber).and("sensor_name", "=", sensorName));
        if (bean != null) {
            return ResultObject.ok(bean);
        } else {
            return ResultObject.apiError("fail");
        }
    }

    /**
     * 动物养殖大屏
     *
     * @return
     */
    @RequestMapping(value = "toAnimalScreen")
    public ModelAndView toAnimalScreen(HttpServletRequest request) {
        return new ModelAndView("monitor/animalScreen");
    }

}
