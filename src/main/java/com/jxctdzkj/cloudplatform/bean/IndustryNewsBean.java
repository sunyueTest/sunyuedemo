package com.jxctdzkj.cloudplatform.bean;

import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Table;

import java.util.Date;

@Table("industry_news")
public class IndustryNewsBean extends DBVO{

    // 新闻标题
    @Column("news_title")
    private String newsTitle;

    // 新闻类型
    @Column("news_type")
    private String newsType;

    // 新闻图片
    @Column("img_url")
    private String imgUrl;

    // 新闻内容
    @Column("news_content")
    private String newsContent;

    // 创建日期
    @Column("create_time")
    private Date createTime;

    // 行业类型 1-水产
    @Column("industry_type")
    private String industryType;

    // 查看权限 0-所有角色都能看
    @Column("news_role")
    private String newsRole;

    // 删除标识 0-未删除
    @Column("delete_flag")
    private String deleteFlag;

    public String getImgUrl() {
        return imgUrl;
    }

    public void setImgUrl(String imgUrl) {
        this.imgUrl = imgUrl;
    }

    public String getDeleteFlag() {
        return deleteFlag;
    }

    public void setDeleteFlag(String deleteFlag) {
        this.deleteFlag = deleteFlag;
    }

    public String getNewsTitle() {
        return newsTitle;
    }

    public void setNewsTitle(String newsTitle) {
        this.newsTitle = newsTitle;
    }

    public String getNewsType() {
        return newsType;
    }

    public void setNewsType(String newsType) {
        this.newsType = newsType;
    }

    public String getNewsContent() {
        return newsContent;
    }

    public void setNewsContent(String newsContent) {
        this.newsContent = newsContent;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public String getIndustryType() {
        return industryType;
    }

    public void setIndustryType(String industryType) {
        this.industryType = industryType;
    }

    public String getNewsRole() {
        return newsRole;
    }

    public void setNewsRole(String newsRole) {
        this.newsRole = newsRole;
    }
}
