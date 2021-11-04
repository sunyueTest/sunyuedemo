package com.jxctdzkj.cloudplatform.controller;

import com.jxctdzkj.cloudplatform.bean.FarmInfoBean;
import com.jxctdzkj.cloudplatform.bean.LandUseBean;
import com.jxctdzkj.cloudplatform.service.impl.SmartAgricultureServiceImpl;
import com.jxctdzkj.cloudplatform.utils.ControllerHelper;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import com.jxctdzkj.cloudplatform.utils.Utils;
import lombok.extern.slf4j.Slf4j;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.util.ArrayList;
import java.util.HashMap;

@Controller
@Slf4j
@RequestMapping("smartAgriculture")
public class SmartAgricultureController {
    @Autowired
    Dao dao;

    @Autowired
    private SmartAgricultureServiceImpl smartAgricultureService;


    //跳转到土地使用界面
    @RequestMapping("/toLandUse")
    public ModelAndView toLandUse(Integer farmId) {
        //时间间隔默认是5年
        int currentYear = Utils.getCurrentYear();
        HashMap map = new HashMap();
        ArrayList<Integer> yearList = new ArrayList<>();
        for (int i = 0; i < 5; i++) {
            yearList.add(currentYear--);
        }
        map.put("years", yearList);
        map.put("farmId", farmId);
        //获取当前年份数据
        LandUseBean currentYearLandUseBean = dao.fetch(LandUseBean.class, Cnd.where("farm_id", "=", farmId).orderBy("year","desc"));
        if (currentYearLandUseBean == null) {
            map.put("bean", new LandUseBean());
        } else {
            map.put("bean", currentYearLandUseBean);
        }
        return new ModelAndView("smartAgriculture/landUse", "data", map);
    }

    /**
     * 根据农场ID查询查询农场土地使用情况
     * @param farmId
     * @return
     * @User 李英豪
     */
    @RequestMapping("/findLandUse")
    @ResponseBody
    public ResultObject findLandUse(Integer farmId) {
        try {
        ResultObject result=smartAgricultureService.findLandUse(farmId);
        return result;
        } catch (RuntimeException e) {
            return ResultObject.apiError("err101");
        }
    }

    @RequestMapping("getLandUseByYear")
    @ResponseBody
    public ResultObject getLandUseByYear(Integer year, Integer farmId) {
        LandUseBean landUseBean = null;
        try {
            landUseBean = dao.fetch(LandUseBean.class, Cnd.where("year", "=", year).and("farm_id", "=", farmId));
            landUseBean = landUseBean == null ? new LandUseBean() : landUseBean;
        } catch (Exception e) {
            return ResultObject.apiError("err119");
        }
        return ResultObject.ok(landUseBean);
    }

    @RequestMapping("saveLandUse")
    @ResponseBody
    public ResultObject saveOrUpdateLandUse(LandUseBean bean) {
        return smartAgricultureService.saveOrUpdateLandUse(bean);
    }

//    @RequestMapping("del")
//    @ResponseBody
//    public ResultObject del(Integer id) {
//        return smartAgricultureService.del(id);
//    }

    @RequestMapping("getLandStatisticsInformation")
    @ResponseBody
    public ResultObject getLandStatisticsInformation() {
        String userName = ControllerHelper.getLoginUserName();
        return smartAgricultureService.getLandStatisticsInformation(userName);
    }



    @RequestMapping("/getAllAlarms")
    @ResponseBody
    public ResultObject getAllAlarms() {
        return smartAgricultureService.getAllAlarms();
    }

    @RequestMapping("getDeviceNumberByFarmId")
    @ResponseBody
    public ResultObject getDeviceNumberByFarmId(String farmId) {
        return smartAgricultureService.getDeviceNumberByFarmId(farmId);
    }

    @RequestMapping("getRelayNumberByFarmId")
    @ResponseBody
    public ResultObject getRelayNumberByFarmId(String farmId) {
        try {
            FarmInfoBean farmInfoBean = dao.fetch(FarmInfoBean.class, farmId);
            if (farmInfoBean != null) {
                return  ResultObject.ok().data(farmInfoBean.getRelayNumber());
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResultObject.apiError("error17");
        }
        return  ResultObject.ok().data(0);

    }

}
