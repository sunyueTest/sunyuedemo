package com.jxctdzkj.cloudplatform.bean;

import org.nutz.dao.entity.annotation.Column;
import org.nutz.dao.entity.annotation.Table;

/**
 * 水产养殖-鱼技服务-自助诊断-品类-症状描述
 */
@Table("aquaculture_self_diagnosis_portrayal")
public class AquacultureSelfDiagnosisPortrayalBean extends DBVO{

    // 病发部位id
    @Column("ministries_id")
    private String ministriesId;

    // 品类id
    @Column("self_diagnosis_id")
    private int selfDiagnosisId;

    // 症状id
    @Column("portrayal_id")
    private int portrayalId;

    // 症状描述
    @Column("portrayal")
    private String portrayal;

    public String getMinistriesId() {
        return ministriesId;
    }

    public void setMinistriesId(String ministriesId) {
        this.ministriesId = ministriesId;
    }

    public int getSelfDiagnosisId() {
        return selfDiagnosisId;
    }

    public void setSelfDiagnosisId(int selfDiagnosisId) {
        this.selfDiagnosisId = selfDiagnosisId;
    }

    public int getPortrayalId() {
        return portrayalId;
    }

    public void setPortrayalId(int portrayalId) {
        this.portrayalId = portrayalId;
    }

    public String getPortrayal() {
        return portrayal;
    }

    public void setPortrayal(String portrayal) {
        this.portrayal = portrayal;
    }
}
