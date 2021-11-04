package com.jxctdzkj.cloudplatform.service.impl;

import com.jxctdzkj.cloudplatform.bean.*;
import com.jxctdzkj.cloudplatform.service.GroupManageService;
import com.jxctdzkj.cloudplatform.utils.ReturnObject;
import com.jxctdzkj.cloudplatform.utils.SplitTableHelper;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.dao.Sqls;
import org.nutz.dao.sql.Sql;
import org.nutz.dao.util.cri.Static;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

@Service
public class GroupManageServiceImpl implements GroupManageService {

    @Autowired
    Dao dao;

    @Override
    public List<UserGroupBean> getGroupList(String userName) {
        return dao.query(UserGroupBean.class, Cnd.where("user_name", "=", userName).and("is_del","=","0"));
    }

    @Override
    public List<UserDeviceBean> getGroupDeviceList(String userName) {
        return dao.query(UserDeviceBean.class, Cnd.where("user_name", "=", userName).and("is_del", "=", "0"));
    }

    @Override
    public UserGroupBean getGroupById(Integer id) {
        return dao.fetch(UserGroupBean.class, id);
    }

    @Override
    public UserDeviceBean getGroupDeviceById(Integer id) {
        return dao.fetch(UserDeviceBean.class, id);
    }

    @Override
    public void saveGroup(UserGroupBean groupBean) {
        dao.insert(groupBean);
    }

    @Override
    public void updateGroup(UserGroupBean groupBean) {
        dao.update(groupBean);
    }

    @Override
    public void saveGroupDevice(UserDeviceBean deviceBean) {

        dao.insert(deviceBean);
    }

    @Override
    public void updateGroupDevice(UserDeviceBean deviceBean) {

        dao.update(deviceBean);
    }

    @Override
    public void deleteGroupDevice(UserDeviceBean deviceBean) {
        dao.delete(deviceBean);
    }

    @Override
    public void deleteGroup(UserGroupBean groupBean) {


        dao.delete(groupBean);
    }

    @Override
    public List<UserGroupBean> getRootList(String userName) {
        return dao.query(UserGroupBean.class, Cnd.where("user_name", "=", userName).and("parent_id", "=", -1));
    }

    @Override
    public List<NetDevicedata> getSensorData(String dcode) {
        Timestamp endTime = new Timestamp(System.currentTimeMillis());
        Timestamp startTime = new Timestamp(System.currentTimeMillis() - 1000 * 60 * 60 * 2);//2小时前
        Cnd cnd = (Cnd) Cnd.where("Drecord_time", ">", startTime).and("Dcode", "=", dcode).orderBy("did", "desc");//.and(new Static("1=1 order by Drecord_time desc"))
        return SplitTableHelper.queryForDate(NetDevicedata.class, cnd, startTime, endTime, 1, 24);
    }

    @Override
    public List<String> getSensorType(String deviceNumber) {
        Sql sql = Sqls.create(" SELECT concat(m.code,'-',m.name) FROM (SELECT a.sensor_name name ,REPLACE(a.sensor_code,a.sensor_ncode,'') code FROM sensor a where a.sensor_ncode=@ncode) m ");
        sql.setCallback(Sqls.callback.strList());
        sql.setEntity(dao.getEntity(SensorTypeBean.class));
        sql.params().set("ncode", deviceNumber);
        dao.execute(sql);
        return (List<String>) sql.getResult();
    }

    @Override
    public List<String> getSensorTypeId(String deviceNumber) {
        Sql sql = Sqls.create(" SELECT a.id FROM sensor s LEFT JOIN sensor_type a ON s.sensor_type = a.id WHERE s.sensor_ncode=@ncode");
        sql.setCallback(Sqls.callback.strList());
        sql.setEntity(dao.getEntity(SensorTypeBean.class));
        sql.params().set("ncode", deviceNumber);
        dao.execute(sql);
        return (List<String>) sql.getResult();
    }

    @Override
    public DeviceBean getDeviceData(String deviceNumber) {
        return dao.fetch(DeviceBean.class, Cnd.where("ncode", "=", deviceNumber));
    }

    @Override
    public void updatePid(int id, int pId) {
        Sql sql = Sqls.create(" update sys_user_to_group set parent_id = @pId where id =@id ");
        sql.params().set("id", id);
        sql.params().set("pId", pId);
        dao.execute(sql);

    }

    @Override
    public List<NetDevicedata> getSensorDataByDayCount(String dcode, int dayCount) {
        List<NetDevicedata> returnList = new ArrayList<>();
        Timestamp endTime = new Timestamp(System.currentTimeMillis());
        Calendar c;
        for (int i = dayCount; i > 0; i--) {
            c = Calendar.getInstance();
            c.add(Calendar.DAY_OF_MONTH, -i - 1);

            Timestamp startTime = new Timestamp(c.getTimeInMillis());
            Cnd cnd = Cnd.where("Drecord_time", ">", startTime).and("Dcode", "=", dcode).and(new Static("1=1 order by Drecord_time"));
            List<NetDevicedata> list = SplitTableHelper.queryForDate(NetDevicedata.class, cnd, startTime, endTime, 1, 1);
            if (list.size() > 0) {
                returnList.add(list.get(0));
            }
        }
        return returnList;
    }

    @Override
    public List<UserDeviceBean> getDeviceListByGroupId(Long groupId) {
        return dao.query(UserDeviceBean.class, Cnd.where("group_id", "=", groupId).and("is_del", "=", "0"));
    }

    /**
     * 根据传入的分组ID查询该分组下是否存在子分组或设备,存在不允许删除
     *
     * @param id
     * @return 字符串:删除成功/删除失败,先删除当前分组下的子分组与设备
     * @throws RuntimeException
     * @User 李英豪
     */
    @Override
    public String getGroupDevice(Integer id) throws RuntimeException {
        String msg = "";
        ReturnObject result = new ReturnObject();
        result.setSuccess(false);
        //查询当前分组下是否有子分组
        List<UserGroupBean> groupList = dao.query(UserGroupBean.class, Cnd.where("parent_id", "=", id));
        //查询当前分组下是否存在设备(无用户与设备imp只能写在这里)
        List<UserDeviceBean> deviceList = dao.query(UserDeviceBean.class, Cnd.where("group_id", "=", id).and("is_del", "=", 0));
        //当前分组下有子分组或设备拒绝删除
        if (groupList.size() > 0 || deviceList.size() > 0) {
            msg = "warn59";
        } else {//
            UserGroupBean bean = new UserGroupBean();
            bean.setId(id);
            deleteGroup(bean);
            msg = "warn58";
        }
        return msg;
    }

}
