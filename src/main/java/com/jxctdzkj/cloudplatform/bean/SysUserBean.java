package com.jxctdzkj.cloudplatform.bean;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.jxctdzkj.cloudplatform.config.Constant;
import org.nutz.dao.entity.annotation.*;

import java.sql.Timestamp;


@Table("sys_user")
@JsonIgnoreProperties(value = {"password"})
public class SysUserBean extends DBVO {
    @Column
    private String email;
    @Column("last_logintime")
    private Timestamp lastLoginTime;
    @Column
    private String password;
    @Column("real_name")
    private String realName;
    @Default("5")
    @Column
    private int role = 5;
    //级别 区分一级用户二级用户
    @Column
    @Default("1")
    private int level = 1;
    @Column
    private String tel;
    @Name
    @Column("user_name")
    private String userName;
    @Column("areacode")
    @Default("371000XPTYH")
    private String areaCode;
    @Column
    private String channel;
    @Column("usercode")
    @Default("371000XPTYH")
    private String userCode;
    //userName
    @Default(Constant.Define.SYS_USER)
    @Column("parentuser")
    private String parentUser;
    @Default(Constant.Define.SYS_USER)
    @Column("facecode")
    private String faceCode;

    @Column("creat_time")
    private Timestamp creatTime;

    @Column("platform_use_time")
    private Timestamp platformUseTime;

    @Comment("注册信息")
    @Column("regist_info")
    private String registInfo;

    @Comment("注册信息")
    @Default("0")
    @Column("agreement_version")
    private int agreementVersion;

    @Column("id_card_no")
    private String idCardNo;

    @Column("is_del")
    @Comment("用户是否被删除标识")
    @Default("0")
    private int isDel;

    @Column("ip")
    @Comment("用户登录ip")
    @Default("")
    private String ip;


    @Column
    @Comment("app唯一标识")
    @Default("")
    private String cid;

    /**
     * 农业政府平台企业停用，所有客户一律不可登录
     */
    @Comment("用户状态可登录平台或不可登录  0：可登录  1不可登录")
    @Column("state")
    @Default("0")
    private String state;

    @Comment("父级账号信息存入，保存的是所有的父级账号")
    @Column("parent_account")
    @ColDefine(type= ColType.TEXT)
//    @Default("/")
    private String parentAccount="/";

    public String getParentAccount() {
        return parentAccount;
    }

    public void setParentAccount(String parentAccount) {
        this.parentAccount = parentAccount;
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public int getIsDel() {
        return isDel;
    }

    public void setIsDel(int isDel) {
        this.isDel = isDel;
    }

    public String getIdCardNo() {
        return idCardNo;
    }

    public void setIdCardNo(String idCardNo) {
        this.idCardNo = idCardNo;
    }

    public int getAgreementVersion() {
        return agreementVersion;
    }

    public void setAgreementVersion(int agreementVersion) {
        this.agreementVersion = agreementVersion;
    }

    public String getRegistInfo() {
        return registInfo;
    }

    public void setRegistInfo(String registInfo) {
        this.registInfo = registInfo;
    }

    public Timestamp getPlatformUseTime() {
        return platformUseTime;
    }

    public void setPlatformUseTime(Timestamp platformUseTime) {
        this.platformUseTime = platformUseTime;
    }

    public Timestamp getCreatTime() {
        return creatTime;
    }

    public void setCreatTime(Timestamp creatTime) {
        this.creatTime = creatTime;
    }

    public int getLevel() {
        return level;
    }

    public void setLevel(int level) {
        this.level = level;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }


    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRealName() {
        return realName;
    }

    public void setRealName(String realName) {
        this.realName = realName;
    }


    public String getTel() {
        return tel;
    }

    public void setTel(String tel) {
        this.tel = tel;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getChannel() {
        return channel;
    }

    public void setChannel(String channel) {
        this.channel = channel;
    }

    public Timestamp getLastLoginTime() {
        return lastLoginTime;
    }

    public void setLastLoginTime(Timestamp lastLoginTime) {
        this.lastLoginTime = lastLoginTime;
    }

    public String getAreaCode() {
        return areaCode;
    }

    public void setAreaCode(String areaCode) {
        this.areaCode = areaCode;
    }

    public String getUserCode() {
        return userCode;
    }

    public void setUserCode(String userCode) {
        this.userCode = userCode;
    }

    public String getParentUser() {
        return parentUser;
    }

    public void setParentUser(String parentUser) {
        this.parentUser = parentUser;
    }

    public String getFaceCode() {
        return faceCode;
    }

    public void setFaceCode(String faceCode) {
        this.faceCode = faceCode;
    }

    public int getRole() {
        return role;
    }

    public void setRole(int role) {
        this.role = role;
    }

    @Override
    public String toString() {
        return "SysUser{" +
                "id='" + id + '\'' +
                ", userName='" + userName + '\'' +
                ", email='" + email + '\'' +
                ", lastLoginTime=" + lastLoginTime +
                ", creatTime=" + creatTime +
                ", password='" + password + '\'' +
                ", realName='" + realName + '\'' +
                ", level=" + level +
                ", tel='" + tel + '\'' +
                ", role='" + role + '\'' +
                ", areaCode='" + areaCode + '\'' +
                ", channel='" + channel + '\'' +
                ", userCode='" + userCode + '\'' +
                ", parentUser='" + parentUser + '\'' +
                ", faceCode='" + faceCode + '\'' +
                '}';
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getCid() {
        return cid;
    }

    public void setCid(String cid) {
        this.cid = cid;
    }
}
