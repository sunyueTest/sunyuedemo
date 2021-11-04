package com.jxctdzkj.cloudplatform.bean;

import lombok.Data;
import org.nutz.dao.entity.annotation.*;

@Table("crop_category")
@Data
@Comment("农作物类别表")
public class CropCategoryBean extends DBVO {

    @Column("category_id")
    @Comment("农物大类别:经济类3，蔬菜类1，果树类2")
    private long categoryId;

    @Column("category")
    @ColDefine(notNull = true)
    @Comment("农物大类别:经济类，蔬菜类，果树类")
    private String category;

    @Column("type")
    @ColDefine(notNull = true)
    @Comment("农物小类别:白菜/土豆/苹果/梨/棉花")
    private String type;

    @Column("is_del")
    @Default("0")
    @Comment("是否删除")
    private int isDel;

    public long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(long categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public int getIsDel() {
        return isDel;
    }

    public void setIsDel(int isDel) {
        this.isDel = isDel;
    }
}
