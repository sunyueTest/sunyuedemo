package com.jxctdzkj.cloudplatform.bean;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Default;

import java.lang.reflect.Field;
import java.sql.Timestamp;

/**
 * <pre>
 *     author  : FlySand
 *     e-mail  : 1156183505@qq.com
 *     time    : 2018/8/1.
 *     desc    :
 * </pre>
 */
@JsonIgnoreProperties(value = {"del"})
public class DBEO extends DBVO {

    public DBEO() {
        creatTime = new Timestamp(System.currentTimeMillis());
    }

    @Column("creat_time")
    Timestamp creatTime;

    @Default("0")
    @Column("del")
    int del;

    public Timestamp getCreatTime() {
        return creatTime;
    }

    public void setCreatTime(Timestamp creatTime) {
        this.creatTime = creatTime;
    }

    public int getDel() {
        return del;
    }

    public void setDel(int del) {
        this.del = del;
    }

    public String toString() {
        StringBuffer sb = new StringBuffer();
        Field[] fields = this.getClass().getDeclaredFields();
        sb.append(this.getClass().getName());
        sb.append("{");
        for (Field iField : fields) {
            sb.append(iField.getName());
            sb.append("=\'");
            try {
                iField.setAccessible(true);
                sb.append(iField.get(this));
            } catch (Exception e) {
            }
            sb.append("\',");
        }
        sb.append("}");
        return sb.toString();
    }
}
