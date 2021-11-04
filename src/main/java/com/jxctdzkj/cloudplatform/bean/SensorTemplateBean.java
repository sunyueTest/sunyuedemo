package com.jxctdzkj.cloudplatform.bean;

import org.nutz.dao.entity.annotation.*;

import java.sql.Timestamp;

/**
 * <pre>
 *     @author  : FlySand
 *     @e-mail  : 1156183505@qq.com
 *     @time    : 2018/8/29.
 *     @desc    : 传感器数据模板
 * </pre>
 */
@Table("sensor")
public class SensorTemplateBean extends DBVO {

    @Column("xcoordinate")
    private Double latitude;

    @Column("ycoordinate")
    private Double longitude;

    @Column("sensor_id")
    private Integer sensorId;

    @Name
    @Column("sensor_code")
    @Comment("传感器编码")
    private String sensorCode;

    //对应sensor_type id
    @Column("sensor_type")
    private long sensorType;

    @Column("sensor_ncode")
    @Comment("设备号")
    private String sensorNcode;

    @Column("sensor_name")
    @Comment("传感器名称")
    private String sensorName;

    @Column("sensor_data")
    private String sensorData;

    @Column("sensor_valueone")
    @Comment("系数")
    private Double sensorValueone;
    @Column("sensor_valuetwo")
    @Comment("差值")
    private Double sensorValuetwo;

    @Column("record_time")
    private Timestamp recordTime;

    @Column("en_name")
    @Default("")
    private String enName;

    public String getEnName() {
        return enName;
    }

    public void setEnName(String enName) {
        this.enName = enName;
    }

    private Integer state=0;

    public Integer getState() {
        return state;
    }

    public void setState(Integer state) {
        this.state = state;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Integer getSensorId() {
        return sensorId;
    }

    public void setSensorId(Integer sensorId) {
        this.sensorId = sensorId;
    }

    public String getSensorCode() {
        return sensorCode;
    }

    public void setSensorCode(String sensorCode) {
        this.sensorCode = sensorCode;
    }

    public long getSensorType() {
        return sensorType;
    }

    public void setSensorType(long sensorType) {
        this.sensorType = sensorType;
    }

    public String getSensorNcode() {
        return sensorNcode;
    }

    public void setSensorNcode(String sensorNcode) {
        this.sensorNcode = sensorNcode;
    }

    public String getSensorName() {
        return sensorName;
    }

    public void setSensorName(String sensorName) {
        this.sensorName = sensorName;
    }

    public String getSensorData() {
        return sensorData;
    }

    public void setSensorData(String sensorData) {
        this.sensorData = sensorData;
    }

    public Double getSensorValueone() {
        return sensorValueone;
    }

    public void setSensorValueone(Double sensorValueone) {
        this.sensorValueone = sensorValueone;
    }

    public Double getSensorValuetwo() {
        return sensorValuetwo;
    }

    public void setSensorValuetwo(Double sensorValuetwo) {
        this.sensorValuetwo = sensorValuetwo;
    }

    public Timestamp getRecordTime() {
        return recordTime;
    }

    public void setRecordTime(Timestamp recordTime) {
        this.recordTime = recordTime;
    }

    @Override
    public String toString() {
        return "SensorTemplateBean{" +
                "id=" + id +
                "latitude=" + latitude +
                ", longitude=" + longitude +
                ", sensorId=" + sensorId +
                ", sensorCode='" + sensorCode + '\'' +
                ", sensorType=" + sensorType +
                ", sensorNcode='" + sensorNcode + '\'' +
                ", sensorName='" + sensorName + '\'' +
                ", sensorData='" + sensorData + '\'' +
                ", sensorValueone=" + sensorValueone +
                ", sensorValuetwo=" + sensorValuetwo +
                ", recordTime=" + recordTime +
                '}';
    }
}
