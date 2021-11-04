package com.jxctdzkj.cloudplatform.bean;

import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Table;

/**
 * 水产养殖-鱼技服务-自助诊断-品类-病发部位
 */
@Table("aquaculture_self_diagnosis_ministries")
public class AquacultureSelfDiagnosisMinistriesBean extends DBVO{

    // 品类id
    @Column("self_diagnosis_id")
    private int selfDiagnosisId;

    // 病发部位
    @Column("ministries")
    private String ministries;

    // 病发部位id
    @Column("ministries_id")
    private String ministriesId;

    public int getSelfDiagnosisId() {
        return selfDiagnosisId;
    }

    public void setSelfDiagnosisId(int selfDiagnosisId) {
        this.selfDiagnosisId = selfDiagnosisId;
    }

    public String getMinistries() {
        return ministries;
    }

    public void setMinistries(String ministries) {
        this.ministries = ministries;
    }

    public String getMinistriesId() {
        return ministriesId;
    }

    public void setMinistriesId(String ministriesId) {
        this.ministriesId = ministriesId;
    }
}
