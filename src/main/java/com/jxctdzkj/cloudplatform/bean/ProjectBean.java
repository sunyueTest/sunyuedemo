package com.jxctdzkj.cloudplatform.bean;

import com.jxctdzkj.cloudplatform.utils.Utils;
import lombok.Data;
import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Comment;
import org.nutz.dao.entity.annotation.Default;
import org.nutz.dao.entity.annotation.Table;

import java.sql.Timestamp;
import java.util.List;

/**
 * @Description 项目
 * @Author chanmufeng
 * @Date 2019/9/5 10:03
 **/
@Table("project")
@Data
public class ProjectBean extends DBVO {
    @Column("type")
    @Comment("项目类型")
    private int type;

    @Column("name")
    @Comment("项目名称")
    private String name;

    @Column("enterprise_id")
    @Comment("企业id")
    private long enterpriseId;

    @Column("construction_company")
    @Comment("建设单位")
    private String constructionCompany;

    @Column("supporting_company")
    @Comment("支持单位")
    private String supportingCompany;

    @Column("website")
    @Comment("项目网站地址")
    private String website;

    @Column("logo")
    @Comment("项目LOGO")
    private String logo;

    @Column("create_user")
    @Comment("创建者")
    private String createUser;

    @Column("create_time")
    @Comment("创建时间")
    private Timestamp createTime = Utils.getCurrentTimestamp();

    private List<Base> bases;

}
