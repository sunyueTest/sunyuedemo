//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by Fernflower decompiler)
//

package com.jxctdzkj.cloudplatform.bean;


import com.fasterxml.jackson.annotation.JsonFormat;
import org.nutz.dao.entity.annotation.*;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.List;


@Table("netdevicedata${cid}")
@TableIndexes({@Index(name = "Drecord_time", fields = {"drecordTime"}, unique = false)
        , @Index(name = "Dcode", fields = {"deviceNumber"}, unique = false)})
public class NetDevicedata implements Serializable {
    @Id
    @Column("Did")
    private long id;
    @ColDefine(notNull = true)
    @Column("Dcode")
    private String deviceNumber;
    @Default("")
    @ColDefine(width = 150)
    @Column("Dsensor_data")
    private String sensorData;
    @Column("Drecord_time")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Timestamp drecordTime;
    private int aqi;
    private double longitude;
    private double latitude;
    private List<Integer> type;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getDeviceNumber() {
        return deviceNumber;
    }

    public void setDeviceNumber(String deviceNumber) {
        this.deviceNumber = deviceNumber;
    }

    public String getSensorData() {
        return sensorData;
    }

    public void setSensorData(String sensorData) {
        this.sensorData = sensorData;
    }

    public Timestamp getDrecordTime() {
        return drecordTime;
    }

    public void setDrecordTime(Timestamp drecordTime) {
        this.drecordTime = drecordTime;
    }

    public int getAqi() {
        return aqi;
    }

    public void setAqi(int aqi) {
        this.aqi = aqi;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public List<Integer> getType() {
        return type;
    }

    public void setType(List<Integer> type) {
        this.type = type;
    }

    @Override
    public String toString() {
        return "NetDevicedata{" +
                "id=" + id +
                ", deviceNumber='" + deviceNumber + '\'' +
                ", sensorData='" + sensorData + '\'' +
                ", nrecordTime=" + drecordTime +
                '}';
    }
}
