package com.jxctdzkj.cloudplatform.bean;

import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Table;

import java.util.Date;

@Table("aquaculture_user_sensor")
public class AquacultureUserSensorBean extends DBVO {

    // 所属用户
    @Column("user_name")
    private String userName;

    // 节点名称
    @Column("sensor_name")
    private String sensorName;

    // 节点编号
    @Column("sensor_code")
    private String sensorCode;

    // 设备号
    @Column("n_code")
    private String nCode;

    // 最后更新人
    @Column("last_update_user")
    private String lastUpdateUser;

    // 最后更新时间
    @Column("last_update_time")
    private Date lastUpdateTime;

    public String getSensorCode() {
        return sensorCode;
    }

    public void setSensorCode(String sensorCode) {
        this.sensorCode = sensorCode;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getSensorName() {
        return sensorName;
    }

    public void setSensorName(String sensorName) {
        this.sensorName = sensorName;
    }

    public String getnCode() {
        return nCode;
    }

    public void setnCode(String nCode) {
        this.nCode = nCode;
    }

    public String getLastUpdateUser() {
        return lastUpdateUser;
    }

    public void setLastUpdateUser(String lastUpdateUser) {
        this.lastUpdateUser = lastUpdateUser;
    }

    public Date getLastUpdateTime() {
        return lastUpdateTime;
    }

    public void setLastUpdateTime(Date lastUpdateTime) {
        this.lastUpdateTime = lastUpdateTime;
    }
}
