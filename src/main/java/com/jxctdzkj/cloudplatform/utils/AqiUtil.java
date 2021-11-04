package com.jxctdzkj.cloudplatform.utils;

import com.jxctdzkj.cloudplatform.mode.AqiMode;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

/** 
 * @ClassName: AqiUtil 
 * @Description: 计算aqi的值
 * @author jiangya
 * @date 2018年12月14日 上午10:29:35 
 *  
 */
public class AqiUtil {
    /**
     *  
     *
     * @Title: getPollutionDegree 
     * @Description: 计算aqi值对应的等级
     * @param @param
     *            aqi
     * @param @return
     * @return int   @throws 
     */
    public static int getPollutionDegree(Double aqi) {
        int pollutionDegree = 1;
        if (aqi <= 50) {
            pollutionDegree = 1;
        } else if (aqi > 50 && aqi <= 100) {
            pollutionDegree = 2;
        } else if (aqi > 100 && aqi <= 150) {
            pollutionDegree = 3;
        } else if (aqi > 150 && aqi <= 200) {
            pollutionDegree = 4;
        } else if (aqi > 200 && aqi <= 300) {
            pollutionDegree = 5;
        } else if (aqi > 300) {
            pollutionDegree = 6;
        }
        return pollutionDegree;
    }

    /**
     *  
     *
     * @Title: getDegree 
     * @Description: 计算aqi值对应的等级
     * @param @param
     *            pollutionDegree
     * @param @return
     * @return String   @throws 
     */
    public static String getDegree(int pollutionDegree) {
        if (pollutionDegree == 1) {
            return "优";
        } else if (pollutionDegree == 2) {
            return "良";
        } else if (pollutionDegree == 3) {
            return "轻度污染";
        } else if (pollutionDegree == 4) {
            return "中度污染";
        } else if (pollutionDegree == 5) {
            return "重度污染";
        } else if (pollutionDegree == 6) {
            return "严重污染";
        }
        return "数据错误";
    }

    /**
     * 计算每种污染物项目 P的空气质量分指数
     *
     * @param cp
     *            污染物项目P的质量浓度
     * @param r
     *            污染物项目P所在数组中的行号
     * @return
     */
    public static double countPerIaqi(double cp, int r) {
        double bph = 0; // 与 cp相近的污染物浓度限值的高位值
        double bpl = 0; // 与 cp相近的污染物浓度限值的低位值
        double iaqih = 0; // 与 bph对应的空气质量分指数
        double iaqil = 0; // 与 bpl对应的空气质量分指数
        double iaqip = 0; // 当前污染物项目P的空气质量分指数
        // 空气质量分指数及对应的污染物项目浓度限值
        int[][] aqiArr = { { 0, 50, 100, 150, 200, 300, 400, 500 }, { 0, 35, 75, 115, 150, 250, 350, 500 },
                { 0, 50, 150, 250, 350, 420, 500, 600 }, { 0, 2, 4, 14, 24, 36, 48, 60 },
                { 0, 40, 80, 180, 280, 565, 750, 940 }, { 0, 160, 200, 300, 400, 800, 1000, 1200 },
                { 0, 50, 150, 475, 800, 1600, 2100, 2620 }, {0,100,160,215,265,800}};

        double min = aqiArr[r][0];
        int index= aqiArr[r].length-1;
        double max = aqiArr[r][index];
        if (cp<=min || cp>=max){
            return 0;
        }else {
            // 对每种污染物的bph、bpl、iaqih、iaqil进行赋值
            for (int i = r; i < r + 1; i++) {
                for (int j = 0; j < aqiArr[0].length; j++) {
                    if (cp < aqiArr[i][j]) {
                        bph = aqiArr[i][j];
                        bpl = aqiArr[i][j - 1];
                        iaqih = aqiArr[0][j];
                        iaqil = aqiArr[0][j - 1];
                        break;
                    }
                }
            }
            // 计算污染物项目 P的空气质量分指数
            iaqip = (iaqih - iaqil) / (bph - bpl) * (cp - bpl) + iaqil;
            BigDecimal bg = new BigDecimal(Math.ceil(iaqip));
            double f1 = bg.setScale(0, BigDecimal.ROUND_HALF_UP).doubleValue();
            return f1;
        }
    }

    /**
     * 根据提供污染物的各项指标，对AQI进行计算
     *
     * @param pmtw
     *            PM2.5
     * @param pmte
     *            PM10
     * @param co
     *            一氧化碳浓度
     * @param no2
     *            二氧化氮浓度
     * @param o3
     *            臭氧浓度
     * @param so2
     *            二氧化硫浓度
     * @return
     */
    public static AqiMode CountAqi(double pmtw, double pmte, double co, double no2, double o3, double so2 ) {
        double pmtwIaqi = getPm25IAQI(pmtw);
        double pmteIaqi = getPm10IAQI(pmte);
        double coIaqi = getCoIAQI(co);
        double no2Iaqi = getNo2IAQI(no2);
        double o3Iaqi = getO3OneHourIAQI(o3);
        double so2Iaqi = getSo2IAQI(so2);
        // 初始化对象数组
        List<AqiMode> aList = new ArrayList<AqiMode>();
        if(pmtwIaqi != 0){
            aList.add(new AqiMode("PM2.5", pmtwIaqi));
        }
        if(pmteIaqi != 0){
            aList.add(new AqiMode("PM10", pmteIaqi));
        }
        if(coIaqi != 0){
            aList.add(new AqiMode("CO", coIaqi));
        }
        if(no2Iaqi != 0){
            aList.add(new AqiMode("NO2", no2Iaqi));
        }

        if(o3Iaqi != 0){
            aList.add(new AqiMode("O3", o3Iaqi));
        }
        if(so2Iaqi != 0){
            aList.add(new AqiMode("SO2", so2Iaqi));
        }
        Collections.sort(aList, new AqiComparator());
        AqiMode aqiMode = null;
        if(aList.size() > 0){
            aqiMode = aList.get(aList.size() - 1);
        }
        return aqiMode;
    }
    public static AqiMode CountAqi(double pmtw, double pmte, double co, double no2, double o3, double so2, double o3Eight) {
        double pmtwIaqi = getPm25IAQI(pmtw);
        double pmteIaqi = getPm10IAQI(pmte);
        double coIaqi = getCoIAQI(co);
        double no2Iaqi = getNo2IAQI(no2);
        double o3Iaqi = getO3OneHourIAQI(o3);
        double so2Iaqi = getSo2IAQI(so2);
        double o3EightHourIAQI = getO3EightHourIAQI(o3Eight);
        // 初始化对象数组
        List<AqiMode> aList = new ArrayList<AqiMode>();
        if(pmtwIaqi != 0){
            aList.add(new AqiMode("PM2.5", pmtwIaqi));
        }
        if(pmteIaqi != 0){
            aList.add(new AqiMode("PM10", pmteIaqi));
        }
        if(coIaqi != 0){
            aList.add(new AqiMode("CO", coIaqi));
        }
        if(no2Iaqi != 0){
            aList.add(new AqiMode("NO2", no2Iaqi));
        }

        if(o3Iaqi != 0){
            aList.add(new AqiMode("O3", o3Iaqi));
        }
        if(o3EightHourIAQI != 0){
            aList.add(new AqiMode("o3EightHour", o3EightHourIAQI));
        }
        if(so2Iaqi != 0){
            aList.add(new AqiMode("SO2", so2Iaqi));
        }
        Collections.sort(aList, new AqiComparator());
        AqiMode aqiMode = null;
        if(aList.size() > 0){
            aqiMode = aList.get(aList.size() - 1);
        }
        return aqiMode;
    }

    public static double getCoIAQI(double co){
        if(co > 0){
            return  countPerIaqi(co, 3);
        }
        return 0;
    }

    public static double getNo2IAQI(double no2){
        if(no2 > 0){
            long round = Math.round(no2);
            return countPerIaqi(round,  4);
        }
        return 0;
    }

    public static double  getO3OneHourIAQI(double o3One){
        if(o3One > 0){
            long round = Math.round(o3One);
            return countPerIaqi(round,  5);
        }
        return 0;
    }

    public static double getO3EightHourIAQI(double o3Eight){
        if(o3Eight > 0 && o3Eight <= 800){
            long round = Math.round(o3Eight);
            return countPerIaqi(round, 7);
        }
        return 0;
    }

    public static double getPm10IAQI(double pmte){
        if(pmte > 0){
            long round = Math.round(pmte);
            return countPerIaqi(round, 2);
        }
        return 0;
    }

    public static double getPm25IAQI(double pmtw){
        if(pmtw > 0){
            long round = Math.round(pmtw);
            return countPerIaqi(round, 1);
        }
        return 0;

    }

    public static double getSo2IAQI(double so2){
        if(so2 > 0){
            long round = Math.round(so2);
            return countPerIaqi(round, 6);
        }
        return 0;

    }
}

/**
 * 构造分类器类，对AQI对象链表进行排序
 */
class AqiComparator implements Comparator {
    public int compare(Object o1, Object o2) {
        AqiMode a1 = (AqiMode) o1;
        AqiMode a2 = (AqiMode) o2;
        double result = a1.getAqi() - a2.getAqi();
        return (int) result;
    }
}
