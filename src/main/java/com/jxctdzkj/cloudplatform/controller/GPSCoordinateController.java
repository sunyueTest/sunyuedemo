package com.jxctdzkj.cloudplatform.controller;

import org.nutz.http.Header;
import org.nutz.http.Http;
import org.nutz.http.Response;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;

/**
 * <pre>
 *     @author  : FlySand
 *     @e-mail  : 1156183505@qq.com
 *     @time    : 2019/9/10.
 *     @desc    : GPS转高德点
 *     @http://www.gpsspg.com/maps.htm
 * </pre>
 */
@Slf4j
@RestController
@RequestMapping("coordinate")
public class GPSCoordinateController {


    @RequestMapping("convert")
    public Object convert(@RequestParam String lat, @RequestParam String lng) {
        Header header = Header.create();
        header.set("Referer", "http://www.gpsspg.com/iframe/maps/");
        Response response = Http.get("http://www.gpsspg.com/apis/maps/geo/?output=jsonp&lat=" + lat + "&lng=" + lng + "&type=0&callback=jQuery110207554451303597871_1568087341795&_=1568087341818", header, 3000);
        String body = response.getContent();
        log.info(body);
        return "var coordinateData=" + body.substring(body.indexOf("("), body.length());
    }
    /**
     *


     //t =24 40.3164
     function getHMSXY(s) {
     s = s.toString();
     let a, v, i, x, t, c;
     c = s.split(".")[1];
     t = s.split(".")[0] + " " + c.substring(0, 2) + "." + c.substring(2, c.length);
     a = t.split(" ");
     v = 0;
     for (i = 0; i < a.length; i++) {
     if (i == 0) {
     v = parseInt(a[i]);
     x = v;
     }
     if (x >= 0) {
     if (i == 1) {
     v = v + (parseFloat(a[i]) / 60);
     }
     if (i == 2) {
     v = v + (parseFloat(a[i]) / 3600);
     }
     } else {
     if (i == 1) {
     v = v - (parseFloat(a[i]) / 60);
     }
     if (i == 2) {
     v = v - (parseFloat(a[i]) / 3600);
     }
     }
     }
     v = v.toFixed(8);
     return v;
     }




     *
     *
     */
}
