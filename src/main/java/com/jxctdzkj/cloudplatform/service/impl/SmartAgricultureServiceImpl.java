package com.jxctdzkj.cloudplatform.service.impl;

import com.jxctdzkj.cloudplatform.bean.*;
import com.jxctdzkj.cloudplatform.service.SmartAgricultureService;
import com.jxctdzkj.cloudplatform.utils.ControllerHelper;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.dao.pager.Pager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.LinkedList;
import java.util.List;
import java.util.TreeMap;

@Service
@Slf4j
public class SmartAgricultureServiceImpl implements SmartAgricultureService {

    @Autowired
    Dao dao;

    /**
     * 获取当前用户及其所有下属的农场列表
     *
     * @param page
     * @param size
     * @param farmName
     * @return
     */
    @Override
    public ResultObject getSmartAgricultureList(int page, int size, String farmName) {
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();

        LinkedList<FarmInfoBean> list = new LinkedList<>();


        Cnd cnd = Cnd.where("create_user", "=", userName).and("delete_flag", "=", 0);
        if (StringUtils.isNotBlank(farmName)) {
            cnd = cnd.and("farm_name", "like", "%" + farmName + "%");
        }

        //递归查找所有下级用户创建的农场
        getAllSubFarms(userName, farmName, list);
        //查询当前用户自己创建的所有农场
        List<FarmInfoBean> farmsBuiltSelf = dao.query(FarmInfoBean.class, cnd);

        list.addAll(0, farmsBuiltSelf);


        //进行分页处理
        int count = list.size();
        List<FarmInfoBean> subList;
        if ((page - 1) * size + size < count) {
            subList = list.subList((page - 1) * size, (page - 1) * size + size);
        } else {
            subList = list.subList((page - 1) * size, count);
        }

        for (FarmInfoBean bean : list) {
            System.out.println(bean);
        }
        return ResultObject.okList(subList, page, size, count);
    }

    @Override
    public ResultObject getSmartAgricultureListNoPage(String farmName) {
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        LinkedList<FarmInfoBean> list = new LinkedList<>();
        Cnd cnd = Cnd.where("create_user", "=", userName).and("delete_flag", "=", 0);
        if (StringUtils.isNotBlank(farmName)) {
            cnd = cnd.and("farm_name", "like", "%" + farmName + "%");
        }
        //递归查找所有下级用户创建的地区
        getAllSubFarms(userName, farmName, list);
        //查询当前用户自己创建的所有地区
        List<FarmInfoBean> farmsBuiltSelf = dao.query(FarmInfoBean.class, cnd);

        list.addAll(0, farmsBuiltSelf);
        return  ResultObject.okList(list);
    }


    @Override
    public ResultObject getLandStatisticsInformation(String userName) {
        TreeMap<String, Integer[]> map;
        try {
            map = new TreeMap<>(new Comparator<String>() {
                @Override
                public int compare(String o1, String o2) {
                    return o2.compareTo(o1);
                }
            });
            //递归获取所有下级土地统计信息
            getLandStatisticsInformation(userName, map);

            //获取当前用户自己创建的土地信息
            List<LandUseBean> list = dao.query(LandUseBean.class, Cnd.where("create_user", "=", userName));
            wrapMap(map, list);

        } catch (Exception e) {
            return ResultObject.apiError("err122");
        }

        return ResultObject.ok(map);
    }

    @Override
    public ResultObject saveOrUpdateLandUse(LandUseBean bean) {
        SysUserBean userBean = ControllerHelper.getInstance(dao).getLoginUser();
        String userName = userBean.getUserName();
        try {
            if (bean.getId() == 0) {//新增人员结构信息
                //只有一级用户可以新建下级信息，否则无权新建其他人拥有的资源的任何附属信息
                FarmInfoBean farmBean = dao.fetch(FarmInfoBean.class, bean.getFarmId());
//                SmartAgricultureBean
                if (farmBean != null && userBean.getLevel() > 1 && !farmBean.getCreateUser().equals(userName)) {
                    return ResultObject.apiError("err121");
                }

                //记录的创建者信息必须设置为农场的直接所属用户
                bean.setCreateUser(farmBean.getCreateUser());
                dao.insert(bean);
            } else {
                //只有一级用户可以修改下级信息，否则无权修改其他人创建的信息
                LandUseBean oldBean = dao.fetch(LandUseBean.class, bean.getId());
                if (oldBean != null && userBean.getLevel() > 1 && !userName.equals(oldBean.getCreateUser())) {
                    return ResultObject.apiError("err120");
                }
                bean.setCreateUser(oldBean.getCreateUser());
                dao.update(bean);
            }
        } catch (Exception e) {
            return ResultObject.apiError("fail");
        }
        return ResultObject.ok();
    }


    /**
     * 根据农场ID查询查询农场土地使用情况
     *
     * @param farmId
     * @return
     * @User 李英豪
     */
    @Override
    public ResultObject findLandUse(Integer farmId) throws RuntimeException {
        List<LandUseBean>list=dao.query (LandUseBean.class, Cnd.where("farm_id", "=", farmId).orderBy("year", "asc"));
        if(list!=null&& list.size() > 0){
           return ResultObject.ok(list);
        }
        return ResultObject.ok();
    }

    public ResultObject getDeviceNumberByFarmId(String farmId) {
        try {
            List<UserDeviceBean> list = dao.query(UserDeviceBean.class, Cnd.where("group_id", "=", farmId).and("is_del", "=", 0).orderBy("id", "asc"));
            if (list != null && list.size() > 0) {
                return ResultObject.ok().data(list.get(0).getDeviceNumber());
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResultObject.apiError("error17");
        }

        return ResultObject.ok().data(0);
    }

    public ResultObject getAllAlarms() {
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();

        LinkedList<TriggerHistoryBean> list = new LinkedList<>();

        List<TriggerHistoryBean> curUserAlarmList = dao.query(TriggerHistoryBean.class,
                Cnd.where("user_name", "=", userName)
                        .and("is_del", "=", "0")
                        .orderBy("alarm_time", "desc"),
                new Pager(1, 10));

        //递归查找所有下级用户创建的农场
        getAllAlarms(userName, list);
        //查询当前用户自己创建的所有农场
        list.addAll(0, curUserAlarmList);

        int count = list.size();
        List<TriggerHistoryBean> subList;
        if (count < 10) {
            subList = list.subList(0, count);
        } else {
            subList = list.subList(0, 10);
        }

        return ResultObject.okList(subList, 1, count, count);
    }

    private void getAllAlarms(String userName, List<TriggerHistoryBean> list) {
        List<SysUserBean> childUserList = dao.query(SysUserBean.class, Cnd.where("parentuser", "=", userName).and("is_del", "=", 0));
        if (childUserList.size() == 0) {
            return;
        }

        for (SysUserBean userBean : childUserList) {
            List<TriggerHistoryBean> tempList = dao.query(TriggerHistoryBean.class,
                    Cnd.where("user_name", "=", userBean.getUserName())
                            .and("is_del", "=", "0")
                            .orderBy("alarm_time", "desc"),
                    new Pager(1, 10));
            list.addAll(tempList);
            getAllAlarms(userBean.getUserName(), list);
        }
    }

    /**
     * 递归获取当前用户级别之下的所有用户创建的农场土地利用信息（不包含当前用户本身）
     * 并将数据存入TreeMap（为了保证按照年份降序，方便前端解析）
     * map结构如下
     * {
     * 2019:[156,156],
     * 2018:[145,69],//数组第一个元素标识耕地面积，第二个元素标识种植面积
     * 2017:[89,78],
     * ...
     * }
     *
     * @param userName
     * @param map
     */
    private void getLandStatisticsInformation(String userName, TreeMap<String, Integer[]> map) {
        List<SysUserBean> childUserList = dao.query(SysUserBean.class, Cnd.where("parentuser", "=", userName).and("is_del", "=", 0));
        if (childUserList.size() == 0) {
            return;
        }

        for (SysUserBean userBean : childUserList) {
            Cnd cnd = Cnd.where("create_user", "=", userBean.getUserName());
            List<LandUseBean> landUseList = dao.query(LandUseBean.class, cnd);
            wrapMap(map, landUseList);

            getLandStatisticsInformation(userBean.getUserName(), map);
        }
    }

    /**
     * 递归获取指定用户级别之下的所有用户创建的农场信息（不包含当前用户本身）
     *
     * @param userName
     * @param farmName
     * @param list
     */
    private void getAllSubFarms(String userName, String farmName, LinkedList<FarmInfoBean> list) {
        List<SysUserBean> childUserList = dao.query(SysUserBean.class, Cnd.where("parentuser", "=", userName).and("is_del", "=", 0));
        if (childUserList.size() == 0) {
            return;
        }

        for (SysUserBean userBean : childUserList) {
            Cnd cnd = Cnd.where("create_user", "=", userBean.getUserName()).and("delete_flag", "=", 0);
            if (farmName != null) {
                cnd = cnd.and("farm_name", "like", "%" + farmName + "%");
            }
            List<FarmInfoBean> farmList = dao.query(FarmInfoBean.class, cnd);
            list.addAll(farmList);
            getAllSubFarms(userBean.getUserName(), farmName, list);
        }
    }

    /**
     * 将list信息封装到map
     *
     * @param map
     * @param landUseList
     */
    private void wrapMap(TreeMap<String, Integer[]> map, List<LandUseBean> landUseList) {
        for (LandUseBean landUse : landUseList) {
            String curYear = landUse.getYear();

            if (map.containsKey(curYear)) {
                Integer[] arr = map.get(curYear);
                arr[0] += landUse.getCultivatedArea();
                arr[1] += landUse.getPlantedArea();
            } else {
                map.put(curYear, new Integer[]{landUse.getCultivatedArea(), landUse.getPlantedArea()});
            }
        }
    }

}
