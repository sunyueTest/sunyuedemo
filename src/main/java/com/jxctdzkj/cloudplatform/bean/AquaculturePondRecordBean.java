package com.jxctdzkj.cloudplatform.bean;

import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Id;
import org.nutz.dao.entity.annotation.Table;

import java.sql.Timestamp;

/**
 * 自定义报表管理记录数据
 */
@Table("aquaculture_pond_record")
public class AquaculturePondRecordBean {
    @Id
    @Column
    private Integer id;

    @Column("detail_id")
    private Integer detailId;

    @Column("user_name")
    private String userName;

    @Column("create_time")
    private Timestamp createTime;

    private String month;

    @Column
    private String att1;

    @Column
    private String att2;

    @Column
    private String att3;

    @Column
    private String att4;

    @Column
    private String att5;

    @Column
    private String att6;

    @Column
    private String att7;

    @Column
    private String att8;

    @Column
    private String att9;

    @Column
    private String att10;


    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public Timestamp getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Timestamp createTime) {
        this.createTime = createTime;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Integer getDetailId() {
        return detailId;
    }

    public void setDetailId(Integer detailId) {
        this.detailId = detailId;
    }

    public String getAtt1() {
        return att1;
    }

    public void setAtt1(String att1) {
        this.att1 = att1;
    }

    public String getAtt2() {
        return att2;
    }

    public void setAtt2(String att2) {
        this.att2 = att2;
    }

    public String getAtt3() {
        return att3;
    }

    public void setAtt3(String att3) {
        this.att3 = att3;
    }

    public String getAtt4() {
        return att4;
    }

    public void setAtt4(String att4) {
        this.att4 = att4;
    }

    public String getAtt5() {
        return att5;
    }

    public void setAtt5(String att5) {
        this.att5 = att5;
    }

    public String getAtt6() {
        return att6;
    }

    public void setAtt6(String att6) {
        this.att6 = att6;
    }

    public String getAtt7() {
        return att7;
    }

    public void setAtt7(String att7) {
        this.att7 = att7;
    }

    public String getAtt8() {
        return att8;
    }

    public void setAtt8(String att8) {
        this.att8 = att8;
    }

    public String getAtt9() {
        return att9;
    }

    public void setAtt9(String att9) {
        this.att9 = att9;
    }

    public String getAtt10() {
        return att10;
    }

    public void setAtt10(String att10) {
        this.att10 = att10;
    }
}
