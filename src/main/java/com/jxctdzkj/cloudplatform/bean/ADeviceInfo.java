package com.jxctdzkj.cloudplatform.bean;

public class ADeviceInfo {

    private String name;

    private String address;

    private String lng;

    private String lat;

    private String temperature;

    private String humidity;

    private String time;

    @Override
    public String toString() {
        return "ADeviceInfo{" +
                "name='" + name + '\'' +
                ", address='" + address + '\'' +
                ", lng='" + lng + '\'' +
                ", lat='" + lat + '\'' +
                ", temperature='" + temperature + '\'' +
                ", humidity='" + humidity + '\'' +
                ", time='" + time + '\'' +
                '}';
    }

    public ADeviceInfo() {
    }

    public ADeviceInfo(String name, String address, String lng, String lat, String temperature, String humidity, String time) {
        this.name = name;
        this.address = address;
        this.lng = lng;
        this.lat = lat;
        this.temperature = temperature;
        this.humidity = humidity;
        this.time = time;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getLng() {
        return lng;
    }

    public void setLng(String lng) {
        this.lng = lng;
    }

    public String getLat() {
        return lat;
    }

    public void setLat(String lat) {
        this.lat = lat;
    }

    public String getTemperature() {
        return temperature;
    }

    public void setTemperature(String temperature) {
        this.temperature = temperature;
    }

    public String getHumidity() {
        return humidity;
    }

    public void setHumidity(String humidity) {
        this.humidity = humidity;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }
}
