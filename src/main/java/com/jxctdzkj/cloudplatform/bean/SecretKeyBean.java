package com.jxctdzkj.cloudplatform.bean;

import org.nutz.dao.entity.annotation.ColDefine;
import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Comment;
import org.nutz.dao.entity.annotation.Default;
import org.nutz.dao.entity.annotation.Name;
import org.nutz.dao.entity.annotation.Table;

import java.sql.Timestamp;

/**
 * <pre>
 *     @author  : FlySand
 *     @e-mail  : 1156183505@qq.com
 *     @time    : 2019/3/11.
 *     @desc    :
 * </pre>
 */
@Table("secret_key")
public class SecretKeyBean extends DBVO {
    @Name
    @Column("secret_key")
    String secretKey;

    @ColDefine(notNull = true)
    @Column("user_name")
    String userName;

    @Column
    String name;

    @Default("none")
    @Comment("key类型")
    @Column("key_type")
    String keyType;

    @Default("none")
    @Comment("限制类型")
    @Column("sanction_type")
    String sanctionType;

    @Column("use_count")
    long interfaceUseCount;

    @Default("-1")
    @Comment("接口到期次数")
    @Column("expiry_count")
    long expiryCount;

    @Comment("最后接口使用时间")
    @Column("last_use_time")
    Timestamp lastUseTime;


    @Column("creat_time")
    Timestamp creatTime;

    @Comment("到期时间")
    @Column("expiry_time")
    Timestamp expiryTime;

    @Comment("删除状态")
    @Column("del")
    @Default("0")
    int del;

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

    public String getSecretKey() {
        return secretKey;
    }

    public void setSecretKey(String secretKey) {
        this.secretKey = secretKey;
    }

    public String getKeyType() {
        return keyType;
    }

    public void setKeyType(String keyType) {
        this.keyType = keyType;
    }

    public String getSanctionType() {
        return sanctionType;
    }

    public void setSanctionType(String sanctionType) {
        this.sanctionType = sanctionType;
    }

    public long getInterfaceUseCount() {
        return interfaceUseCount;
    }

    public void setInterfaceUseCount() {
        this.interfaceUseCount++;
    }

    public void setInterfaceUseCount(long interfaceUseCount) {
        this.interfaceUseCount = interfaceUseCount;
    }

    public long getExpiryCount() {
        return expiryCount;
    }

    public void setExpiryCount(long expiryCount) {
        this.expiryCount = expiryCount;
    }

    public Timestamp getLastUseTime() {
        return lastUseTime;
    }

    public void setLastUseTime(Timestamp lastUseTime) {
        this.lastUseTime = lastUseTime;
    }

    public Timestamp getCreatTime() {
        return creatTime;
    }

    public void setCreatTime(Timestamp creatTime) {
        this.creatTime = creatTime;
    }

    public Timestamp getExpiryTime() {
        return expiryTime;
    }

    public void setExpiryTime(Timestamp expiryTime) {
        this.expiryTime = expiryTime;
    }
}
