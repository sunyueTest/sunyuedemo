package com.jxctdzkj.cloudplatform.controller;

import com.jxctdzkj.cloudplatform.bean.SysUserOrderBean;
import com.jxctdzkj.cloudplatform.service.SysUserOrderService;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.sql.Timestamp;

/**
 * 用户预约专家
 */
@Controller
@Slf4j
@RequestMapping({"sysUserOrder"})
public class SysUserOrderController {
    @Autowired
    SysUserOrderService sysUserOrderService;

    /**
     * 跳转预约专家页面
     *
     * @param expertsId 专家ID
     * @User 李英豪
     */
    @RequestMapping(value = "toAddOrder")
    public ModelAndView toAddOrder(String expertsId) {
        return new ModelAndView("order/addOrder").addObject("expertsId", expertsId);
    }

    /**
     * 农户申请预约专家
     * order：专家ID，预约标题，预约详情，预约时间
     *
     * @User 李英豪
     */
    @RequestMapping("savaOrder")
    @ResponseBody
    public ResultObject savaOrder(String orderTitle, String orderTime, String orderDetails, String expertsId) {
        ResultObject result;
        try {
            SysUserOrderBean order = new SysUserOrderBean();
            order.setOrderTitle(orderTitle);
            order.setOrderTime(Timestamp.valueOf(orderTime));
            order.setOrderDetails(orderDetails);
            order.setExpertsId(expertsId);
            result = sysUserOrderService.savaOrder(order);
        } catch (Exception e) {
            return ResultObject.apiError("fail");
        }
        return result;
    }

    /**
     * 跳转查询预约列表页面
     *
     * @User 李英豪
     */
    @RequestMapping(value = "findorderList")
    public ModelAndView findorderList() {
        return new ModelAndView("order/findorderList");
    }

    /**
     * 农户查询预约专家的列表
     *
     * @User 李英豪
     */
    @RequestMapping("findorder")
    @ResponseBody
    public ResultObject findorder(@RequestParam(value = "page", required = false, defaultValue = "1") int page,
                                  @RequestParam(value = "size", required = false, defaultValue = "10") int size) {
        ResultObject result;
        try {
            result = sysUserOrderService.findorder(page, size);
        } catch (Exception e) {
            return ResultObject.apiError("fail");
        }
        return result;
    }

    /**
     * 根据预约ID查询预约详情
     *
     * @user 李英豪
     */
    @RequestMapping("findorderDetails")
    @ResponseBody
    public ResultObject findorderDetails(long id) {
        ResultObject result;
        try {
            result = sysUserOrderService.findorderDetails(id);
        } catch (Exception e) {
            return ResultObject.apiError("fail");
        }
        return result;
    }

    /**
     * 根据预约ID取消预约
     *
     * @user 李英豪
     */
    @RequestMapping("updateOrder")
    @ResponseBody
    public ResultObject updateOrder(long id, @RequestParam(value = "isOrder", required = false, defaultValue = "2") int isOrder, @RequestParam(value = "orderReply", required = false, defaultValue = "") String orderReply) {
        ResultObject result;
        try {
            result = sysUserOrderService.updateOrder(id, isOrder, orderReply);
        } catch (Exception e) {
            return ResultObject.apiError("fail");
        }
        return result;
    }


    /**
     * 专家查询自己的被预约列表
     *
     * @User 李英豪
     */
    @RequestMapping("findExpertOrderList")
    @ResponseBody
    public ResultObject findExpertOrderList(@RequestParam(value = "page", required = false, defaultValue = "1") int page,
                                            @RequestParam(value = "size", required = false, defaultValue = "10") int size) {
        ResultObject result;
        try {
            result = sysUserOrderService.findExpertOrderList(page, size);
        } catch (Exception e) {
            return ResultObject.apiError("fail");
        }
        return result;
    }

    /**
     * 专家查询自己的未接收被预约个数
     *
     * @User 李英豪
     */
    @RequestMapping("findNotAcceptedOrderList")
    @ResponseBody
    public ResultObject findNotAcceptedOrderList() {
        ResultObject result;
        try {
            result = sysUserOrderService.findNotAcceptedOrderList();
        } catch (Exception e) {
            return ResultObject.apiError("fail");
        }
        return result;
    }

}
