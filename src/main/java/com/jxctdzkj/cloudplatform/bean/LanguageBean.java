package com.jxctdzkj.cloudplatform.bean;

import lombok.Data;
import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Comment;
import org.nutz.dao.entity.annotation.Name;
import org.nutz.dao.entity.annotation.Table;

@Table("language")
@Data
public class LanguageBean extends DBVO {

    @Column("code")
    @Name
    @Comment("基础语言")
    private String code;

    @Column("chinese")
    @Comment("中文")
    private String chinese;

    @Column("english")
    @Comment("英文")
    private String english;
}
