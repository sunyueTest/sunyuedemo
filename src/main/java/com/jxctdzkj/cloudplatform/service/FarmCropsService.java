package com.jxctdzkj.cloudplatform.service;

import com.jxctdzkj.cloudplatform.bean.FarmCropsBean;
import com.jxctdzkj.cloudplatform.utils.ResultObject;

public interface FarmCropsService {

    ResultObject save(FarmCropsBean bean, String plantingDateStr, String harvestDateStr) throws Exception;

    ResultObject getFarmCropsList(int page, int size, String cropsName, String farmInfoId,String userName) throws Exception;
    /**
     * 新版获取农作物增加type,农作物类别，植物0，动物1
     * 花房获取动、植物列表
     * @param page
     * @param size
     * @param cropsName 名称
     * @param farmInfoId 农场、花房ID
     * @param type 动物还是植物类型分类
     * @return
     */
    ResultObject getFarmCropsListTwo(int page, int size, String cropsName, String farmInfoId,String type) throws Exception;

    ResultObject del(String id) throws Exception;
    /**
     * 查询花房植物/动物个数，按名称统计
     * @param farmId 花房ID
     * @param type 类型 植物：0，动物：1
     * @return
     * @User 李英豪
     */
    ResultObject findFarmCount(String farmId,String type) throws RuntimeException;

}
