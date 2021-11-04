package com.jxctdzkj.cloudplatform.mode;

import java.sql.Timestamp;

/**
 * <pre>
 *     @author  : FlySand
 *     @e-mail  : 1156183505@qq.com
 *     @time    : 2018/11/3.
 *     @desc    :
 * </pre>
 */
public class SenorDataMode extends Mode {

    private long id;
    private String unit;
    private String name;
    private String templateId;
    private double value;
    private Timestamp dataTime;
    private int min;
    private int max;
    private String[] ranges;
    //    刻度
    private int minorTicks;

    public int getMinorTicks() {
        return minorTicks;
    }

    public void setMinorTicks(int minorTicks) {
        this.minorTicks = minorTicks;
    }

    public int getMin() {
        return min;
    }

    public void setMin(int min) {
        this.min = min;
    }

    public int getMax() {
        return max;
    }

    public void setMax(int max) {
        this.max = max;
    }

    public String[] getRanges() {
        return ranges;
    }

    public void setRanges(String[] ranges) {
        this.ranges = ranges;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTemplateId() {
        return templateId;
    }

    public void setTemplateId(String templateId) {
        this.templateId = templateId;
    }

    public double getValue() {
        return value;
    }

    public void setValue(double value) {
        this.value = value;
    }

    public Timestamp getDataTime() {
        return dataTime;
    }

    public void setDataTime(Timestamp dataTime) {
        this.dataTime = dataTime;
    }

    @Override
    public String toString() {
        return "SenorDataMode{" +
                "id=" + id +
                ", unit='" + unit + '\'' +
                ", name='" + name + '\'' +
                ", templateId='" + templateId + '\'' +
                ", value=" + value +
                ", dataTime=" + dataTime +
                ", ranges=" + ranges +
                '}';
    }
}
