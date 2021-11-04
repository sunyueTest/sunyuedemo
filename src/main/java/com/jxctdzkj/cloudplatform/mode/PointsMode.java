package com.jxctdzkj.cloudplatform.mode;

public class PointsMode {

    private int count;
    private double lat;
    private double lng;

    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }

    public double getLat() {
        return lat;
    }

    public void setLat(double lat) {
        this.lat = lat;
    }

    public double getLng() {
        return lng;
    }

    public void setLng(double lng) {
        this.lng = lng;
    }

    @Override
    public String toString() {
        return "PointsMode{" +
                "count=" + count +
                ", lat=" + lat +
                ", lng=" + lng +
                '}';
    }
}
