package com.jxctdzkj.cloudplatform.bean;

import com.fasterxml.jackson.annotation.JsonInclude;

import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Id;
import org.nutz.dao.entity.annotation.Name;
import org.nutz.dao.entity.annotation.Table;

/**
 * <pre>
 *     @author  : FlySand
 *     @e-mail  : 1156183505@qq.com
 *     @time    : 2018/8/28.
 *     @desc    : 区域
 * </pre>
 */
@Table("area")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AreaBean {

    @Id
    @Column("Aid")
    private int id;
    @Name
    @Column("Acode")
    private String code;
    @Column("Aname")
    private String name;
    @Column("Pcode")
    private String pCode;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getpCode() {
        return pCode;
    }

    public void setpCode(String pCode) {
        this.pCode = pCode;
    }

    @Override
    public String toString() {
        return "AreaBean{" +
                "id='" + id + '\'' +
                ", code='" + code + '\'' +
                ", name='" + name + '\'' +
                ", pCode='" + pCode + '\'' +
                '}';
    }
}

