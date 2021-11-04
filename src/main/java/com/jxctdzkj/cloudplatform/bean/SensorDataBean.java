//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by Fernflower decompiler)
//

package com.jxctdzkj.cloudplatform.bean;


import org.nutz.dao.entity.annotation.ColDefine;
import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Index;
import org.nutz.dao.entity.annotation.Table;
import org.nutz.dao.entity.annotation.TableIndexes;

import java.sql.Timestamp;


@Table("sensor_data${cid}")
@TableIndexes({@Index(name = "record_time", fields = {"recordTime"}, unique = false),
        @Index(name = "sensor_code", fields = {"sensorCode"}, unique = false)})
public class SensorDataBean extends DBVO {
    @Column("sensor_id")
    private long sensorId;
    @Column("sensor_value")
    @ColDefine(customType = "DECIMAL(10,2)")
    private Double sensorValue;
    @Column("sensor_valuetwo")
    @ColDefine(customType = "DECIMAL(10,2)")
    private Double sensorValuetwo;
    @Column("sensor_code")
    private String sensorCode;
    @Column("sensor_data")
    private String sensorData;
    @Column("record_time")
    private Timestamp recordTime;

    String name;
    String unit;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public long getSensorId() {
        return sensorId;
    }

    public void setSensorId(long sensorId) {
        this.sensorId = sensorId;
    }

    public Double getSensorValue() {
        return sensorValue;
    }

    public void setSensorValue(Double sensorValue) {
        this.sensorValue = sensorValue;
    }

    public Double getSensorValuetwo() {
        return sensorValuetwo;
    }

    public void setSensorValuetwo(Double sensorValuetwo) {
        this.sensorValuetwo = sensorValuetwo;
    }

    public String getSensorCode() {
        return sensorCode;
    }

    public void setSensorCode(String sensorCode) {
        this.sensorCode = sensorCode;
    }

    public String getSensorData() {
        return sensorData;
    }

    public void setSensorData(String sensorData) {
        this.sensorData = sensorData;
    }

    public Timestamp getRecordTime() {
        return recordTime;
    }

    public void setRecordTime(Timestamp recordTime) {
        this.recordTime = recordTime;
    }

    @Override
    public String toString() {
        return "SensorDataBean{" +
                "sensorId=" + sensorId +
                "id=" + id +
                ", sensorValue=" + sensorValue +
                ", sensorValuetwo=" + sensorValuetwo +
                ", sensorCode='" + sensorCode + '\'' +
                ", sensorData='" + sensorData + '\'' +
                ", recordTime=" + recordTime +
                '}';
    }
}
