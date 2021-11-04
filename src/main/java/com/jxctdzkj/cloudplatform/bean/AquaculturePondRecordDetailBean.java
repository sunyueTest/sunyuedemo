package com.jxctdzkj.cloudplatform.bean;

import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Id;
import org.nutz.dao.entity.annotation.Table;

/**
 * 报表管理的二级数据
 */
@Table("aquaculture_pond_record_detail")
public class AquaculturePondRecordDetailBean {

    @Id
    @Column
    private Integer id;

    @Column("header_id")
    private Integer headerId;

    @Column("temp_id")
    private Integer tempId;

    @Column("record_name")
    private String recordName;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getHeaderId() {
        return headerId;
    }

    public void setHeaderId(Integer headerId) {
        this.headerId = headerId;
    }

    public Integer getTempId() {
        return tempId;
    }

    public void setTempId(Integer tempId) {
        this.tempId = tempId;
    }

    public String getRecordName() {
        return recordName;
    }

    public void setRecordName(String recordName) {
        this.recordName = recordName;
    }
}
