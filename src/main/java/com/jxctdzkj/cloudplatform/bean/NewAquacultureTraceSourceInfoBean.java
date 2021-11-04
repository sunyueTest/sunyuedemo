package com.jxctdzkj.cloudplatform.bean;

import org.nutz.dao.entity.annotation.*;

import java.sql.Timestamp;
import java.util.Arrays;

@Table("new_aquaculture_trace_source_info")
public class NewAquacultureTraceSourceInfoBean extends DBVO {

    @Comment("用户名")
    @ColDefine(notNull = true)
    @Column("user_name")
    String userName;

    @Comment("产品名称")
    @Column
    private String name;

    @Comment("产品编号")
    @Column("product_code")
    private String productCode;

    @Comment("标题")
    @Column
    private String title;

    @Comment("产品信息简介")
    @Column
    private String message;

    @Comment("成熟时间")
    @Column("maturity_time")
    private Timestamp maturityTime;

    private String productTime;

    @Comment("养殖面积")
    @Column("aquaculture_area")
    private String aquacultureArea;

    @Comment("产量")
    @Column
    private String yield;

    @Comment("产地")
    @Column("place_of_origin")
    private String placeOfOrigin;

    @Column("is_del")
    @Default("0")
    private Integer isDel;

    @Comment("继电器编号")
    @Column("relay_number")
    private String relayNumber;

    @Comment("摄像头编号")
    @Column("camera_number")
    private String cameraNumber;

    @Comment("经纬度")
    @Column
    private String position;

    private String[] Type1ImgUrl;

    private String[] Type2ImgUrl;

    private String[] Type3ImgUrl;

    private String[] Type4ImgUrl;

    public String[] getType1ImgUrl() {
        return Type1ImgUrl;
    }

    public void setType1ImgUrl(String[] type1ImgUrl) {
        Type1ImgUrl = type1ImgUrl;
    }

    public String[] getType2ImgUrl() {
        return Type2ImgUrl;
    }

    public void setType2ImgUrl(String[] type2ImgUrl) {
        Type2ImgUrl = type2ImgUrl;
    }

    public String[] getType3ImgUrl() {
        return Type3ImgUrl;
    }

    public void setType3ImgUrl(String[] type3ImgUrl) {
        Type3ImgUrl = type3ImgUrl;
    }

    public String[] getType4ImgUrl() {
        return Type4ImgUrl;
    }

    public void setType4ImgUrl(String[] type4ImgUrl) {
        Type4ImgUrl = type4ImgUrl;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getProductCode() {
        return productCode;
    }

    public void setProductCode(String productCode) {
        this.productCode = productCode;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Timestamp getMaturityTime() {
        return maturityTime;
    }

    public void setMaturityTime(Timestamp maturityTime) {
        this.maturityTime = maturityTime;
    }

    public String getAquacultureArea() {
        return aquacultureArea;
    }

    public void setAquacultureArea(String aquacultureArea) {
        this.aquacultureArea = aquacultureArea;
    }

    public String getYield() {
        return yield;
    }

    public void setYield(String yield) {
        this.yield = yield;
    }

    public String getPlaceOfOrigin() {
        return placeOfOrigin;
    }

    public void setPlaceOfOrigin(String placeOfOrigin) {
        this.placeOfOrigin = placeOfOrigin;
    }

    public Integer getIsDel() {
        return isDel;
    }

    public void setIsDel(Integer isDel) {
        this.isDel = isDel;
    }

    public String getRelayNumber() {
        return relayNumber;
    }

    public void setRelayNumber(String relayNumber) {
        this.relayNumber = relayNumber;
    }

    public String getCameraNumber() {
        return cameraNumber;
    }

    public void setCameraNumber(String cameraNumber) {
        this.cameraNumber = cameraNumber;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public String getProductTime() {
        return productTime;
    }

    public void setProductTime(String productTime) {
        this.productTime = productTime;
    }

    @Override
    public String toString() {
        return "NewAquacultureTraceSourceInfoBean{" +
                "id=" + id +
                ", userName='" + userName + '\'' +
                ", name='" + name + '\'' +
                ", productCode='" + productCode + '\'' +
                ", title='" + title + '\'' +
                ", message='" + message + '\'' +
                ", maturityTime=" + maturityTime +
                ", productTime='" + productTime + '\'' +
                ", aquacultureArea='" + aquacultureArea + '\'' +
                ", yield='" + yield + '\'' +
                ", placeOfOrigin='" + placeOfOrigin + '\'' +
                ", isDel=" + isDel +
                ", relayNumber='" + relayNumber + '\'' +
                ", cameraNumber='" + cameraNumber + '\'' +
                ", position='" + position + '\'' +
                ", Type1ImgUrl=" + Arrays.toString(Type1ImgUrl) +
                ", Type2ImgUrl=" + Arrays.toString(Type2ImgUrl) +
                ", Type3ImgUrl=" + Arrays.toString(Type3ImgUrl) +
                ", Type4ImgUrl=" + Arrays.toString(Type4ImgUrl) +
                '}';
    }
}
