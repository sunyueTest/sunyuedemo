package com.jxctdzkj.cloudplatform.bean;

import org.nutz.dao.entity.annotation.ColDefine;
import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Comment;
import org.nutz.dao.entity.annotation.Table;

import java.sql.Timestamp;

/**
 * <pre>
 *     @author  : FlySand
 *     @e-mail  : 1156183505@qq.com
 *     @time    : 2019/3/6.
 *     @desc    :
 * </pre>
 */
@Comment("分表信息")
@Table("split_table_info")
public class SplitTableBean extends DBVO {

    @Comment("库名")
    @Column("db_name")
    String dbName;

    @Comment("表名")
    @Column("table_name")
    String tableName;

    @ColDefine(notNull = true)
    @Comment("拆分后缀")
    @Column("suffix_name")
    String suffixName;

    @Comment("拆分表名")
    @Column("split_table_name")
    String splitTableName;

    @Comment("初始化id")
    @Column("init_id")
    long initId;

    @Comment("创建时间")
    @Column("creat_time")
    Timestamp creatTime;

    @Comment("数据结束时间")
    @Column("data_end_time")
    Timestamp dataEndTime;


    public Timestamp getDataEndTime() {
        return dataEndTime;
    }

    public void setDataEndTime(Timestamp dataEndTime) {
        this.dataEndTime = dataEndTime;
    }

    public String getDbName() {
        return dbName;
    }

    public void setDbName(String dbName) {
        this.dbName = dbName;
    }

    public long getInitId() {
        return initId;
    }

    public void setInitId(long initId) {
        this.initId = initId;
    }

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }


    public String getSuffixName() {
        return suffixName;
    }

    public void setSuffixName(String suffixName) {
        this.suffixName = suffixName;
    }

    public String getSplitTableName() {
        return splitTableName;
    }

    public void setSplitTableName(String splitTableName) {
        this.splitTableName = splitTableName;
    }

    public Timestamp getCreatTime() {
        return creatTime;
    }

    public void setCreatTime(Timestamp creatTime) {
        this.creatTime = creatTime;
    }

    @Override
    public String toString() {
        return "SplitTableBean{" +
                ", id=" + id +
                "dbName='" + dbName + '\'' +
                ", tableName='" + tableName + '\'' +
                ", suffixName='" + suffixName + '\'' +
                ", splitTableName='" + splitTableName + '\'' +
                ", initId=" + initId +
                ", creatTime=" + creatTime +
                '}';
    }
}
