package com.jxctdzkj.cloudplatform.bean;

import lombok.Data;
import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Comment;
import org.nutz.dao.entity.annotation.Name;
import org.nutz.dao.entity.annotation.Table;

/**
 * <pre>
 *     @author  : FlySand
 *     @e-mail  : 1156183505@qq.com
 *     @time    : 2019/2/28.
 *     @desc    :
 * </pre>
 */
@Table("system_type")
@Data
public class SystemTypeBean extends DBVO {

    @Name
    @Comment("类型")
    String type;
    @Column
    @Comment("系统名称")
    String name;
    @Column
    @Comment("路径")
    String path;
    @Column
    String remarks;

}
