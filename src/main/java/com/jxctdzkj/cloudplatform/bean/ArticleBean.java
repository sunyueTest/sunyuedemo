package com.jxctdzkj.cloudplatform.bean;

import org.nutz.dao.entity.annotation.*;

import java.sql.Timestamp;
import java.util.List;

@Table("article")
public class ArticleBean extends DBVO {

    @Comment("文章标题")
    @Column("title")
    private String title;

    @Comment("文章内容")
    @Column("content")
    @ColDefine(type= ColType.TEXT)
    private String content;

    @Comment("创建人ID")
    @Column("create_id")
    private long createId;

    @Comment("创建人名字")
    @Column("create_name")
    private String createName;

    @Comment("专家名字")
    @Column("expert_name")
    private String expertName;

    @Comment("创建时间")
    @Column("create_time")
    private Timestamp createTime;

    @Comment("是否删除 0：不删除  1：删除")
    @Column("is_delete")
    private int isDelete;

    @Comment("是否文章还是信息  文章：0 信息：1")
    @Column("type")
    private String type;

    @Comment("所属类别 参考Constant.Category")
    @Column("category")
    @Default("0")
    private int category;

    @Comment("查看次数")
    @Column("num")
    @Default("0")
    private int num;

    private List<ArticleCommentBean>list;
    private int count;

    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }

    public List<ArticleCommentBean> getList() {
        return list;
    }

    public void setList(List<ArticleCommentBean> list) {
        this.list = list;
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

    public long getCreateId() {
        return createId;
    }

    public void setCreateId(long createId) {
        this.createId = createId;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public void setCreateId(int createId) {
        this.createId = createId;
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

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getExpertName() {
        return expertName;
    }

    public void setExpertName(String expertName) {
        this.expertName = expertName;
    }

    public int getCategory() {
        return category;
    }

    public void setCategory(int category) {
        this.category = category;
    }

    public int getNum() {
        return num;
    }

    public void setNum(int num) {
        this.num = num;
    }
}
