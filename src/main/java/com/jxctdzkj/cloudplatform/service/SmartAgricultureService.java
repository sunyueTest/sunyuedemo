package com.jxctdzkj.cloudplatform.service;

import com.jxctdzkj.cloudplatform.bean.LandUseBean;
import com.jxctdzkj.cloudplatform.utils.ResultObject;

public interface SmartAgricultureService {

    /**
     * 获取当前用户及其所有下级用户拥有的农场信息
     *
     * @param page
     * @param size
     * @param farmName
     * @return
     */
    ResultObject getSmartAgricultureList(int page, int size, String farmName);


    /**
     * @Author huangwei
     * @Description // 扬尘地区获取 不分页显示
     * @Date  2019/10/9
     * @Param
     * @return
     **/
    ResultObject getSmartAgricultureListNoPage(String farmName);




    /**
     * 获取当前用户及其所有下级用户拥有的农场土地统计信息
     *
     * @param userName
     * @return
     */
    ResultObject getLandStatisticsInformation(String userName);

    ResultObject saveOrUpdateLandUse(LandUseBean bean);

    /**
     * 根据农场ID查询查询农场土地使用情况
     *
     * @param farmId
     * @return
     * @User 李英豪
     */
    ResultObject findLandUse(Integer farmId) throws RuntimeException;

}
