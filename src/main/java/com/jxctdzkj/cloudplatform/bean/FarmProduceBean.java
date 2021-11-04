package com.jxctdzkj.cloudplatform.bean;

import lombok.Data;
import org.nutz.dao.entity.annotation.*;

@Table("farm_produce")
@Data
@Comment("农产品表")
public class FarmProduceBean extends DBVO {

    @Column("crop_category_id")
    @Comment("农作物类别表主键crop_category")
    private long cropCategoryId;

    @Column("produce_name")
    @ColDefine(notNull = true)
    @Comment("产品名称")
    private String produceName;

    @Column("synopsis")
    @ColDefine(type = ColType.TEXT)
    @Comment("产品简介")
    private String synopsis;

    @Column("produce_img1")
    @Comment("产品图片1")
    private String produceImg1;

    @Column("produce_img2")
    @Comment("产品图片2")
    private String produceImg2;

    @Column("produce_img3")
    @Comment("产品图片3")
    private String produceImg3;

    @Column("ambient")
    @Comment("种植环境")
    @ColDefine(type = ColType.TEXT)
    private String ambient;

    @Column("price")
    @Comment("价格")
    private String price;


    public String getProduceName() {
        return produceName;
    }

    public void setProduceName(String produceName) {
        this.produceName = produceName;
    }

    public String getSynopsis() {
        return synopsis;
    }

    public void setSynopsis(String synopsis) {
        this.synopsis = synopsis;
    }

    public String getProduceImg1() {
        return produceImg1;
    }

    public void setProduceImg1(String produceImg1) {
        this.produceImg1 = produceImg1;
    }

    public String getProduceImg2() {
        return produceImg2;
    }

    public void setProduceImg2(String produceImg2) {
        this.produceImg2 = produceImg2;
    }

    public String getProduceImg3() {
        return produceImg3;
    }

    public void setProduceImg3(String produceImg3) {
        this.produceImg3 = produceImg3;
    }

    public String getAmbient() {
        return ambient;
    }

    public void setAmbient(String ambient) {
        this.ambient = ambient;
    }

    public String getPrice() {
        return price;
    }

    public void setPrice(String price) {
        this.price = price;
    }

    public long getCropCategoryId() {
        return cropCategoryId;
    }

    public void setCropCategoryId(long cropCategoryId) {
        this.cropCategoryId = cropCategoryId;
    }

}
