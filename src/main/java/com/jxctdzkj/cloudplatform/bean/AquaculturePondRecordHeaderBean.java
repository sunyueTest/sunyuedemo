package com.jxctdzkj.cloudplatform.bean;

import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Id;
import org.nutz.dao.entity.annotation.Table;

/**
 * 报表管理的一级数据
 */
@Table("aquaculture_pond_record_header")
public class AquaculturePondRecordHeaderBean {

    @Id
    @Column
    private Integer id;

    @Column("user_name")
    private String userName;

    @Column("pond_name")
    private String pondName;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPondName() {
        return pondName;
    }

    public void setPondName(String pondName) {
        this.pondName = pondName;
    }
}
