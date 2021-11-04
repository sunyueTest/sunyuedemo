package com.jxctdzkj.cloudplatform.bean;

import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Comment;
import org.nutz.dao.entity.annotation.Default;
import org.nutz.dao.entity.annotation.Table;

/**
 * <pre>
 *     author  : FlySand
 *     e-mail  : 1156183505@qq.com
 *     time    : 2018/8/27.
 *     desc    : 传感器类型
 * </pre>
 */
@Table("sensor_type")
public class SensorTypeBean extends DBVO {

    @Column
    private String type;
    @Column("tname")
    private String name;
    @Column("en_name")
    private String enName;
    @Column("tunit")
    private String unit;
    @Column("ticon")
    private String icon;
    @Column("tdigits")//小数位
    private String digits;
    @Column("tcoeffcient")//系数
    private String coeffcient;
    @Default("0")
    @Column("min")
    private int min;
    @Default("200")
    @Column("max")
    private int max = 200;
    @Default("0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200")
    @Column("ranges")
    private String ranges;
    @Comment("刻度")
    @Default("5")
    @Column("minor_ticks")
    private int minorTicks = 5;
    @Default("")
    @Comment("备注")
    @Column("remarks")
    private String remarks;

    public String getEnName() {
        return enName;
    }

    public void setEnName(String enName) {
        this.enName = enName;
    }
//    INSERT INTO `environment`.``
// (`id`, `type`, `t2005`, `thttpcq`, `tname`, `tunit`, `tcoeffcient`, `tdigits`, `ticon`)
//  ('25', '25', '   25',    '25', '  土壤温度', '℃', '   0.100',   '     1',    '1.png');


    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

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

    public String getRanges() {
        return ranges;
    }

    public void setRanges(String ranges) {
        this.ranges = ranges;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

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

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getDigits() {
        return digits;
    }

    public void setDigits(String digits) {
        this.digits = digits;
    }

    public String getCoeffcient() {
        return coeffcient;
    }

    public void setCoeffcient(String coeffcient) {
        this.coeffcient = coeffcient;
    }

    @Override
    public String toString() {
        return "SensorTypeBean{" +
                "type='" + type + '\'' +
                ", name='" + name + '\'' +
                ", unit='" + unit + '\'' +
                ", icon='" + icon + '\'' +
                ", digits='" + digits + '\'' +
                ", coeffcient='" + coeffcient + '\'' +
                '}';
    }
}

