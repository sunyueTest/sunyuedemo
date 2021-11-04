package com.jxctdzkj.cloudplatform.bean;

import org.nutz.dao.entity.annotation.*;

import java.sql.Timestamp;

@Table("article_comment")
public class ArticleCommentBean extends DBVO {

    @Comment("文章Id")
    @Column("article_id")
    private long articleId;

    @Comment("评论内容")
    @Column("content")
    @ColDefine(type= ColType.TEXT)
    private String content;

    @Comment("创建人名字")
    @Column("create_name")
    private String createName;

    @Comment("创建时间")
    @Column("create_time")
    private Timestamp createTime;

    @Comment("是否删除 0：不删除  1：删除")
    @Column("is_delete")
    private int isDelete;

    public long getArticleId() {
        return articleId;
    }

    public void setArticleId(long articleId) {
        this.articleId = articleId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getCreateName() {
        return createName;
    }

    public void setCreateName(String createName) {
        this.createName = createName;
    }

    public Timestamp getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Timestamp createTime) {
        this.createTime = createTime;
    }

    public int getIsDelete() {
        return isDelete;
    }

    public void setIsDelete(int isDelete) {
        this.isDelete = isDelete;
    }
}
