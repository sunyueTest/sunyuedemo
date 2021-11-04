package com.jxctdzkj.cloudplatform.bean;

import com.fasterxml.jackson.annotation.JsonInclude;

import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Id;

import java.io.Serializable;

/**
 * <pre>
 *     author  : FlySand
 *     e-mail  : 1156183505@qq.com
 *     time    : 2018/8/1.
 *     desc    :
 * </pre>
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
class DBVO implements Serializable {
    @Id
    @Column
    protected long id;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }
}
