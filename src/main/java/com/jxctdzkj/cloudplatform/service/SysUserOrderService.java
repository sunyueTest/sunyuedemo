package com.jxctdzkj.cloudplatform.service;

import com.jxctdzkj.cloudplatform.bean.SysUserOrderBean;
import com.jxctdzkj.cloudplatform.utils.ResultObject;

public interface SysUserOrderService {

    /**
     * 农户申请预约专家
     * order：专家ID，预约标题，预约详情，预约时间
     * @User 李英豪
     */
    ResultObject savaOrder(SysUserOrderBean order) throws RuntimeException;

    /**
     * 查询预约列表
     * @User 李英豪
     */
    ResultObject findorder(int page,int size) throws RuntimeException;

    /**
     * 根据预约ID查询预约详情
     * @user 李英豪
     */
    ResultObject findorderDetails(long id) throws RuntimeException;

    /**
     * 根据预约ID取消预约
     * @user 李英豪
     */
    ResultObject updateOrder(long id,int isOrder,String orderReply) throws RuntimeException;

    /**
     * 专家查询自己的被预约列表
     * @User 李英豪
     */
    ResultObject findExpertOrderList(int page, int size) throws RuntimeException;

    /**
     * 专家查询自己的未接收被预约个数
     *
     * @User 李英豪
     */
    ResultObject findNotAcceptedOrderList() throws RuntimeException;
}
