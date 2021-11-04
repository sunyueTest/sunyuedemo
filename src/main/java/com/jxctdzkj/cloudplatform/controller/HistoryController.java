package com.jxctdzkj.cloudplatform.controller;

import com.jxctdzkj.cloudplatform.bean.*;
import com.jxctdzkj.cloudplatform.config.Constant;
import com.jxctdzkj.cloudplatform.exception.ServiceException;
import com.jxctdzkj.cloudplatform.utils.ControllerHelper;
import com.jxctdzkj.cloudplatform.utils.ReturnObject;
import com.jxctdzkj.cloudplatform.utils.SplitTableHelper;
import com.jxctdzkj.cloudplatform.utils.TranslationUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.hssf.usermodel.*;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.nutz.dao.Cnd;
import org.nutz.dao.Condition;
import org.nutz.dao.Dao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Timestamp;
import java.util.List;


@Slf4j
@RequestMapping({"history"})
@Controller
public class HistoryController {

    @Autowired
    Dao dao;

    @RequestMapping(value = "")
    public String index() {

        return "historyList";
    }

    @RequestMapping(value = "historyListWater")
    public String historyListWater() {

        return "monitor/historyListWetar";
    }

    @RequestMapping(value = "/getHistoryList")
    @ResponseBody
    public ReturnObject getHistoryList(int page, int limit, String deviceNumber, String ncode, String from, String to) {
        ReturnObject result = new ReturnObject();
        result.setCode(0);
        SysUserBean user = ControllerHelper.getInstance(dao).getLoginUser();
        Timestamp fromTime;
        Timestamp toTime;
        try {
            fromTime = Timestamp.valueOf(from);
        } catch (Exception e) {
            fromTime = new Timestamp(System.currentTimeMillis() - 1000 * 60 * 60 * 24);
            log.warn(e.getMessage());
        }
        try {
            toTime = Timestamp.valueOf(to);
        } catch (Exception e) {
            toTime = new Timestamp(System.currentTimeMillis());
            log.warn(e.getMessage());
        }
        /*if(StringUtils.isBlank(from)){

            fromTime = new Timestamp(System.currentTimeMillis()-1000*60*60*24);
        }else{

        }*/
       /* if(StringUtils.isBlank(to)){
            toTime = new Timestamp(System.currentTimeMillis());//时间可能与数据库时间不一致
        }else{


        }*/
        if (StringUtils.isBlank(ncode)) {//页面初始化加载的查询逻辑

            if (StringUtils.isNotBlank(deviceNumber)) {
                ncode = deviceNumber;
            } else {
                //获取用户名下第一个
                UserDeviceBean bean = dao.fetch(UserDeviceBean.class);
                if (bean != null)
                    ncode = bean.getDeviceNumber();
            }
            //判断用户是否管理员，管理员查所有设备。非管理员查绑定设备
          /* if(user.getLevel()<1){//管理员
               Sql sql = Sqls.create("SELECT a.Nname,a.Ncode,a.Nserson_type,b.dsensor_data Nsensor_data,b.drecord_time Nrecord_time FROM netdevicedata b,network a where  a.ncode=b.dcode and b.drecord_time>= @from ");
               this.sqlCallBack(sql);
               sql.params().set("from", fromTime);
               sql.setPager(pager);
               dao.execute(sql);
              List<DeviceBean> list = sql.getList(DeviceBean.class);
              result.setData(list);
              if(list==null || list.size()==0){
                  result.setCount(0);
                  return result;
              }
           
              Sql count = Sqls.create("SELECT count(1) FROM netdevicedata b where  b.drecord_time>= @from ");
               count.setCallback(Sqls.callback.integer());
               count.params().set("from", fromTime);
               dao.execute(count);
               result.setCount(count.getInt());

           }else{//非管理员用户
               Sql sql = Sqls.create("SELECT a.Nname,a.Ncode,a.Nserson_type,b.dsensor_data Nsensor_data,b.drecord_time Nrecord_time FROM netdevicedata b, sys_user_to_devcie c,network a where  a.ncode=b.dcode and a.ncode=c.ncode  and b.drecord_time>= @from and c.user_name =@userName ");
               this.sqlCallBack(sql);
               sql.params().set("from", fromTime);
              sql.params().set("userName", user.getUserName());
              sql.setPager(pager);
              dao.execute(sql);
               List<DeviceBean> list = sql.getList(DeviceBean.class);
              result.setData(list);
               if(list==null || list.size()==0){
                   result.setCount(0);
                   return result;
               }
               Sql count = Sqls.create("SELECT count(1) FROM netdevicedata b  where exists (select c.ncode from sys_user_to_devcie c where b.dcode=c.ncode and c.user_name=@userName)  and  b.drecord_time>= @from");
               count.setCallback(Sqls.callback.integer());
               count.params().set("from", fromTime);
               count.params().set("userName", user.getUserName());
              dao.execute(count);
             
              result.setCount(count.getInt());
          }*/

        }//else{
        if (user.getLevel() >= 1) {
            UserDeviceBean device = dao.fetch(UserDeviceBean.class, Cnd.where("ncode", "=", ncode).and("user_name", "=", user.getUserName()));
            if (device == null) {
                return result;
            }
        }
        /*Sql sql = Sqls.create("SELECT a.Nname,a.Ncode,a.Nserson_type,b.dsensor_data Nsensor_data,b.drecord_time Nrecord_time FROM netdevicedata b,network a where    b.drecord_time>= @from and b.drecord_time<= @to and a.ncode=b.dcode and a.ncode=@ncode");
        sql.params().set("from", fromTime);
        sql.params().set("to", toTime);
        sql.params().set("ncode", ncode);
        this.sqlCallBack(sql);
        sql.setPager(pager);
        dao.execute(sql);*/
        Condition cnd = Cnd.where("Drecord_time", ">", fromTime).and("Drecord_time", "<", toTime).and("Dcode", "=", ncode).desc("Did");
        long count = SplitTableHelper.getCount(NetDevicedata.class, cnd, fromTime, toTime);
        if (count == 0) {
            result.setCount(0);
            return result;
        }
        result.setCount(count);

        DeviceBean deviceBean = dao.fetch(DeviceBean.class, ncode);
        if (deviceBean == null) {
            return result;
        }
        List<NetDevicedata> devicedata = SplitTableHelper.queryForDate(NetDevicedata.class, cnd, fromTime, toTime, page, limit);
        for (int i = 0; i < devicedata.size(); i++) {
            NetDevicedata netDevicedata = devicedata.get(i);
            netDevicedata.setId(limit * (page - 1) + i + 1);
            netDevicedata.setSensorData(getAnalysisData(deviceBean.getType(), netDevicedata.getSensorData()));
        }
//        sql.getList(DeviceBean.class);
        result.setData(devicedata);

//        Sql count = Sqls.create("SELECT count(1) FROM netdevicedata b where  b.drecord_time>= @from and b.drecord_time<= @to and b.dcode=@ncode");
//        count.setCallback(Sqls.callback.integer());
//        count.params().set("from", fromTime);
//        count.params().set("to", toTime);
//        count.params().set("ncode", ncode);
//        dao.execute(count);
//        result.setCount(count.getInt());
        //}
        result.setSuccess(true);
        return result;
    }

    @RequestMapping(value = "/historyExport")
    public String historyExport(HttpServletResponse response, String ncode, String from, String to, HttpServletRequest request) throws IOException {

        if (StringUtils.isBlank(ncode)) {
            log.error("设备号为空");
            return "redirect:../index";
        }
        if (StringUtils.isBlank(from)) {
            log.error("起始时间为空");
            return "redirect:../index";
        }
        if (StringUtils.isBlank(to)) {
            log.error("结束时间为空");
            return "redirect:../index";
        }
        //验证设备是否属于用户。
        SysUserBean user = ControllerHelper.getInstance(dao).getLoginUser();
        if (user == null) {
            log.error("用户未登录");
            return "redirect:../doLogin";
        }
        if (user.getLevel() > 0) {
            UserDeviceBean bean = dao.fetch(UserDeviceBean.class, Cnd.where("user_name", "=", user.getUserName()).and("ncode", "=", ncode).and("is_del", "=", "0"));
            if (bean == null) {
                throw new ServiceException("权限不足");
            }
        }

        Timestamp fromTime = Timestamp.valueOf(from);
        Timestamp toTime = Timestamp.valueOf(to);
        Timestamp timestamp = new Timestamp(System.currentTimeMillis() - (6 * 30 * 24 * 60 * 60 * 1000l));
        DeviceBean deviceBean = dao.fetch(DeviceBean.class, ncode);
        if (deviceBean == null) {
            throw new ServiceException("设备不存在");
        }
        if (fromTime.getTime() < timestamp.getTime()) {
            fromTime = timestamp;
        }
        if (deviceBean.getCreatTime() != null && fromTime.getTime() < deviceBean.getCreatTime().getTime()) {
            fromTime = deviceBean.getCreatTime();
        }
        Condition cnd = Cnd.where("Drecord_time", ">", fromTime).and("Drecord_time", "<", toTime).and("Dcode", "=", ncode).desc("Did");
        List<NetDevicedata> list = SplitTableHelper.queryForDate(NetDevicedata.class, cnd, fromTime, toTime, 1, 50000);

//        Sql sql = Sqls.create("SELECT a.Nname,a.Ncode,a.Nserson_type,b.dsensor_data Nsensor_data,b.drecord_time Nrecord_time FROM netdevicedata b,network a where  b.drecord_time>= @from and b.drecord_time<= @to and a.ncode=b.dcode and a.ncode=@ncode");
//        sql.params().set("from", fromtime);
//        sql.params().set("to", totime);
//        sql.params().set("ncode", ncode);
//        this.sqlCallBack(sql);
//        dao.execute(sql);
//        List<DeviceBean> list = sql.getList(DeviceBean.class);
        HSSFWorkbook workbook = new HSSFWorkbook();
        HSSFSheet sheet = workbook.createSheet(ncode + "历史数据");
        String fileName = ncode + "历史数据";//设置要导出的文件的名字
        //新增数据行，并且设置单元格数据
        int rowNum = 1;

        Cookie[] cookies = request.getCookies();
        String language = "";
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                String name = cookie.getName();
                if (Constant.COOKIE_LANG.equals(name)) {
                    language = cookie.getValue();
                    break;
                }
            }
        }

        int headerCount = 4;
        String[] typeArr = {};
        if (!StringUtils.isEmpty(deviceBean.getType())) {
            typeArr = deviceBean.getType().split("/");
            headerCount += typeArr.length * 2;
        }

        String[] headers = new String[headerCount];
        if (language.equals("en")) {
            headers[0] = "Number";
            headers[1] = "Device Name";
            headers[2] = "Device Number";
            headers[3] = "Receive Time";
            int j = 0;
            try {
                for (int i = 4; i < headers.length; i += 2) {
                    if (j < typeArr.length) {
                        String enHeader = "";
                        SensorTypeBean sensorTypeBean = dao.fetch(SensorTypeBean.class, Cnd.where("tname", "=", typeArr[j].trim()));
                        if (sensorTypeBean != null) {
                            if (StringUtils.isBlank(sensorTypeBean.getEnName())) {
                                enHeader = getEnHeaderStr(typeArr[j].trim());
                                sensorTypeBean.setEnName(enHeader);
                                dao.update(sensorTypeBean);
                            } else {
                                enHeader = sensorTypeBean.getEnName();
                            }
                        } else {
                            enHeader = getEnHeaderStr(typeArr[j].trim());
                        }

                        headers[i] = enHeader;
                        headers[i + 1] = "unit";
                        j++;
                    }
                }
            } catch (Exception e) {
                log.warn(e.getMessage());
            }
        } else {
            headers[0] = "序号";
            headers[1] = "设备名称";
            headers[2] = "设备编号";
            headers[3] = "接收时间";
            int j = 0;
            for (int i = 4; i < headers.length; i += 2) {
                if (j < typeArr.length) {
                    headers[i] = typeArr[j];
                    headers[i + 1] = "单位";
                    j++;
                }
            }
        }
        //headers表示excel表中第一行的表头
        HSSFRow row = sheet.createRow(0);
        //在excel表中添加表头
        for (int i = 0; i < headers.length; i++) {
            HSSFCell cell = row.createCell(i);
            HSSFRichTextString text = new HSSFRichTextString(headers[i]);
            cell.setCellValue(text);
            cell.getCellStyle().setAlignment(HorizontalAlignment.CENTER);
            switch (i) {
                case 1:
                    cell.getSheet().setColumnWidth(i, 5000);
                    break;
                case 2:
                    cell.getSheet().setColumnWidth(i, 5000);
                    break;
                default:
                    cell.getSheet().setColumnWidth(i, 3000);
            }
        }

        //在表中存放查询到的数据放入对应的列
        for (NetDevicedata netDevicedata : list) {
            HSSFRow row1 = sheet.createRow(rowNum);
            String time = netDevicedata.getDrecordTime().toString();
            row1.createCell(0).setCellValue(rowNum);
            row1.createCell(1).setCellValue(deviceBean.getName());
            row1.createCell(2).setCellValue(netDevicedata.getDeviceNumber());
            row1.createCell(3).setCellValue(time.substring(0, time.lastIndexOf(".")));

            String[] datas = {};
            if (!StringUtils.isEmpty(deviceBean.getType())) {
                datas = netDevicedata.getSensorData().split("\\|");

                int j = 0;
                for (int i = 4; i < headers.length; i += 2) {
                    if (j < typeArr.length) {
                        try {//改模越界问题
                            String[] datasStr = datas[j].trim().split("\\s+");
                            row1.createCell(i).setCellValue(datasStr[0]);
                            if (datasStr.length < 2) {
                                if (language.equals("zh")) {
                                    row1.createCell(i + 1).setCellValue("无");
                                } else {
                                    row1.createCell(i + 1).setCellValue("none");
                                }
                            } else {
                                row1.createCell(i + 1).setCellValue(datasStr[1]);
                            }
                        } catch (Exception e) {
//                        log.info(e.toString(),e);
                        }
                        j++;
                    }
                }
            }
            rowNum++;
        }
        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/octet-stream");
        response.setHeader("Content-disposition", "attachment;filename=" + new String(fileName.getBytes("gbk"), "iso8859-1") + ".xls");
        //response.setHeader("Content-disposition", "attachment;filename=" + fileName);
        response.flushBuffer();
        workbook.write(response.getOutputStream());

        return null;
    }

    private String getEnHeaderStr(String cnHeaderStr) throws Exception {

        String enHeader = TranslationUtils.getTranslationStr(cnHeaderStr);
        if (StringUtils.isBlank(enHeader)) {
            return cnHeaderStr;
        }
        return enHeader;
    }

    public static String getAnalysisData(String type, String value) {

        if (StringUtils.isEmpty(value)) {
            return "";
        }
        String[] types = {};
        if (!StringUtils.isEmpty(type)) {
            types = type.split("/");
        }
        String[] datas = value.split("\\|");
        String data = "";
        for (int j = 0; j < datas.length; j++) {
            if (types.length > j) {
                data += types[j].replace(" ", "") + "·" + datas[j].replace(" ", "");
            } else {
                data += datas[j];
            }
            if (j < datas.length - 1) {
                data += " | ";
            }
        }
        return data;
    }
}
