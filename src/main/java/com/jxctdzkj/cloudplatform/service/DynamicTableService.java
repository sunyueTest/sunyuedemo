package com.jxctdzkj.cloudplatform.service;


/**
 * @Description
 * @Author chanmufeng
 * @Date 2019/7/1 11:43
 **/
public interface DynamicTableService {


    Object selDetail(Integer rightId, String userName);



    Object save(Integer rightId, String userName, String ids, String cols, String newValues);

    Object insertNewRow(Integer rightId, String userName, Integer newRowIndex);



    Object delRows(Integer rightId, String userName, String ids, String rowIds);


    void delRow(Integer rightId, String userName, Integer id, Integer removedRowIndex);

    Object insertNewCol(Integer rightId, String userName, Integer newColIndex);


    Object delCol(Integer rightId, String userName, String removedColIndexs);

    Object changeStyle(Integer rightId, Integer valueId, Integer columnId,String className);
}
