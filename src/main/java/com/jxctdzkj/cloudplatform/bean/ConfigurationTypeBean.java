package com.jxctdzkj.cloudplatform.bean;


import lombok.Data;
import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Default;
import org.nutz.dao.entity.annotation.Table;

/**
 * @Auther huangwei
 * @Date 2019/12/2
 **/
@Table("configuration_return_type")
@Data
public class ConfigurationTypeBean extends DBVO{

    @Column("type")
    private String type;


    @Column("type_name")
    private String typeName;

    @Column("value")
    private String value;

    @Column("user_name")
    private String userName;

    @Column("is_del")
    @Default("0")
    private int isDel;


}
