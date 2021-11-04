package com.jxctdzkj.cloudplatform.service;

import com.jxctdzkj.cloudplatform.utils.ResultObject;

public interface CropCategoryService {

    /**
     * 根据农物大类别ID查询该类别下所有小类别信息
     * @param categoryId
     * @param type 小类别名字
     * @return
     * @User 李英豪
     */
    ResultObject findCropCategoryList(long categoryId,String type)throws RuntimeException;

    /**
     * 根据农物小类别ID删除该小类别
     * @param id
     * @return
     * @User 李英豪
     */
    ResultObject delCropCategory(long id)throws RuntimeException;

    /**
     * 农作物小类别添加
     * @param categoryName  大作物类别名称
     * @param categoryId    大作物ID
     * @param type          小作物名称
     * @return
     * @User 李英豪
     */
    ResultObject addCropCategory(String categoryName,long categoryId,String type)throws RuntimeException;
}
