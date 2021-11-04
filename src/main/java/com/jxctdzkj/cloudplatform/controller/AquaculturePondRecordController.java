package com.jxctdzkj.cloudplatform.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.jxctdzkj.cloudplatform.bean.*;
import com.jxctdzkj.cloudplatform.config.Constant;
import com.jxctdzkj.cloudplatform.opLog.EnableOpLog;
import com.jxctdzkj.cloudplatform.utils.ControllerHelper;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.dao.Sqls;
import org.nutz.dao.pager.Pager;
import org.nutz.dao.sql.Sql;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

@Controller
@Slf4j
@RequestMapping({"aquaculturePondRecord"})
public class AquaculturePondRecordController {

    @Autowired
    Dao dao;

    @RequestMapping("")
    public String index() {
        return "aquaculture/pondRecord/pondRecordList";
    }

    @RequestMapping("addPond")
    @EnableOpLog(Constant.ModifyType.SAVE)
    public ModelAndView addPond(Integer id) {
        if (id == null) {
            return new ModelAndView("aquaculture/pondRecord/addPond", "data", new AquaculturePondRecordHeaderBean());
        }
        AquaculturePondRecordHeaderBean header = dao.fetch(AquaculturePondRecordHeaderBean.class, id);
        if (header == null) {
            header = new AquaculturePondRecordHeaderBean();
        }
        return new ModelAndView("aquaculture/pondRecord/addPond", "data", header);
    }

    @RequestMapping("savePond")
    @ResponseBody
    @EnableOpLog(Constant.ModifyType.SAVE)
    public ResultObject savePond(AquaculturePondRecordHeaderBean header) {
        String userName = ControllerHelper.getLoginUserName();
        if (StringUtils.isBlank(userName)) {
            return ResultObject.error("用户未登录");
        }
        header.setUserName(userName);
        if (header.getId() == null) {
            dao.insert(header);
            return ResultObject.ok("添加成功");
        } else {
            dao.update(header);
            return ResultObject.ok("修改成功");
        }
    }

    @RequestMapping("deletePond")
    @ResponseBody
    @EnableOpLog(Constant.ModifyType.DELETE)
    public ResultObject deletePond(Integer id) {
        dao.delete(AquaculturePondRecordHeaderBean.class, id);
        return ResultObject.ok();
    }

    @RequestMapping("addRecord")
    public ModelAndView addRecord(Integer id) {
        if (id == null) {
            return new ModelAndView("aquaculture/pondRecord/addRecord", "data", new AquaculturePondRecordDetailBean());
        }
        AquaculturePondRecordDetailBean detail = dao.fetch(AquaculturePondRecordDetailBean.class, id);
        if (detail == null) {
            detail = new AquaculturePondRecordDetailBean();
        }
        return new ModelAndView("aquaculture/pondRecord/addRecord", "data", detail);
    }

    @RequestMapping("saveRecord")
    @ResponseBody
    public ResultObject saveRecord(AquaculturePondRecordDetailBean detail) {
        String userName = ControllerHelper.getLoginUserName();
        if (StringUtils.isBlank(userName)) {
            return ResultObject.error("用户未登录");
        }
        if (detail.getId() == null) {
            dao.insert(detail);
            return ResultObject.ok("添加成功");
        } else {
            dao.update(detail);
            return ResultObject.ok("修改成功");

        }
    }

    @RequestMapping("deleteRecord")
    @ResponseBody
    public ResultObject deleteRecord(Integer id) {
        dao.delete(AquaculturePondRecordDetailBean.class, id);
        return ResultObject.ok();
    }

    @RequestMapping("getPondList")
    @ResponseBody
    public ResultObject getPondList() {
        String userName = ControllerHelper.getLoginUserName();
        List<AquaculturePondRecordHeaderBean> data = dao.query(AquaculturePondRecordHeaderBean.class, Cnd.where("user_name", "=", userName));
        return ResultObject.ok().data(data);
    }

    @RequestMapping("getRecordList")
    @ResponseBody
    public ResultObject getRecordList(Integer pondId) {
        List<AquaculturePondRecordDetailBean> data = dao.query(AquaculturePondRecordDetailBean.class, Cnd.where("header_id", "=", pondId));
        return ResultObject.ok().data(data);
    }

    @RequestMapping("getTempDetail")
    @ResponseBody
    public ResultObject getTempDetail(Integer id) {
        Sql sql = Sqls.create("select * from aquaculture_pond_record_template_detail a where exists( select b.temp_id from aquaculture_pond_record_detail b where b.temp_id=a.temp_id and b.id=@id) and field_name is not null and field_name !=''");
        sql.params().set("id", id);
        sql.setCallback(Sqls.callback.entities());
        sql.setEntity(dao.getEntity(AquaculturePondRecordTemplateDetailBean.class));
        dao.execute(sql);
        List<AquaculturePondRecordTemplateDetailBean> data = sql.getList(AquaculturePondRecordTemplateDetailBean.class);
        return ResultObject.ok().data(data);
    }

    @RequestMapping("getPondRecordList")
    @ResponseBody
    public ResultObject getPondRecordList(Integer id) {
        List<AquaculturePondRecordBean> data = dao.query(AquaculturePondRecordBean.class, Cnd.where("detail_id", "=", id).desc("id"));
        return ResultObject.ok().data(data).put("code", "0");
    }

    @RequestMapping("getPondRecordList2")
    @ResponseBody
    public ResultObject getPondRecordList2(Integer id, Integer count) {
        List<AquaculturePondRecordBean> data = dao.query(AquaculturePondRecordBean.class, Cnd.where("detail_id", "=", id).desc("id"));
        List<AquaculturePondRecordBean> list = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            list.add(new AquaculturePondRecordBean());
        }
        list.addAll(data);
        return ResultObject.ok().data(list).put("code", "0");
    }

    @RequestMapping("getTempHeader")
    @ResponseBody
    public ResultObject getTempHeader(Integer id) {
        String userName = ControllerHelper.getLoginUserName();
        if (StringUtils.isBlank(userName)) {
            return ResultObject.error("用户未登录");
        }
        Sql sql = Sqls.create("select * from aquaculture_pond_record_template_header  ");
        /*sql.params().set("id", id);
        sql.params().set("userName", userName);*/
        sql.setCallback(Sqls.callback.entities());
        sql.setEntity(dao.getEntity(AquaculturePondRecordTemplateHeaderBean.class));
        dao.execute(sql);
        List<AquaculturePondRecordTemplateHeaderBean> data = sql.getList(AquaculturePondRecordTemplateHeaderBean.class);
        return ResultObject.ok().data(data);
    }

    @RequestMapping("savePondRecord")
    @ResponseBody
    public ResultObject savePondRecord(AquaculturePondRecordBean record) {

        Integer id = record.getId();
        if (id == null) {
            String userName = ControllerHelper.getInstance(dao).getLoginUserName();
            if (StringUtils.isBlank(userName)) {
                log.error("用户未登录");
                return ResultObject.error("用户未登录");
            }
            record.setUserName(userName);
            record.setCreateTime(new Timestamp(System.currentTimeMillis()));
            dao.insert(record);
        } else {
            dao.updateIgnoreNull(record);
        }

        return ResultObject.ok();
    }

    @RequestMapping("deletePondRecord")
    @ResponseBody
    public ResultObject deletePondRecord(Integer id) {
        dao.delete(AquaculturePondRecordBean.class, id);
        return ResultObject.ok();
    }

    @RequestMapping("templateList")
    public String templateList() {
        return "aquaculture/pondRecord/templateList";
    }

    @RequestMapping("getTemplateList")
    @ResponseBody
    public ResultObject getTemplateList(int page, int limit, String name) {
        Pager pager = new Pager(page, limit);
        String userName = ControllerHelper.getLoginUserName();
        //Cnd cnd = Cnd.where("user_name", "=", userName);
        Cnd cnd = Cnd.where("1", "=", "1");
        if (StringUtils.isNotBlank(name)) {
            cnd = cnd.and("name", "like", "%" + name + "%");
        }
        List<AquaculturePondRecordTemplateHeaderBean> data = dao.query(AquaculturePondRecordTemplateHeaderBean.class, cnd, pager);
        String s = "SELECT count(1) from aquaculture_pond_record_template_header where 1=1";
        if (StringUtils.isNotBlank(name)) {
            s += " and name like @name";
        }
        Sql sql = Sqls.create(s);
        //sql.params().set("userName", userName);
        sql.params().set("name", "%" + name + "%");
        sql.setCallback(Sqls.callback.integer());
        dao.execute(sql);
        return ResultObject.ok().data(data).put("count", sql.getInt()).put("code", 0);
    }

    @RequestMapping(value = "/saveTemplateDetail")
    @ResponseBody
    @EnableOpLog(Constant.ModifyType.SAVE)
    public ResultObject saveTemplateDetail(Integer tempId, String name, String json) {
        String userName = ControllerHelper.getLoginUserName();
        if (StringUtils.isBlank(userName)) {
            return ResultObject.error("用户未登录");
        }
        if (StringUtils.isBlank(name)) {
            return ResultObject.error("模板名称为空");
        }
        try {
            AquaculturePondRecordTemplateHeaderBean header = new AquaculturePondRecordTemplateHeaderBean();
            header.setName(name);
            if (tempId == null || tempId == 0) {//新建
                header.setUserName(userName);
                header = dao.insert(header);
                tempId = header.getId();
            } else {
                header.setId(tempId);
                dao.update(header);
            }
            JSONArray arr = JSONArray.parseArray(json);
            for (int i = 0; i < arr.size(); i++) {
                JSONObject obj = arr.getJSONObject(i);
                if (obj != null) {
                    Integer id = obj.getInteger("id");
                    String field = obj.getString("field");
                    String fieldName = obj.getString("fieldName");
                    AquaculturePondRecordTemplateDetailBean detail = new AquaculturePondRecordTemplateDetailBean();
                    detail.setId(id);
                    detail.setTempId(tempId);
                    detail.setField(field);
                    detail.setFieldName(fieldName);
                    if (id == null || id == 0) {
                        dao.insert(detail);
                    } else {
                        dao.update(detail);
                    }
                }

            }
        } catch (Exception e) {
            log.error(e.toString(), e);
            return ResultObject.error(e.getMessage());
        }

        return ResultObject.ok();
    }

    @RequestMapping("deleteTemplateHeader")
    @ResponseBody
    @EnableOpLog(Constant.ModifyType.DELETE)
    public ResultObject deleteTemplateHeader(Integer id) {
        dao.delete(AquaculturePondRecordTemplateHeaderBean.class, id);
        return ResultObject.ok();
    }


    @RequestMapping("templateDetail")
    public ModelAndView templateDetail(Integer id) {
        if (id != null) {
            AquaculturePondRecordTemplateHeaderBean header = dao.fetch(AquaculturePondRecordTemplateHeaderBean.class, id);
            if (header == null) {
                header = new AquaculturePondRecordTemplateHeaderBean();
            }
            return new ModelAndView("aquaculture/pondRecord/templateDetail", "data", header);
        }
        return new ModelAndView("aquaculture/pondRecord/templateDetail", "data", new AquaculturePondRecordTemplateHeaderBean());


    }

    @RequestMapping("getTemplateDetail")
    @ResponseBody
    public ResultObject getTemplateDetail(Integer tempId) {
        List<AquaculturePondRecordTemplateDetailBean> data = dao.query(AquaculturePondRecordTemplateDetailBean.class, Cnd.where("temp_id", "=", tempId));
        return ResultObject.ok().data(data);
    }

    /**
     * 饲料统计
     *
     * @param tempId
     * @return
     */
    @RequestMapping(value = "/field")
    @ResponseBody
    public ResultObject field(Integer tempId) {
        List<AquaculturePondRecordTemplateDetailBean> data = new ArrayList<>();
        if (tempId == null || tempId == 0) {
            for (int i = 1; i <= 10; i++) {
                AquaculturePondRecordTemplateDetailBean bean = new AquaculturePondRecordTemplateDetailBean();
                bean.setField("att" + i);
                data.add(bean);
            }
        } else {
            data = dao.query(AquaculturePondRecordTemplateDetailBean.class, Cnd.where("temp_id", "=", tempId));
        }
        return ResultObject.ok().data(data).put("code", 0).put("count", data.size());
    }

    /**
     * 投饵量统计
     * @return
     */
    @RequestMapping(value = "/statisticalFeed")
    @ResponseBody
    public ResultObject statisticalFeed() {
        String userName = ControllerHelper.getLoginUserName();
        if (StringUtils.isBlank(userName)) {
            return ResultObject.error("用户未登录");
        }
        ResultObject result = ResultObject.ok();
        List<AquaculturePondRecordHeaderBean> headerList = dao.query(AquaculturePondRecordHeaderBean.class, Cnd.where("user_name", "=", userName));
        List<String> legend = new ArrayList<>();

        //封装月份数组 ，遍历
        List<String> months = getMonthArray(headerList.get(0).getId(), 3);

        //获取报表数据
        List<Object> finalReport = new ArrayList<>();
        for (AquaculturePondRecordHeaderBean recordHeader : headerList) {//遍历池塘获取统计数据
            String pondName = recordHeader.getPondName();
            legend.add(pondName);
            Integer headerId = recordHeader.getId();
            String s = " select sum(b.att5) att5 ,DATE_FORMAT(create_time ,'%Y-%m') month from  aquaculture_pond_record_detail a,aquaculture_pond_record b where a.id=b.detail_id and a.header_Id =@headerId and a.temp_id=3  GROUP BY DATE_FORMAT(create_time ,'%Y-%m') ";
            Sql sql = Sqls.create(s);
            sql.params().set("headerId", headerId);
            sql.setCallback((conn, rs, sql1) -> {
                List<AquaculturePondRecordBean> list = new LinkedList<>();
                while (rs.next()) {
                    AquaculturePondRecordBean pondRecord = new AquaculturePondRecordBean();
                    pondRecord.setAtt5(rs.getString("att5"));
                    pondRecord.setMonth(rs.getString("month"));
                    list.add(pondRecord);
                }
                return list;
            });
            dao.execute(sql);
            List<AquaculturePondRecordBean> pondRecordList = sql.getList(AquaculturePondRecordBean.class);

            List<String> report = new ArrayList<>();//echart报表数据/以池塘为单位
            for (String month : months) {
                String data = "0";
                for (AquaculturePondRecordBean pondRecordBean : pondRecordList) {
                    if (month.equals(pondRecordBean.getMonth())) {
                        data = pondRecordBean.getAtt5();
                    }
                }
                report.add(data);

            }
            finalReport.add(report);//最终报表数据
        }

        result.put("finalReport", finalReport);//数据 二维数组
        result.put("months", months);//横轴
        result.put("legend", legend);//纵轴
        return result;
    }

    /**
     * 用药量统计
     *
     * @return
     */
    @RequestMapping(value = "/statisticalDosage")
    @ResponseBody
    public ResultObject statisticalDosage() {
        String userName = ControllerHelper.getLoginUserName();
        if (StringUtils.isBlank(userName)) {
            return ResultObject.error("用户未登录");
        }
        ResultObject result = ResultObject.ok();
        List<AquaculturePondRecordHeaderBean> headerList = dao.query(AquaculturePondRecordHeaderBean.class, Cnd.where("user_name", "=", userName));
        List<String> legend = new ArrayList<>();

        //封装月份数组 ，遍历
        List<String> months = getMonthArray(headerList.get(0).getId(), 4);

        //获取报表数据
        List<Object> finalReport = new ArrayList<>();
        for (AquaculturePondRecordHeaderBean recordHeader : headerList) {//遍历池塘获取统计数据
            String pondName = recordHeader.getPondName();
            legend.add(pondName);
            Integer headerId = recordHeader.getId();
            String s = " select sum(b.att5) att5 ,DATE_FORMAT(create_time ,'%Y-%m') month from  aquaculture_pond_record_detail a,aquaculture_pond_record b where a.id=b.detail_id and a.header_Id =@headerId and a.temp_id=4  GROUP BY DATE_FORMAT(create_time ,'%Y-%m') ";
            Sql sql = Sqls.create(s);
            sql.params().set("headerId", headerId);
            sql.setCallback((conn, rs, sql1) -> {
                List<AquaculturePondRecordBean> list = new LinkedList<>();
                while (rs.next()) {
                    AquaculturePondRecordBean pondRecord = new AquaculturePondRecordBean();
                    pondRecord.setAtt5(rs.getString("att5"));
                    pondRecord.setMonth(rs.getString("month"));
                    list.add(pondRecord);
                }
                return list;
            });
            dao.execute(sql);
            List<AquaculturePondRecordBean> pondRecordList = sql.getList(AquaculturePondRecordBean.class);

            List<String> report = new ArrayList<>();//echart报表数据/以池塘为单位
            for (String month : months) {
                String data = "0";
                for (AquaculturePondRecordBean pondRecordBean : pondRecordList) {
                    if (month.equals(pondRecordBean.getMonth())) {
                        data = pondRecordBean.getAtt5();
                    }
                }
                report.add(data);

            }
            finalReport.add(report);//最终报表数据
        }

        result.put("finalReport", finalReport);//数据 二维数组
        result.put("months", months);//横轴
        result.put("legend", legend);//纵轴
        return result;
    }

    /**
     * 销售额统计
     *
     * @return
     */
    @RequestMapping(value = "/statisticalSale")
    @ResponseBody
    public ResultObject statisticalSale() {
        String userName = ControllerHelper.getLoginUserName();
        if (StringUtils.isBlank(userName)) {
            return ResultObject.error("用户未登录");
        }
        ResultObject result = ResultObject.ok();
        List<AquaculturePondRecordHeaderBean> headerList = dao.query(AquaculturePondRecordHeaderBean.class, Cnd.where("user_name", "=", userName));
        List<String> legend = new ArrayList<>();

        //封装月份数组 ，遍历
        List<String> months = getMonthArray(headerList.get(0).getId(), 5);

        //获取报表数据
        List<Object> finalReport = new ArrayList<>();
        for (AquaculturePondRecordHeaderBean recordHeader : headerList) {//遍历池塘获取统计数据
            String pondName = recordHeader.getPondName();
            legend.add(pondName);
            Integer headerId = recordHeader.getId();
            String s = " select sum(b.att5) att5 ,DATE_FORMAT(create_time ,'%Y-%m') month from  aquaculture_pond_record_detail a,aquaculture_pond_record b where a.id=b.detail_id and a.header_Id =@headerId and a.temp_id=5  GROUP BY DATE_FORMAT(create_time ,'%Y-%m') ";
            Sql sql = Sqls.create(s);
            sql.params().set("headerId", headerId);
            sql.setCallback((conn, rs, sql1) -> {
                List<AquaculturePondRecordBean> list = new LinkedList<>();
                while (rs.next()) {
                    AquaculturePondRecordBean pondRecord = new AquaculturePondRecordBean();
                    pondRecord.setAtt5(rs.getString("att5"));
                    pondRecord.setMonth(rs.getString("month"));
                    list.add(pondRecord);
                }
                return list;
            });
            dao.execute(sql);
            List<AquaculturePondRecordBean> pondRecordList = sql.getList(AquaculturePondRecordBean.class);

            List<String> report = new ArrayList<>();//echart报表数据/以池塘为单位
            for (String month : months) {
                String data = "0";
                for (AquaculturePondRecordBean pondRecordBean : pondRecordList) {
                    if (month.equals(pondRecordBean.getMonth())) {
                        data = pondRecordBean.getAtt5();
                    }
                }
                report.add(data);

            }
            finalReport.add(report);//最终报表数据
        }

        result.put("finalReport", finalReport);//数据 二维数组
        result.put("months", months);//横轴
        result.put("legend", legend);//纵轴
        return result;
    }


    private List<String> getMonthArray(Integer headerId, Integer tempId) {
       /* String[] months = new String[12];
        Calendar cal = Calendar.getInstance();
        cal.set(Calendar.MONTH, cal.get(Calendar.MONTH));
        for (int i = 0; i < 12; i++) {
            int month=cal.get(Calendar.MONTH) + 1;
            String monthstr=month>9?month+"":"0"+month;
            months[11 - i] = cal.get(Calendar.YEAR) + "-"+monthstr;
            cal.set(Calendar.MONTH, cal.get(Calendar.MONTH) - 1);
        }
        return months;*/
//        Sql sql = Sqls.create("select distinct DATE_FORMAT(create_time ,'%Y-%m')  from  aquaculture_pond_record_detail a,aquaculture_pond_record b where a.id=b.detail_id and a.header_Id =@headerId and a.temp_id=@tempId  GROUP BY DATE_FORMAT(create_time ,'%Y-%m')");
        Sql sql = Sqls.create("select DATE_FORMAT(create_time ,'%Y-%m')  from  aquaculture_pond_record_detail a,aquaculture_pond_record b where a.id=b.detail_id and a.header_Id =@headerId and a.temp_id=@tempId ORDER BY b.id DESC LIMIT 1");
        sql.setCallback(Sqls.callback.strList());
        sql.params().set("headerId", headerId);
        sql.params().set("tempId", tempId);
        dao.execute(sql);
        return sql.getList(String.class);
    }
}
