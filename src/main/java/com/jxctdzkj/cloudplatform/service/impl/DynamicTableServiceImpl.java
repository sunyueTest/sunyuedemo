package com.jxctdzkj.cloudplatform.service.impl;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.jxctdzkj.cloudplatform.bean.DynamicTableStatisticsBean;
import com.jxctdzkj.cloudplatform.bean.DynamicTableValuesBean;
import com.jxctdzkj.cloudplatform.bean.SysUserBean;
import com.jxctdzkj.cloudplatform.exception.ServiceException;
import com.jxctdzkj.cloudplatform.service.DynamicTableService;
import com.jxctdzkj.cloudplatform.utils.ControllerHelper;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections.ArrayStack;
import org.apache.commons.lang3.StringUtils;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.dao.Sqls;
import org.nutz.dao.entity.Record;
import org.nutz.dao.sql.Sql;
import org.nutz.trans.Trans;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.lang.reflect.Field;
import java.util.*;

/**
 * @Description
 * @Author chanmufeng
 * @Date 2019/7/1 11:43
 **/
@Service
@Slf4j
public class DynamicTableServiceImpl implements DynamicTableService {
    @Autowired
    Dao dao;

    @Override
    public Object selDetail(Integer rightId, String userName) {
        ArrayList<List<Object>> list = new ArrayList<>();
        DynamicTableStatisticsBean dynamicTableStatisticsBean;
        JSONArray style = new JSONArray();
        try {
            dynamicTableStatisticsBean = dao.fetch(DynamicTableStatisticsBean.class, Cnd.where("right_id", "=", rightId).and("user_name", "=", userName));
            if (dynamicTableStatisticsBean == null) {
                /**
                 * 初始化5*5表格
                 */
//                Trans.exec(() -> {
                //新建统计信息
                dynamicTableStatisticsBean = new DynamicTableStatisticsBean();
                dynamicTableStatisticsBean.setPattern("0/1/2/3/4");
                dynamicTableStatisticsBean.setRightId(rightId);
                dynamicTableStatisticsBean.setUsedColsNum(5);
                dynamicTableStatisticsBean.setUserName(userName);
                dynamicTableStatisticsBean.setStyle(new JSONArray().toJSONString());
                dynamicTableStatisticsBean = dao.insert(dynamicTableStatisticsBean);

                //TODO 批处理
                if (dynamicTableStatisticsBean != null) {
                    ArrayList tempList = new ArrayList<>();
                    tempList.add(-1);
                    list.add(tempList);
                    for (int i = 0; i <= 5; i++) {
                        tempList = new ArrayList<>();
                        DynamicTableValuesBean valuesBean = new DynamicTableValuesBean();
                        valuesBean.setRightId(rightId);
                        valuesBean.setUserName(userName);
                        valuesBean.setSerialNum(i + 1);
                        valuesBean.setAttr0("");
                        valuesBean.setAttr1("");
                        valuesBean.setAttr2("");
                        valuesBean.setAttr3("");
                        valuesBean.setAttr4("");
                        dao.insert(valuesBean);

                        tempList.add(valuesBean.getId());
                        list.add(tempList);
                    }
                }
                for (int i = 0; i <= 5; i++) {
                    for (int j = 0; j < 5; j++) {
                        //返回的首行内容为当前对应的attr*值
                        if (i == 0) {
                            list.get(i).add(j);
                        } else {
                            list.get(i).add("");
                        }
                    }
                }
            } else {
                //首先读取统计信息
                String[] patternArr = dynamicTableStatisticsBean.getPattern().split("/");
                //根据pattern拼接SQL语句，根据其顺序读取列
                String sqlStr = getSQLByPattern(patternArr);
                Sql sql = Sqls.create(sqlStr);
                sql.setParam("userName", userName);
                sql.setParam("rightId", rightId);
                sql.setCallback(Sqls.callback.records());
                sql.forceExecQuery();
                dao.execute(sql);
                List<Record> recordList = (List<Record>) sql.getResult();

                //拼接返回结果
                for (int i = 0; i <= recordList.size(); i++) {
                    ArrayList tempList = new ArrayList<>();
                    if (i == 0) {
                        tempList.add(-1);
                        for (int j = 0; j < patternArr.length; j++) {
                            tempList.add(patternArr[j]);
                        }
                    } else {
                        //将id设置为前端隐藏列，便于快速定位表中需要修改的数据行
                        tempList.add(recordList.get(i - 1).get("id"));
                        for (int j = 0; j < patternArr.length; j++) {
                            tempList.add(recordList.get(i - 1).get("attr" + patternArr[j]));
                        }
                    }
                    list.add(tempList);
                }

                try {
                    style = dynamicTableStatisticsBean.getStyle();
                } catch (Exception e) {
                    log.error(e.getMessage());
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResultObject.apiError("err131");
        }
        return ResultObject.ok().data("data", list).data("style", style);
    }

    @Override
    public Object save(Integer rightId, String userName, String ids,  String cols, String newValues) {
        try {
            setValue(rightId, userName, ids, cols, newValues);
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResultObject.apiError("err133");
        }
        return ResultObject.ok();
    }

    @Override
    public Object insertNewRow(Integer rightId, String userName, Integer newRowIndex) {
        try {

            //更新其他记录的serialNum
            Sql sql = Sqls.create("UPDATE dynamic_table_values SET serial_num = serial_num + 1 WHERE user_name = @userName AND right_id = @rightId AND serial_num >= @serialNum");
            sql.setParam("rightId", rightId);
            sql.setParam("userName", userName);
            sql.setParam("serialNum", newRowIndex);
            dao.execute(sql);

            //添加新行
            DynamicTableValuesBean valuesBean = new DynamicTableValuesBean();
            valuesBean.setRightId(rightId);
            valuesBean.setUserName(userName);
            valuesBean.setSerialNum(newRowIndex);
            dao.insert(valuesBean);

            return ResultObject.ok().data("newId", valuesBean.getId());
        } catch (Exception e) {
            e.printStackTrace();
            return ResultObject.apiError("err133");
        }
    }


    @Override
    public Object delRows(Integer rightId, String userName, String ids, String rowIds) {
        try {
            String[] idArr = ids.split(",");
            String[] rowIdArr = rowIds.split(",");
            for (int i = 0; i < idArr.length; i++) {
                delRow(rightId, userName, Integer.parseInt(idArr[i]), Integer.parseInt(rowIdArr[i]));
            }
            //删除对应行的格式
            deleteRowsStyle(rightId, userName, ids);
        } catch (Exception e) {
            e.printStackTrace();
            return ResultObject.apiError("err134");
        }
        return ResultObject.ok();
    }

    @Override
    public void delRow(Integer rightId, String userName, Integer id, Integer removedRowIndex) {
        Sql sql = Sqls.create("DELETE FROM dynamic_table_values WHERE id = @id");
        sql.setParam("id", id);
        dao.execute(sql);

        //更新其他记录的serialNum
        Sql sql1 = Sqls.create("UPDATE dynamic_table_values SET serial_num = serial_num - 1 WHERE user_name = @userName AND right_id = @rightId AND serial_num > @serialNum");
        sql1.setParam("rightId", rightId);
        sql1.setParam("userName", userName);
        sql1.setParam("serialNum", removedRowIndex);
        dao.execute(sql1);
    }

    @Override
    public Object insertNewCol(Integer rightId, String userName, Integer newColIndex) {
        try {

            DynamicTableStatisticsBean statisticsBean = dao.fetch(DynamicTableStatisticsBean.class, Cnd.where("user_name", "=", userName).and("right_id", "=", rightId));
            if (statisticsBean == null) {
                return ResultObject.apiError("err135");//添加列失败
            }

            //判断当前列数是否超过20列
            if (statisticsBean.getUsedColsNum() == 20) {
                return ResultObject.apiError("err137");//创建的列数不能超过20列
            }
            //更新统计信息的列数
            statisticsBean.setUsedColsNum(statisticsBean.getUsedColsNum() + 1);

            /**
             * 修改插入新列之后pattern的表示形式
             */
            String[] patternArr = statisticsBean.getPattern().split("/");
            String[] newPatternArr = new String[patternArr.length + 1];

            //查找下标最小的未被使用的列
            Boolean flag;
            int toBeUsedLeastColIndex = statisticsBean.getUsedColsNum() - 1;
            for (int i = 0; i < statisticsBean.getUsedColsNum(); i++) {
                flag = false;
                for (int j = 0; j < patternArr.length; j++) {
                    if (patternArr[j].equals(i + "")) {
                        flag = true;
                        break;
                    }
                }
                if (!flag) {
                    toBeUsedLeastColIndex = i;
                    break;
                }
            }
            System.out.println("找到的最小的未被使用的列下标： " + toBeUsedLeastColIndex);
            System.out.println(Arrays.toString(patternArr));
            int index = 0;
            StringBuilder newPattern = new StringBuilder();
            if (newColIndex - 1 >= patternArr.length) {
                newPattern.append(statisticsBean.getPattern() + "/" + (newColIndex - 1) + "/");
            } else {
                for (int i = 0; i < patternArr.length; i++) {
                    if (i == newColIndex - 1) {
                        newPatternArr[index++] = String.valueOf(toBeUsedLeastColIndex);
                        newPattern.append(newPatternArr[index - 1]).append("/");
                    }
                    newPatternArr[index++] = patternArr[i];
                    newPattern.append(newPatternArr[index - 1]).append("/");
                }
            }

            statisticsBean.setPattern(newPattern.substring(0, newPattern.length() - 1));

            dao.update(statisticsBean);
            return ResultObject.ok().data("newColumn", toBeUsedLeastColIndex);

        } catch (Exception e) {
            e.printStackTrace();
            return ResultObject.apiError("err135");
        }
    }

    @Override
    public Object delCol(Integer rightId, String userName, String removedColIndexs) {
        try {
            log.info("接收到的参数为: " + removedColIndexs);
            DynamicTableStatisticsBean statisticsBean = dao.fetch(DynamicTableStatisticsBean.class, Cnd.where("user_name", "=", userName).and("right_id", "=", rightId));
            log.info("pattern字符串： " + statisticsBean.getPattern());
            if (statisticsBean == null) {
                return ResultObject.apiError("err136");//移除列失败
            }

            /**
             * 修改移除列之后pattern的表示形式
             */
            String[] removedColIndexArr = removedColIndexs.split(",");
            int removedColsNum = removedColIndexArr.length;
            //数据表中即将被清除数据的列下标数组（attr0,attr1...中的0,1...）
            String[] toBeClearedColsIndexArr = new String[removedColsNum];

            String[] oldPatternArr = statisticsBean.getPattern().split("/");
            for (int i = 0; i < removedColsNum; i++) {
                toBeClearedColsIndexArr[i] = oldPatternArr[Integer.parseInt(removedColIndexArr[i]) - 1];
            }
            log.info("数据库中被移除的列" + Arrays.toString(toBeClearedColsIndexArr));

            //更新统计信息的列数
            statisticsBean.setUsedColsNum(statisticsBean.getUsedColsNum() - removedColsNum);

            for (int i = 0; i < removedColIndexArr.length; i++) {
                for (int j = 0; j < oldPatternArr.length; j++) {
                    if (j == Integer.parseInt(removedColIndexArr[i]) - 1) {
                        oldPatternArr[j] = "";
                    }
                }
            }

            ArrayList<String> newPatternList = new ArrayList<>();
            for (int i = 0; i < oldPatternArr.length; i++) {
                if (!oldPatternArr[i].equals("")) {
                    newPatternList.add(oldPatternArr[i]);
                }
            }
            String newPatternStr = StringUtils.join(newPatternList, '/');
            log.info("新的pattern字符串: " + newPatternStr);
            statisticsBean.setPattern(newPatternStr);

            //删除列样式
            deleteColsStyle(statisticsBean, toBeClearedColsIndexArr);
            Trans.exec(() -> {
                dao.update(statisticsBean);

                //将该列的值全部删除
                String sqlStr = getDeleteSQLByPattern(toBeClearedColsIndexArr);
                Sql sql = Sqls.create(sqlStr);
                sql.setParam("rightId", rightId);
                sql.setParam("userName", userName);
                dao.execute(sql);
            });

        } catch (Exception e) {
            log.error(e.getMessage());
            return ResultObject.apiError("err136");
        }
        return ResultObject.ok();
    }

    @Override
    public synchronized Object changeStyle(Integer rightId, Integer valueId, Integer columnId, String className) {
        try {
            System.out.println(valueId + " / " + columnId + "className: " + className);
            String userName = ControllerHelper.getLoginUserName();
            DynamicTableStatisticsBean bean = dao.fetch(DynamicTableStatisticsBean.class, Cnd.where("right_id", "=", rightId).and("user_name", "=", userName));
            if (bean.getStyle() == null) {
                bean.setStyle(new JSONArray().toJSONString());
            }
            JSONArray jsonArray = bean.getStyle();
            boolean isFind = false;
            JSONObject map;
            for (int i = 0; i < jsonArray.size(); i++) {
                map = JSONObject.parseObject(jsonArray.get(i).toString());
                if ((int) (map.get("row")) == valueId && (int) (map.get("col")) == columnId) {
                    isFind = true;
                    map.put("className", className);
                    jsonArray.set(i, map);
                    System.out.println(map.get("row") + "  " + map.get("col"));
                    System.out.println("设置之后");
                    System.out.println(map.get("row") + " / " + map.get("col") + "className: " + map.get("className"));
                    break;
                }
            }

            if (!isFind) {
                JSONObject obj = new JSONObject();
                obj.put("className", className);
                obj.put("row", valueId);
                obj.put("col", columnId);
                jsonArray.add(obj);
            }
            bean.setStyle(jsonArray.toJSONString());

            dao.update(bean);
        } catch (Exception e) {
            e.printStackTrace();
            return ResultObject.apiError("err139");
        }
        return ResultObject.ok();
    }

    /**
     * 清除单元格样式及其数据
     *
     * @param rightId   菜单id
     * @param userName  当前用户名
     * @param ids       用,分割的dynamic_table_values表的id
     * @param rows      用,分割的前端行索引字符串
     * @param cols      用,分割的前端列索引字符串
     * @param newValues 设置的新值
     * @return
     */
    public Object clear(Integer rightId, String userName, String ids, String rows, String cols, String newValues) {
        try {
            //为选择的所有单元格设置新值
//            setValue(rightId, userName, ids, rows, cols, newValues);

            //清除格式

        } catch (Exception e) {

        }
        return null;
    }

    /**
     * 根据数组拼接delete语句
     *
     * @param arr
     * @return
     */
    private String getDeleteSQLByPattern(String[] arr) {
        StringBuilder sql = new StringBuilder();
        sql.append("UPDATE dynamic_table_values SET ");
        for (int i = 0; i < arr.length; i++) {
            sql.append("attr" + arr[i] + " = ''");
            if (i != arr.length - 1) {
                sql.append(", ");
            }
        }
        sql.append(" WHERE user_name = @userName AND right_id = @rightId");
        return sql.toString();
    }

    /**
     * 根据arr数组拼接SQL语句
     *
     * @param arr
     * @return
     */
    private String getSQLByPattern(String[] arr) {
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT id, ");
        for (int i = 0; i < arr.length; i++) {
            sql.append("attr" + arr[i]);
            if (i != arr.length - 1) {
                sql.append(", ");
            }
        }
        sql.append(" FROM dynamic_table_values WHERE user_name = @userName AND right_id = @rightId ORDER BY serial_num");
        return sql.toString();
    }

    /**
     * 删除列单元格样式
     *
     * @param bean
     * @param toBeRemovedCols 待删除的列编号，用,分割
     */
    private void deleteColsStyle(DynamicTableStatisticsBean bean, String[] toBeRemovedCols) throws Exception {
        if (bean.getStyle() == null) {
            return;
        }
        JSONArray jsonArray = bean.getStyle();
        JSONObject map;

        for (int i = 0; i < toBeRemovedCols.length; i++) {
            Iterator<Object> ite = jsonArray.iterator();
            while (ite.hasNext()) {
                map = JSONObject.parseObject(ite.next().toString());
                log.info(map.get("col") + "------" + Integer.parseInt(toBeRemovedCols[i]));
                if ((int) map.get("col") == Integer.parseInt(toBeRemovedCols[i])) {
                    log.info("删除col为" + toBeRemovedCols[i] + "的行的样式");
                    ite.remove();
                }
            }
        }
        bean.setStyle(jsonArray.toJSONString());
        dao.update(bean);
    }

    /**
     * 清除单元格格式
     * @param rightId 菜单id
     * @param userName 当前用户名
     * @param toBeRemovedRows 待删除的前端行索引
     * @param toBeRemovedCols
     * @throws Exception
     */
    private void deleteCellStyle(Integer rightId, String userName, String toBeRemovedRows, String toBeRemovedCols) throws Exception {

    }

    /**
     * 删除行单元格样式
     *
     * @param rightId         菜单id
     * @param userName        当前用户名
     * @param toBeRemovedRows 待删除的行编号，用,分割
     */
    private void deleteRowsStyle(Integer rightId, String userName, String toBeRemovedRows) throws Exception {
        DynamicTableStatisticsBean bean = dao.fetch(DynamicTableStatisticsBean.class, Cnd.where("right_id", "=", rightId).and("user_name", "=", userName));
        if (bean.getStyle() == null) {
            return;
        }
        JSONArray jsonArray = bean.getStyle();
        JSONObject map;

        String[] rows = toBeRemovedRows.split(",");

        for (int i = 0; i < rows.length; i++) {
            Iterator<Object> ite = jsonArray.iterator();
            while (ite.hasNext()) {
                map = JSONObject.parseObject(ite.next().toString());
                log.info(map.get("row") + "------" + Integer.parseInt(rows[i]));
                if ((int) map.get("row") == Integer.parseInt(rows[i])) {
                    log.info("删除row为" + rows[i] + "的列的样式");
                    ite.remove();
                }
            }
        }
        bean.setStyle(jsonArray.toJSONString());
        dao.update(bean);
    }


    private void setValue(Integer rightId, String userName, String ids,  String cols, String newValues) throws ServiceException {
        log.info("cols:" + cols + "newValues:" + newValues + "ids:" + ids);

        String[] newValuesArr = newValues.split(",");
        String[] colsArr = cols.split(",");
        String[] idsArr = ids.split(",");

        //寻找pattern中实际在数据库表中对应的列
        DynamicTableStatisticsBean statisticsBean = dao.fetch(DynamicTableStatisticsBean.class, Cnd.where("user_name", "=", userName).and("right_id", "=", rightId));
        if (statisticsBean == null) {
            throw new ServiceException("err133");
//                return ResultObject.apiError("err133");
        }

        for (int i = 0; i < idsArr.length; i++) {
            if (idsArr[i].equals("null")) {
                continue;
            }

            Sql sql = Sqls.create("UPDATE dynamic_table_values SET attr" + colsArr[i] + " = @newValue WHERE id=@id");
            sql.setParam("newValue", newValuesArr[i]);
            sql.setParam("id", idsArr[i]);
            dao.execute(sql);
        }
    }

}
