package com.jxctdzkj.cloudplatform.bean;

import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Id;
import org.nutz.dao.entity.annotation.Table;

/**
 * 报表管理 自定义模板的明细
 */
@Table("aquaculture_pond_record_template_detail")
public class AquaculturePondRecordTemplateDetailBean {

    @Id
    @Column
    private Integer id;

    @Column("temp_id")
    private Integer tempId;

    @Column("field")
    private String field;

    @Column("field_name")
    private String fieldName;


    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getTempId() {
        return tempId;
    }

    public void setTempId(Integer tempId) {
        this.tempId = tempId;
    }

    public String getField() {
        return field;
    }

    public void setField(String field) {
        this.field = field;
    }

    public String getFieldName() {
        return fieldName;
    }

    public void setFieldName(String fieldName) {
        this.fieldName = fieldName;
    }
}
