package com.jxctdzkj.cloudplatform.controller;

import com.jxctdzkj.cloudplatform.service.DynamicTableService;
import com.jxctdzkj.cloudplatform.utils.ControllerHelper;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import lombok.extern.slf4j.Slf4j;
import org.nutz.dao.Dao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

/**
 * @Description 动态表格测试
 * @Author chanmufeng
 * @Date 2019/7/1 10:10
 **/
@Slf4j
@RequestMapping({"dynamicTable"})
@Controller
public class DynamicTableController {

    @Autowired
    Dao dao;

    @Autowired
    DynamicTableService dynamicTableService;

    /**
     * @param rightId 对应的左侧菜单id
     * @return
     */
    @RequestMapping("dynamicTable")
    public ModelAndView dynamicTableList(Integer rightId) {
        return new ModelAndView("dynamicTable/dynamicTable", "rightId", rightId);
    }

    @RequestMapping("selDetail")
    @ResponseBody
    public Object selDetail(Integer rightId) {
        String userName = ControllerHelper.getLoginUserName();

        return dynamicTableService.selDetail(rightId, userName);
    }

    /**
     * 实时保存动态表格的操作
     *
     * @param type             操作类型（修改单元格/删除列/删除行/添加列/添加行）
     * @param rightId          左侧导航栏id
     * @param ids              操作的数据在数据库表中的主键值
     * @param rows             操作的单元格所在的行号
     * @param cols             操作的单元格对应数据库的列号
     * @param newValues        更改单元格之后的值
     * @param newRowIndex      新添加的行在前端表格中对应的行号
     * @param newColIndex      新添加的列在前端表格中对应的列号
     * @param ids              删除多行操作时，对应数据行在数据库表中的主键字符串，采用,分割(如121,125,156)
     * @param rowIds           删除多行操作时，操作的数据在前端表格中对应的行号形成的字符串，采用,分割
     * @param removedColIndexs 删除多列操作时，操作的数据在前端表格中对应的列号形成的字符串，采用,分割
     * @param valueId          改变单元格样式时，操作的数据在数据表dynamic_table_values中对应的id
     * @param columnId         改变单元格样式时，操作的数据在dynamic_table_statistics中对应的pattern中的列编号
     * @param className        单元格对应的样式字符串
     * @return
     */
    @RequestMapping("report")
    @ResponseBody
    public Object report(String type, Integer rightId, String rows,
                         String cols, String newValues, Integer newRowIndex,
                         Integer newColIndex, String ids, String rowIds, String removedColIndexs,
                         Integer valueId, Integer columnId, String className) {
        String userName = ControllerHelper.getLoginUserName();
        switch (type) {
            case "save":
                return dynamicTableService.save(rightId, userName, ids, cols, newValues);
            case "newRow":
                return dynamicTableService.insertNewRow(rightId, userName, newRowIndex);
            case "delRow":
                return dynamicTableService.delRows(rightId, userName, ids, rowIds);
            case "delCol":
                return dynamicTableService.delCol(rightId, userName, removedColIndexs);
            case "newCol":
                return dynamicTableService.insertNewCol(rightId, userName, newColIndex);
            case "changeStyle":
                return dynamicTableService.changeStyle(rightId, valueId, columnId, className);
            default:
                return ResultObject.ok();
        }
    }
}
