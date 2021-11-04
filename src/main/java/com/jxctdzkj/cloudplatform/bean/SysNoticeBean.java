package com.jxctdzkj.cloudplatform.bean;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Table;

import java.sql.Timestamp;

@Table("sys_notice")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SysNoticeBean extends DBVO{

    @Column()
    private String url;

    @Column()
    private String title;

    @Column("is_deleted")
    private int isDeleted;

    @Column("record_time")
    private Timestamp recordTime;

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public int getIsDeleted() {
        return isDeleted;
    }

    public void setIsDeleted(int isDeleted) {
        this.isDeleted = isDeleted;
    }

    public Timestamp getRecordTime() {
        return recordTime;
    }

    public void setRecordTime(Timestamp recordTime) {
        this.recordTime = recordTime;
    }

    @Override
    public String toString() {
        return "SysNoticeBean{" +
                "title='" + title + '\'' +
                "url='" + url + '\'' +
                ", isDeleted='" + isDeleted + '\'' +
                '}';
    }



}
