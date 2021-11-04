package com.jxctdzkj.cloudplatform.bean;

import lombok.Data;
import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Table;

@Data
@Table("person")
public class PersonBean extends DBVO {
    @Column("user_name")
    private String userName;

    @Column("create_user")
    private String createUser;

    @Column("age")
    private Integer age;

    @Column("sex")
    private Integer sex;
}
