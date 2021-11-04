package com.jxctdzkj.cloudplatform.bean;

import com.alibaba.fastjson.JSONArray;
import lombok.Data;
import lombok.ToString;
import org.nutz.dao.entity.annotation.*;

/**
 * @Description 动态表的数据统计信息
 * @Author chanmufeng
 * @Date 2019/7/2 13:11
 **/
@Table("dynamic_table_statistics")
public class DynamicTableStatisticsBean extends DBVO {

    // 创建者
    @Column("user_name")
    private String userName;

    @Comment("对应的栏目id（sys_rights）")
    @Column("right_id")
    private Integer rightId;

    @Comment("针对该栏目的表，当前用户使用的列数（最多不能超过20列）")
    @Column("used_cols_num")
    private Integer usedColsNum;

    @Comment("记录表中列的排列方式")
    @Column("pattern")
    private String pattern;

    @Comment("json格式记录表中单元格的样式信息")
    @Column("style")
    private String style;

    public JSONArray getStyle() throws Exception {
        return JSONArray.parseArray(style);
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Integer getRightId() {
        return rightId;
    }

    public void setRightId(Integer rightId) {
        this.rightId = rightId;
    }

    public Integer getUsedColsNum() {
        return usedColsNum;
    }

    public void setUsedColsNum(Integer usedColsNum) {
        this.usedColsNum = usedColsNum;
    }

    public String getPattern() {
        return pattern;
    }

    public void setPattern(String pattern) {
        this.pattern = pattern;
    }

    public void setStyle(String style) {
        this.style = style;
    }

    @Override
    public String toString() {
        return "DynamicTableStatisticsBean{" +
                "userName='" + userName + '\'' +
                ", rightId=" + rightId +
                ", usedColsNum=" + usedColsNum +
                ", pattern='" + pattern + '\'' +
                ", style='" + style + '\'' +
                ", id=" + id +
                '}';
    }
}
