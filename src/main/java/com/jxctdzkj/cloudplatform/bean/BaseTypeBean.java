package com.jxctdzkj.cloudplatform.bean;

import lombok.Data;
import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Table;

/**
 * @Description 基地具体分类
 * @Author chanmufeng
 * @Date 2019/9/7 8:39
 **/
@Data
@Table("base_type")
public class BaseTypeBean extends DBVO{

    @Column("name")
    private String name;

}
