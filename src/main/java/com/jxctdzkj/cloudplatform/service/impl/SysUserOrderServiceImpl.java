package com.jxctdzkj.cloudplatform.service.impl;

import com.jxctdzkj.cloudplatform.bean.AquacultureExpertsBean;
import com.jxctdzkj.cloudplatform.bean.SysUserBean;
import com.jxctdzkj.cloudplatform.bean.SysUserOrderBean;
import com.jxctdzkj.cloudplatform.service.SysUserOrderService;
import com.jxctdzkj.cloudplatform.utils.ControllerHelper;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.dao.pager.Pager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

/**
 * 用户预约专家
 */
@Slf4j
@Service
public class SysUserOrderServiceImpl implements SysUserOrderService {
    @Autowired
    Dao dao;

    /**
     * 农户申请预约专家
     * order：专家ID，预约标题，预约详情，预约时间
     *
     * @User 李英豪
     */
    @Override
    public ResultObject savaOrder(SysUserOrderBean order) throws RuntimeException {
        SysUserBean userBean = ControllerHelper.getInstance(dao).getLoginUser();
        if (StringUtils.isBlank(userBean.getUserName())) {
            return ResultObject.apiError("err21");
        }
        String expertsName = "";
        //判断是否存在该专家
        if (order.getExpertsId() != null && !"".equals(order.getExpertsId())) {
            AquacultureExpertsBean experts = dao.fetch(AquacultureExpertsBean.class,
                    Cnd.where("id", "=", order.getExpertsId())
                            .and("is_delete", "=", "0")
                            .and("examine", "=", "1"));
            if (experts != null) {
                expertsName = experts.getName();
            } else {
                return ResultObject.apiError("专家不存在");
            }
        } else {
            return ResultObject.apiError("专家不存在");
        }
        order.setOrderUser(userBean.getUserName());
        order.setExpertsName(expertsName);
        order.setOrderName(userBean.getRealName());
        if (dao.insert(order) != null) {
            return ResultObject.ok("申请成功");
        }

        return ResultObject.apiError("申请失败");
    }

    /**
     * 查询预约列表
     *
     * @User 李英豪
     */
    @Override
    public ResultObject findorder(int page, int size) throws RuntimeException {
        SysUserBean userBean = ControllerHelper.getInstance(dao).getLoginUser();
        if (StringUtils.isBlank(userBean.getUserName())) {
            return ResultObject.apiError("err21");
        }
        Pager pager = dao.createPager(page, size);
        List<SysUserOrderBean> orderList = dao.query(SysUserOrderBean.class, Cnd.where("orderUser", "=", userBean.getUserName()).and("is_del", "=", 0).orderBy("order_time", "desc"), pager);
        int count = dao.count(SysUserOrderBean.class, Cnd.where("orderUser", "=", userBean.getUserName()).and("is_del", "=", 0));
        return ResultObject.okList(orderList, page, size, count);
    }

    /**
     * 根据预约ID查询预约详情
     *
     * @user 李英豪
     */
    @Override
    public ResultObject findorderDetails(long id) throws RuntimeException {
        SysUserBean userBean = ControllerHelper.getInstance(dao).getLoginUser();
        if (StringUtils.isBlank(userBean.getUserName())) {
            return ResultObject.apiError("err21");
        }
        SysUserOrderBean order = dao.fetch(SysUserOrderBean.class, Cnd.where("id", "=", id));
        return ResultObject.ok(order);
    }

    /**
     * 根据预约ID修改预约
     *
     * @user 李英豪
     */
    @Override
    public ResultObject updateOrder(long id, int isOrder, String orderReply) throws RuntimeException {
        SysUserBean userBean = ControllerHelper.getInstance(dao).getLoginUser();
        if (StringUtils.isBlank(userBean.getUserName())) {
            return ResultObject.apiError("err21");
        }
        SysUserOrderBean order = dao.fetch(SysUserOrderBean.class, id);
//        order.setIsDel(1);
        order.setIsOrder(isOrder);
        if (StringUtils.isBlank(order.getOrderReply())) {
            order.setOrderReply(orderReply);
        }
        if (dao.update(order) > 0) {
            return ResultObject.ok("success");
        } else {
            return ResultObject.apiError("fail");
        }
    }


    /**
     * 专家查询自己的被预约列表
     *
     * @User 李英豪
     */
    @Override
    public ResultObject findExpertOrderList(int page, int size) throws RuntimeException {
        SysUserBean userBean = ControllerHelper.getInstance(dao).getLoginUser();
        if (StringUtils.isBlank(userBean.getUserName())) {
            return ResultObject.apiError("err21");
        }

        AquacultureExpertsBean aquacultureExpertsBean = dao.fetch(AquacultureExpertsBean.class,
                Cnd.where("create_user", "=", userBean.getUserName())
                        .and("is_delete", "=", "0")
                        .and("examine", "=", "1"));
        if (aquacultureExpertsBean != null) {
            Pager pager = dao.createPager(page, size);
            List<SysUserOrderBean> orderList = dao.query(SysUserOrderBean.class, Cnd.where("experts_id", "=", aquacultureExpertsBean.getId()).orderBy("order_time", "desc"), pager);
            int count = dao.count(SysUserOrderBean.class, Cnd.where("experts_id", "=", aquacultureExpertsBean.getId()));
            return ResultObject.okList(orderList, page, size, count);
        } else {
            return ResultObject.apiError("专家不存在");
        }

    }

    /**
     * 专家查询自己的未接收被预约个数
     *
     * @User 李英豪
     */
    @Override
    public ResultObject findNotAcceptedOrderList() throws RuntimeException {
        SysUserBean userBean = ControllerHelper.getInstance(dao).getLoginUser();
        if (StringUtils.isBlank(userBean.getUserName())) {
            return ResultObject.apiError("err21");
        }
        AquacultureExpertsBean aquacultureExpertsBean = dao.fetch(AquacultureExpertsBean.class,
                Cnd.where("create_user", "=", userBean.getUserName())
                        .and("is_delete", "=", "0")
                        .and("examine", "=", "1"));
        String data="";
        int count=0;
        if(aquacultureExpertsBean!=null){
           count = dao.count(SysUserOrderBean.class,
                    Cnd.where("experts_id", "=", aquacultureExpertsBean.getId())
                            .and("is_order", "=", 0).and("is_del", "=", 0));
            data="您有"+count+"条预约信息待接受";
        }else{
            Calendar now = Calendar.getInstance();
            now.setTime(new Date());
            now.set(Calendar.DATE,now.get(Calendar.DATE)+7);

            count = dao.count(SysUserOrderBean.class,
                    Cnd.where("order_user", "=", userBean.getUserName())
                            .and("is_order", "=", 1)
                            .and("is_del", "=", 0)
                            .and("order_time",">",new Date())
                            .and("order_time","<",now.getTime()));
            data="最近七天内，您有"+count+"条预约待履行";
        }
        List<Object>list=new ArrayList<>();
        list.add(count);
        list.add(data);
        return ResultObject.ok(list);
    }
}
