package com.jxctdzkj.cloudplatform.bean;

import org.nutz.dao.entity.annotation.ColDefine;
import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Default;
import org.nutz.dao.entity.annotation.Table;

import java.sql.Timestamp;

/**
 * <pre>
 *     @author  : FlySand
 *     @e-mail  : 1156183505@qq.com
 *     @time    : 2018/8/28.
 *     @desc    : 配置bean
 * </pre>
 */
@Table("config")
public class ConfigBean extends DBVO {


    @ColDefine(notNull = true)
    @Column("config_type")
    private int configType;

    @Default("0")
    @Column("config_value")
    private int configValue;

    @Column
    String remark;

    @Column
    Timestamp time;

    public Timestamp getTime() {
        return time;
    }

    public void setTime(Timestamp time) {
        this.time = time;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public int getConfigType() {
        return configType;
    }

    public void setConfigType(int configType) {
        this.configType = configType;
    }

    public int getConfigValue() {
        return configValue;
    }

    public void setConfigValue(int configValue) {
        this.configValue = configValue;
    }

    @Override
    public String toString() {
        return "ConfigBean{" +
                "configType=" + configType +
                ", configValue=" + configValue +
                ", remark=" + remark +
                '}';
    }
}
