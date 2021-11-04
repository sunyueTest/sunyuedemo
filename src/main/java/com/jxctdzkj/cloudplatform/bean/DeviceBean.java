package com.jxctdzkj.cloudplatform.bean;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Comment;
import org.nutz.dao.entity.annotation.Default;
import org.nutz.dao.entity.annotation.Id;
import org.nutz.dao.entity.annotation.Name;
import org.nutz.dao.entity.annotation.Table;

import java.io.Serializable;
import java.sql.Timestamp;

/**
 * <pre>
 *     author  : FlySand
 *     e-mail  : 1156183505@qq.com
 *     time    : 2018/8/1.
 *     desc    :
 *
 *     SCU30253T2b0e9897828ee628910cf14b1f6df3825b63b5b0f26b2
 * </pre>
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
@Table("network")
@JsonIgnoreProperties(value = {"password"})
public class DeviceBean implements Serializable {
    @Id
    @Column("Nid")
    private long id;
    /**
     * 设备号
     */
    @Name
    @Column("Ncode")
    private String deviceNumber;
    /**
     * 区域
     */
    @Column("Acode")
    private String aCode;
    @Column("Nmncode")
    private String mCode;
    @Column("Nname")
    private String name;
    @Column("Nycoordinate")
    private double longitude;
    @Column("Nxcoordinate")
    private double latitude;
    @Column("Nserson_type")
    private String type;
    @Column("Nsensor_data")
    private String data;
    @Column("Nrecord_time")
    private Timestamp time;
    @Column("Nversion")
    private int version;
    @Column("Nupip")
    private String ip;
    @Column("Nupport")
    private int port;
    @Column("Npathhttp")
    private String http;
    @Column("Nmake")
    private String make;
    @Column("Nfile")
    private String file;
    @Column("Nfiletag")
    private String fileTag;
    @Column("Ndetails")
    private String details;
    @Column("Nonlinestate")
    private int onLineState;
    @Column("Nintervaltag")
    private int intervalTag;
    @Column("Ninterval")
    private int interval;
    @Column("Nuser")
    private String userName;
    @Column("Npassword")
    private String password;
    @Column("device_type")
    @Comment("设备类型")
    @Default("0")
    private int deviceType;
    @Comment("模板id")
    @Column("template_id")
    private long templateId;
    @Column("creat_time")
    private Timestamp creatTime;
    @Column("use_count")
    long useCount;
    @Comment("到期时间")
    @Column("expiry_time")
    Timestamp expiryTime;
    @Column("subjection")
    @Comment("属于哪台服务器")
    private String subjection;
    private double Aqi;

    public Timestamp getCreatTime() {
        return creatTime;
    }

    public void setCreatTime(Timestamp creatTime) {
        this.creatTime = creatTime;
        if (creatTime != null) {
            //两年到期
            this.expiryTime = new Timestamp(720 * 24 * 60 * 60 * 1000l + creatTime.getTime());
            System.out.println(creatTime);
            System.out.println(expiryTime);
        }
    }

    public String getSubjection() {
        return subjection;
    }

    public void setSubjection(String subjection) {
        this.subjection = subjection;
    }

    public long getUseCount() {
        return useCount;
    }

    public void setUseCount(long useCount) {
        this.useCount = useCount;
    }

    public Timestamp getExpiryTime() {
        return expiryTime;
    }

    public void setExpiryTime(Timestamp expiryTime) {
        this.expiryTime = expiryTime;
    }

    public long getTemplateId() {
        return templateId;
    }

    public void setTemplateId(long templateId) {
        this.templateId = templateId;
    }

    public int getDeviceType() {
        return deviceType;
    }

    public void setDeviceType(int deviceType) {
        this.deviceType = deviceType;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getDeviceNumber() {
        return deviceNumber;
    }

    public void setDeviceNumber(String deviceNumber) {
        this.deviceNumber = deviceNumber;
    }

    public String getaCode() {
        return aCode;
    }

    public void setaCode(String aCode) {
        this.aCode = aCode;
    }

    public String getmCode() {
        return mCode;
    }

    public void setmCode(String mCode) {
        this.mCode = mCode;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public Timestamp getTime() {
        return time;
    }

    public void setTime(Timestamp time) {
        this.time = time;
    }

    public int getVersion() {
        return version;
    }

    public void setVersion(int version) {
        this.version = version;
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public int getPort() {
        return port;
    }

    public void setPort(int port) {
        this.port = port;
    }

    public String getHttp() {
        return http;
    }

    public void setHttp(String http) {
        this.http = http;
    }

    public String getMake() {
        return make;
    }

    public void setMake(String make) {
        this.make = make;
    }

    public String getFile() {
        return file;
    }

    public void setFile(String file) {
        this.file = file;
    }

    public String getFileTag() {
        return fileTag;
    }

    public void setFileTag(String fileTag) {
        this.fileTag = fileTag;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public int getOnLineState() {
        return onLineState;
    }

    public void setOnLineState(int onLineState) {
        this.onLineState = onLineState;
    }

    public int getIntervalTag() {
        return intervalTag;
    }

    public void setIntervalTag(int intervalTag) {
        this.intervalTag = intervalTag;
    }

    public int getInterval() {
        return interval;
    }

    public void setInterval(int interval) {
        this.interval = interval;
    }

    public double getAqi() {
        return Aqi;
    }

    public void setAqi(double aqi) {
        Aqi = aqi;
    }

    @Override
    public String toString() {
        return "DeviceBean{" +
                "id='" + id + '\'' +
                ", password='" + password + '\'' +
                ", deviceNumber='" + deviceNumber + '\'' +
                ", aCode='" + aCode + '\'' +
                ", mCode='" + mCode + '\'' +
                ", name='" + name + '\'' +
                ", longitude='" + longitude + '\'' +
                ", latitude='" + latitude + '\'' +
                ", type='" + type + '\'' +
                ", data='" + data + '\'' +
                ", time='" + time + '\'' +
                ", version=" + version +
                ", ip='" + ip + '\'' +
                ", port=" + port +
                ", http='" + http + '\'' +
                ", make='" + make + '\'' +
                ", file='" + file + '\'' +
                ", fileTag='" + fileTag + '\'' +
                ", details='" + details + '\'' +
                ", onLineState='" + onLineState + '\'' +
                ", intervalTag=" + intervalTag +
                ", interval=" + interval +
                '}';
    }
}
