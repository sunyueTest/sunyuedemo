package com.jxctdzkj.cloudplatform.bean;

import com.jxctdzkj.support.utils.TextUtils;

import org.nutz.dao.entity.annotation.ColDefine;
import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Comment;
import org.nutz.dao.entity.annotation.Table;

import java.sql.Timestamp;

/**
 * @Description 操作日志实体类
 * @Author chanmufeng
 * @Date 2019/7/24 8:43
 **/
@Table("op_log")
public class OpLogBean extends DBVO {
    @Column("user_name")
    @Comment("用户名")
    private String userName;

    @Column("operation")
    @Comment("操作名称")
    private String operation;

    @Column("method")
    @Comment("接口名称")
    private String method;

    @Column("params")
    @Comment("请求参数")
    @ColDefine(width = 500)
    private String params;

    @Column("ip")
    @Comment("用户ip地址")
    private String ip;

    @Column("op_time")
    @Comment("操作时间")
    private Timestamp opTime;

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getOperation() {
        return operation;
    }

    public void setOperation(String operation) {
        this.operation = operation;
    }

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    public String getParams() {
        return params;
    }

    public void setParams(String params) {
        if (!TextUtils.isEmpty(params) && params.length() > 500) {
            this.params = params.substring(0, 500);
        } else {
            this.params = params;
        }
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public Timestamp getOpTime() {
        return opTime;
    }

    public void setOpTime(Timestamp opTime) {
        this.opTime = opTime;
    }
}
