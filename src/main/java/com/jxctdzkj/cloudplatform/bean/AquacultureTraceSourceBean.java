package com.jxctdzkj.cloudplatform.bean;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Default;
import org.nutz.dao.entity.annotation.Id;
import org.nutz.dao.entity.annotation.Table;


import java.sql.Timestamp;

/**
 * 渔业溯源系统
 */
@Table("aquaculture_trace_source")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AquacultureTraceSourceBean {
    @Id
    @Column
    private Integer id;
    @Column
    private String name;
    @Column("product_code")
    private String productCode;
    @Column("product_date")
    private Timestamp productDate;

    private String productTime;
    @Column
    private String enterprise;
    @Column
    private String specs;
    @Column("origin_place")
    private String originPlace;
    @Column("feed_source")
    private String feedSource;
    @Column("seed_source")
    private String seedSource;
    @Column("drug_use")
    private String drugUse;
    @Column("test_service")
    private String testService;
    @Column("process_service")
    private String processService;
    @Column
    private String logistics;
    @Column("img_src")
    private String imgSrc;

    @Column("img_src2")
    private String imgSrc2;

    @Column("img_src3")
    private String imgSrc3;

    @Column("is_del")
    @Default("0")
    private Integer isDel;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
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

    public Timestamp getProductDate() {
        return productDate;
    }

    public void setProductDate(Timestamp productDate) {
        this.productDate = productDate;
    }

    public String getEnterprise() {
        return enterprise;
    }

    public void setEnterprise(String enterprise) {
        this.enterprise = enterprise;
    }

    public String getSpecs() {
        return specs;
    }

    public void setSpecs(String specs) {
        this.specs = specs;
    }

    public String getOriginPlace() {
        return originPlace;
    }

    public void setOriginPlace(String originPlace) {
        this.originPlace = originPlace;
    }

    public String getFeedSource() {
        return feedSource;
    }

    public void setFeedSource(String feedSource) {
        this.feedSource = feedSource;
    }

    public String getSeedSource() {
        return seedSource;
    }

    public void setSeedSource(String seedSource) {
        this.seedSource = seedSource;
    }

    public String getDrugUse() {
        return drugUse;
    }

    public void setDrugUse(String drugUse) {
        this.drugUse = drugUse;
    }

    public String getTestService() {
        return testService;
    }

    public void setTestService(String testService) {
        this.testService = testService;
    }

    public String getProcessService() {
        return processService;
    }

    public void setProcessService(String processService) {
        this.processService = processService;
    }

    public String getLogistics() {
        return logistics;
    }

    public void setLogistics(String logistics) {
        this.logistics = logistics;
    }

    public Integer getIsDel() {
        return isDel;
    }

    public void setIsDel(Integer isDel) {
        this.isDel = isDel;
    }

    public String getImgSrc() {
        return imgSrc;
    }

    public void setImgSrc(String imgSrc) {
        this.imgSrc = imgSrc;
    }

    public String getProductTime() {
        return productTime;
    }

    public void setProductTime(String productTime) {
        this.productTime = productTime;
    }

    public String getImgSrc2() {
        return imgSrc2;
    }

    public void setImgSrc2(String imgSrc2) {
        this.imgSrc2 = imgSrc2;
    }

    public String getImgSrc3() {
        return imgSrc3;
    }

    public void setImgSrc3(String imgSrc3) {
        this.imgSrc3 = imgSrc3;
    }
}
