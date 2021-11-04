package com.jxctdzkj.cloudplatform.mode;

import java.io.Serializable;

public class AqiMode implements Serializable {
    private static final long serialVersionUID = 1L;
    private String name;

    private Double aqi;

    public AqiMode(String name, Double aqi) {
        super();
        this.name = name;
        this.aqi = aqi;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getAqi() {
        return aqi;
    }

    public void setAqi(Double aqi) {
        this.aqi = aqi;
    }

    @Override
    public String toString() {
        return "Aqi{" +
                "name='" + name + '\'' +
                ", aqi=" + aqi +
                '}';
    }
}
