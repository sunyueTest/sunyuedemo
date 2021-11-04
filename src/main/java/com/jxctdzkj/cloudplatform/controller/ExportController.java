package com.jxctdzkj.cloudplatform.controller;

import com.jxctdzkj.cloudplatform.bean.DeviceBean;
import com.jxctdzkj.cloudplatform.bean.SysUserBean;
import com.jxctdzkj.cloudplatform.exception.ServiceException;
import com.jxctdzkj.cloudplatform.utils.ControllerHelper;

import org.apache.commons.lang3.StringUtils;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRichTextString;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.nutz.dao.Dao;
import org.nutz.dao.Sqls;
import org.nutz.dao.sql.Sql;
import org.nutz.dao.sql.SqlCallback;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import javax.servlet.http.HttpServletResponse;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequestMapping({"export"})
@Controller
public class ExportController {

    @Autowired
    Dao dao;

    @RequestMapping(value = "")
    @ResponseBody
    public void Export( Integer year,String ncode, HttpServletResponse response){
        SysUserBean user = ControllerHelper.getInstance(dao).getLoginUser();
       /* if (user == null) {
            throw new ServiceException("用户未登录");
        }
        if (user.getLevel() > 0) {
            UserDeviceBean bean = dao.fetch(UserDeviceBean.class, Cnd.where("user_name", "=", user.getUserName()).and("ncode", "=", ncode).and("is_del", "=", "0"));
            if (bean == null) {
                throw new ServiceException("权限不足");
            }
        }*/

       if(StringUtils.isBlank(ncode)){
           throw new ServiceException("设备编号为空");
       }
       if(year==null){
           throw new ServiceException("年份为空");
       }
        //File zipFile = null;
        ZipOutputStream zoutput = null;
        try{
            zoutput = new ZipOutputStream(response.getOutputStream());
            //zipFile = File.createTempFile(ncode, ".zip");
        }catch(IOException e){
            log.error(e.toString(),e);

        }

        List<Map<String,String>> date= new ArrayList();
        Map<String,String> map1 =new HashMap<>();
        map1.put("from",year+"-01-01 00:00:00");
        map1.put("to",year+"-02-01 00:00:00");
        date.add(map1);
        Map<String,String> map2 =new HashMap<>();
        map2.put("from",year+"-02-01 00:00:00");
        map2.put("to",year+"-03-01 00:00:00");
        date.add(map2);
        Map<String,String> map3 =new HashMap<>();
        map3.put("from",year+"-03-01 00:00:00");
        map3.put("to",year+"-04-01 00:00:00");
        date.add(map3);
        Map<String,String> map4 =new HashMap<>();
        map4.put("from",year+"-04-01 00:00:00");
        map4.put("to",year+"-05-01 00:00:00");
        date.add(map4);
        Map<String,String> map5 =new HashMap<>();
        map5.put("from",year+"-05-01 00:00:00");
        map5.put("to",year+"-06-01 00:00:00");
        date.add(map5);
        Map<String,String> map6 =new HashMap<>();
        map6.put("from",year+"-06-01 00:00:00");
        map6.put("to",year+"-07-01 00:00:00");
        date.add(map6);
        Map<String,String> map7 =new HashMap<>();
        map7.put("from",year+"-07-01 00:00:00");
        map7.put("to",year+"-08-01 00:00:00");
        date.add(map7);
        Map<String,String> map8 =new HashMap<>();
        map8.put("from",year+"-08-01 00:00:00");
        map8.put("to",year+"-09-01 00:00:00");
        date.add(map8);
        Map<String,String> map9 =new HashMap<>();
        map9.put("from",year+"-09-01 00:00:00");
        map9.put("to",year+"-10-01 00:00:00");
        date.add(map9);
        Map<String,String> map10 =new HashMap<>();
        map10.put("from",year+"-10-01 00:00:00");
        map10.put("to",year+"-11-01 00:00:00");
        date.add(map10);
        Map<String,String> map11 =new HashMap<>();
        map11.put("from",year+"-11-01 00:00:00");
        map11.put("to",year+"-12-01 00:00:00");
        date.add(map11);
        Map<String,String> map12 =new HashMap<>();
        map12.put("from",year+"-12-01 00:00:00");
        map12.put("to",year+1+"-01-01 00:00:00");
        date.add(map12);

        for(Map map:date){
            Sql sql = Sqls.create("SELECT a.Nname,a.Ncode,a.Nserson_type,b.dsensor_data Nsensor_data,b.drecord_time Nrecord_time FROM netdevicedata b,network a where  b.drecord_time>= @from and b.drecord_time< @to and a.ncode=b.dcode and a.ncode=@ncode");
            Timestamp fromtime = Timestamp.valueOf(map.get("from")+"");
            Timestamp totime = Timestamp.valueOf(map.get("to")+"");
            sql.params().set("from", fromtime);
            sql.params().set("to", totime);
            sql.params().set("ncode", ncode);
            this.sqlCallBack(sql);
            dao.execute(sql);
            List<DeviceBean> list = sql.getList(DeviceBean.class);
            if(list==null ||list.size()==0){
                continue;
            }
            HSSFWorkbook workbook = new HSSFWorkbook();
            HSSFSheet sheet = workbook.createSheet("历史数据");
            //String fileName = "历史数据";//设置要导出的文件的名字
            //新增数据行，并且设置单元格数据
            int rowNum = 1;
            String[] headers = {"设备编码", "设备名称", "数据类型", "设备数据", "接收时间"};
            //headers表示excel表中第一行的表头
            HSSFRow row = sheet.createRow(0);
            //在excel表中添加表头
            for (int i = 0; i < headers.length; i++) {
                HSSFCell cell = row.createCell(i);
                HSSFRichTextString text = new HSSFRichTextString(headers[i]);
                cell.setCellValue(text);
            }

            //在表中存放查询到的数据放入对应的列
            for (DeviceBean deviceBean : list) {
                HSSFRow row1 = sheet.createRow(rowNum);
                row1.createCell(0).setCellValue(deviceBean.getDeviceNumber());
                row1.createCell(1).setCellValue(deviceBean.getName());
                row1.createCell(2).setCellValue(deviceBean.getType());
                row1.createCell(3).setCellValue(deviceBean.getData());
                row1.createCell(4).setCellValue(deviceBean.getTime());
                rowNum++;
            }

            try{
                ZipEntry entry = new ZipEntry(map.get("from") + ".xls");
                zoutput.putNextEntry(entry);
                workbook.write(zoutput);
                zoutput.flush();
                zoutput.closeEntry();
            }catch(IOException e){
                log.error(e.toString(),e);
            }
        }
        try{
            zoutput.close();
        }catch(IOException e){

        }

        response.setContentType("application/octet-stream");
        //如果输出的是中文名的文件，在此处就要用URLEncoder.encode方法进行处理
        response.setHeader("Content-Disposition", "attachment;filename=" +ncode);

    }

    private void sqlCallBack(Sql sql) {
        sql.setCallback(new SqlCallback() {
            public Object invoke(Connection conn, ResultSet rs, Sql sql) throws SQLException {
                List<DeviceBean> list = new LinkedList<DeviceBean>();
                while (rs.next()) {
                    DeviceBean d = new DeviceBean();
                    d.setName(rs.getString("Nname"));
                    d.setDeviceNumber(rs.getString("Ncode"));
                    d.setType(rs.getString("Nserson_type"));
                    d.setData(rs.getString("Nsensor_data"));
                    d.setTime(rs.getTimestamp("Nrecord_time"));
                    list.add(d);
                }
                return list;
            }
        });
    }

}
