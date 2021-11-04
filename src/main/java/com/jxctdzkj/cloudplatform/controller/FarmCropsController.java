package com.jxctdzkj.cloudplatform.controller;

import com.jxctdzkj.cloudplatform.bean.FarmCropsBean;
import com.jxctdzkj.cloudplatform.config.Constant;
import com.jxctdzkj.cloudplatform.opLog.EnableOpLog;
import com.jxctdzkj.cloudplatform.service.FarmCropsService;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import lombok.extern.slf4j.Slf4j;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

/**
 * 注意！！！！
 * 旧版农场管理和新版大棚管理都使用到了该接口
 * 修改时请注意测试兼容性
 * 禁止删除接口
 */
@Controller
@Slf4j
@RequestMapping({"farmCrops"})
public class FarmCropsController {

    @Autowired
    Dao dao;

    @Autowired
    FarmCropsService farmCropsService;

    // 页面跳转
    @RequestMapping(value = "toList")
    public ModelAndView toList(){
        return new ModelAndView("farmCrops/list");
    }
    // 页面跳转---花房植物
    @RequestMapping(value = "toListBotany")
    public ModelAndView toListBotany(){
        return new ModelAndView("farmCrops/list").addObject("type","0");
    }
    // 页面跳转---花房动物
    @RequestMapping(value = "toListAnimal")
    public ModelAndView toListAnimal(){
        return new ModelAndView("farmCrops/list").addObject("type","1");
    }
    // 新增-跳转
    @RequestMapping(value = "toAdd")
    public ModelAndView toAdd(String type){
        return new ModelAndView("farmCrops/addOrUpdate", "bean", new FarmCropsBean()).addObject("type",type);
    }

    // 修改-跳转
    @RequestMapping(value = "toUpdate")
    public ModelAndView toUpdate(String id,String type){
        FarmCropsBean bean = dao.fetch(FarmCropsBean.class, Cnd.where("id", "=", id));
        return new ModelAndView("farmCrops/addOrUpdate", "bean", bean).addObject("type",type);
    }

    // 新增或修改
    @RequestMapping(value = "/save")
    @ResponseBody
    @EnableOpLog(Constant.ModifyType.SAVE)
    public ResultObject save(FarmCropsBean bean, String plantingDateStr, String harvestDateStr){
        try {
            return farmCropsService.save(bean, plantingDateStr, harvestDateStr);
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResultObject.apiError("fail");
        }
    }

    // 获取列表
    @RequestMapping(value = "/getList")
    @ResponseBody
    public ResultObject getList(@RequestParam(value = "page", required = false, defaultValue = "1") int page,
                                @RequestParam(value = "size", required = false, defaultValue = "100") int size,
                                String cropsName, String farmInfoId,
                                @RequestParam(value = "userName", required = false, defaultValue = "") String userName){
        try {
            return farmCropsService.getFarmCropsList(page, size, cropsName, farmInfoId,userName);
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResultObject.apiError("fail");
        }
    }

    //

    /**
     * 新版获取农作物增加type,农作物类别，植物0，动物1
     * 花房获取动、植物列表
     * @param page
     * @param size
     * @param cropsName 名称
     * @param farmInfoId 农场、花房ID
     * @param type 动物还是植物类型分类
     * @User 李英豪
     */
    @RequestMapping(value = "/getListTwo")
    @ResponseBody
    public ResultObject getListTwo(int page, int size, String cropsName, String farmInfoId,String type){
        try {
            return farmCropsService.getFarmCropsListTwo(page, size, cropsName, farmInfoId,type);
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
            return farmCropsService.del(id);
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResultObject.apiError("fail");
        }
    }

    /**
     * 查询花房植物/动物个数，按名称统计
     * @param farmId 花房ID
     * @param type 类型 植物：0，动物：1
     * @return
     * @User 李英豪
     */
    @RequestMapping("findFarmCount")
    @ResponseBody
    public ResultObject findFarmCount(String farmId,String type){

        try {
            ResultObject result=farmCropsService.findFarmCount(farmId,type);
            return result;
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResultObject.apiError("fail");
        }

    }

}
