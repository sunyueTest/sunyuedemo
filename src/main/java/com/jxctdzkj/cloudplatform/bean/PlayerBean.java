package com.jxctdzkj.cloudplatform.bean;

import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Comment;
import org.nutz.dao.entity.annotation.Table;

/**
 * 视频表
 * @User 李英豪
 */
@Table("player")
public class PlayerBean extends DBVO {

    @Column("title")
    @Comment("视频标题")
    private String title;

    @Column("player_url")
    @Comment("视频路径")
    private String playerUrl;

    @Column("type")
    @Comment("类别")
    private String type;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getPlayerUrl() {
        return playerUrl;
    }

    public void setPlayerUrl(String playerUrl) {
        this.playerUrl = playerUrl;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
