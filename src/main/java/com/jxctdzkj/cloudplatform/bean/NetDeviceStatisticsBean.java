package com.jxctdzkj.cloudplatform.bean;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import org.nutz.dao.entity.annotation.ColDefine;
import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Id;
import org.nutz.dao.entity.annotation.Table;

import java.sql.Timestamp;

@Data
@Table("netdevice_statistics${cid}")
public class NetDeviceStatisticsBean {

    @Id
    @Column("Did")
    private long id;

    @ColDefine(notNull = true)
    @Column("Dcode")
    private String deviceNumber;

    @Column("Donline_time")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Timestamp onlineTime;

    @Column("Doffline_time")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Timestamp offlineTime;
}
