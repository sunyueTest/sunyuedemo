package com.jxctdzkj.cloudplatform.controller;

import com.jxctdzkj.cloudplatform.service.CropCategoryService;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@Slf4j
@RequestMapping({"cropCategory"})
public class CropCategoryController {
    @Autowired
    CropCategoryService cropCategoryService;

    /**
     * 根据农物大类别ID查询该类别下所有小类别信息
     * @param categoryId
     * @param type 小类别名字
     * @return
     * @User 李英豪
     */
    @RequestMapping("findCropCategoryList")
    @ResponseBody
    public ResultObject findCropCategoryList(long categoryId,String type){
        ResultObject result;
        try {
            result = cropCategoryService.findCropCategoryList(categoryId,type);
        } catch (Exception e) {
            return ResultObject.apiError("fail");
        }
        return result;
    }

    /**
     * 根据农物小类别ID删除该小类别
     * @param id
     * @return
     * @User 李英豪
     */
    @RequestMapping("delCropCategory")
    @ResponseBody
    public ResultObject delCropCategory(long id){
        ResultObject result;
        try {
            result = cropCategoryService.delCropCategory(id);
        } catch (Exception e) {
            return ResultObject.apiError("fail");
        }
        return result;
    }

    /**
     * 农作物小类别添加
     * @param categoryName  大作物类别名称
     * @param categoryId    大作物ID
     * @param type          小作物名称
     * @return
     * @User 李英豪
     */
    @RequestMapping("addCropCategory")
    @ResponseBody
    public ResultObject addCropCategory(String categoryName,long categoryId,String type){
        ResultObject result;
        try {
            result = cropCategoryService.addCropCategory(categoryName,categoryId,type);
        } catch (Exception e) {
            return ResultObject.apiError("fail");
        }
        return result;
    }


}
