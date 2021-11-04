package com.jxctdzkj.cloudplatform.bean;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Id;
import org.nutz.dao.entity.annotation.Table;

import java.sql.Timestamp;

/**
 * 溯源
 */
@Table("aquaculture_trace_source_detail")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TraceSourceDetailBean {
    @Id
    @Column
    private Integer id;

    @Column("header_id")
    private Integer headerId;

    @Column
    private String title;

    @Column
    private String content;

    @Column("create_time")
    private Timestamp createTime;


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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Timestamp getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Timestamp createTime) {
        this.createTime = createTime;
    }
}
