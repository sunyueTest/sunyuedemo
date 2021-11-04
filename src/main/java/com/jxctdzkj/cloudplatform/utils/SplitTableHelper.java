package com.jxctdzkj.cloudplatform.utils;


import com.jxctdzkj.cloudplatform.bean.SplitTableBean;
import com.jxctdzkj.cloudplatform.config.Constant;
import com.jxctdzkj.cloudplatform.radis.RedisUtil;
import com.jxctdzkj.support.utils.Encrypt;

import org.nutz.dao.Cnd;
import org.nutz.dao.Condition;
import org.nutz.dao.Dao;
import org.nutz.dao.Sqls;
import org.nutz.dao.TableName;
import org.nutz.dao.entity.Entity;
import org.nutz.dao.sql.Sql;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import lombok.extern.slf4j.Slf4j;

/**
 * <pre>
 *     @author  : FlySand
 *     @e-mail  : 1156183505@qq.com
 *     @time    : 2019/3/6.
 *     @desc    :
 * </pre>
 */
@Slf4j
@Configuration
public class SplitTableHelper {


    @Autowired
    Dao dao;

    static SplitTableHelper instance;

    public SplitTableHelper() {
        instance = this;
    }

    public static <T> List<T> queryForDate(
            Class<T> tClass, Condition cnd, Timestamp startTime, Timestamp endTime, final int page, final int size) {
        long currentTime = System.currentTimeMillis();
        //默认三个月前的时间
        if (startTime == null) {
            startTime = new Timestamp(currentTime - 3 * 30 * 24 * 60 * 60 * 1000L);
        }
        if (endTime == null || endTime.getTime() > currentTime) {
            endTime = new Timestamp(currentTime);
        }
        if (endTime.getTime() < startTime.getTime()) {
            endTime = startTime;
        }
        Dao dao = instance.dao;
        String tableName = dao.getEntity(tClass).getTableName();
        int selStart = page * size - size;
        if (selStart < 0) {
            throw new RuntimeException("分页错误");
        }
        //查询数据所属表
        List<SplitTableBean> splitTableBeans = dao.query(SplitTableBean.class,
                Cnd.wrap("WHERE table_name='" + tableName + "' AND (data_end_time>'" + startTime + "' AND creat_time<'" + endTime + "' OR data_end_time IS NULL)  ORDER BY id DESC"));
        final int selCount = page * size;
        log.info("split:" + splitTableBeans.size() + "  selCount:" + selCount + " selStart:" + selStart);
        ArrayList list = new ArrayList<>();
        int totalCount = 0;
        int splitSize = splitTableBeans.size();
        for (int i = 0; i < splitSize; i++) {
            SplitTableBean splitTableBean = splitTableBeans.get(i);
            log.info("第" + (i + 1) + " 张表 ：" + splitTableBean.getSplitTableName() + "  list :" + list.size() + "   totoal：" + totalCount);
            try {
                TableName.set(splitTableBean.getSuffixName());
                if (page == 1 && size == 1) {
                    Sql sql = Sqls.create("SELECT * FROM " + splitTableBean.getSplitTableName() + cnd.toString() + " LIMIT 0,1");
                    sql.setCallback(Sqls.callback.entities());
                    sql.setEntity(dao.getEntity(tClass));
                    dao.execute(sql);
                    List<T> selList = sql.getList(tClass);
                    list.addAll(selList);
                } else {
                    long currentCount = selCount(tClass, cnd);
                    log.info("currentCount：" + currentCount + " total:" + totalCount);
                    if (currentCount > 0 && totalCount + currentCount > selStart) {
                        long selSize = size - list.size();
                        long limt = 0;
                        if (totalCount == 0) {
                            limt = selStart;
                        } else if (selStart > 0) {
                            limt = selStart - totalCount + list.size();
                        }
                        if (limt + selSize > currentCount) {
                            selSize = currentCount - limt;
                        }
                        if (selSize <= 0 || limt < 0) {
                            throw new RuntimeException("查询错误" + (" LIMIT " + limt + "," + selSize));
                        }
                        Sql sql = Sqls.create("SELECT * FROM " + splitTableBean.getSplitTableName() + cnd.toString() + " LIMIT " + limt + "," + selSize);
                        sql.setCallback(Sqls.callback.entities());
                        sql.setEntity(dao.getEntity(tClass));
                        dao.execute(sql);
                        List selList = sql.getList(tClass);
                        log.info("selList:" + selList.size());
                        list.addAll(selList);
                    }
                    totalCount += currentCount;
                }
            } finally {
                TableName.clear();
            }
            if (list.size() >= size) {
                log.info("查询时间:" + (System.currentTimeMillis() - currentTime) + "ms");
                return list;
            }
        }
        log.info("查询时间:" + (System.currentTimeMillis() - currentTime) + "ms");
        return list;
    }

    /*
        public static <T> List<T> queryForDate(
                Class<T> tClass, Condition cnd, Timestamp startTime, Timestamp endTime, final int page, final int size, final long maxCout) {
            long currentTime = System.currentTimeMillis();
            //默认三个月前的时间
            if (startTime == null) {
                startTime = new Timestamp(currentTime - 3 * 30 * 24 * 60 * 60 * 1000l);
            }
            if (endTime == null || endTime.getTime() > currentTime) {
                endTime = new Timestamp(currentTime);
            }
            if (endTime.getTime() < startTime.getTime()) {
                endTime = startTime;
            }
            Dao dao = instance.dao;
            String tableName = dao.getEntity(tClass).getTableName();
            //查询数据所属表
            List<SplitTableBean> splitTableBeans = dao.query(SplitTableBean.class,
                    Cnd.wrap("WHERE table_name='" + tableName + "' AND (data_end_time>'" + startTime + "' AND creat_time<'" + endTime + "' OR data_end_time IS NULL)  ORDER BY id DESC"));
            final int selCount = page * size;
            log.info("split:" + splitTableBeans.size() + "  selCount:" + selCount);
            List list = new ArrayList<>();
            int totalCount = 0;
            int offset = 0;
            int selPage = page;
            int splitSize = splitTableBeans.size();
            for (int i = 0; i < splitSize; i++) {
                SplitTableBean splitTableBean = splitTableBeans.get(i);
                log.info("第" + (i + 1) + "张表 ：" + "  list :" + list.size() + "   totoal：" + totalCount + "  offset:" + offset + "  selPage:" + selPage);
                try {
                    log.info(splitTableBean.getSplitTableName());
                    TableName.set(splitTableBean.getSuffixName());
                    int selPageSize;
                    boolean subType = false;
                    if (page * size - totalCount < size) {
                        selPageSize = offset;
                        subType = true;
                    } else {
                        selPageSize = offset + size;
                    }

                    if (selPageSize <= 0) {
                        selPage = 1;
                    }
                    log.info("cnd:" + cnd.toString());
                    log.info("cnd:" + cnd.toSql(instance.dao.getEntity(tClass)));
                    log.info("selPage:" + selPage + "  size:" + selPageSize + "  offset:" + offset);

                    Sql sql = Sqls.create("SELECT * FROM " + splitTableBean.getSplitTableName() + cnd.toString() + " LIMIT " + ((selPage - 1) * size) + "," + selPageSize);
                    sql.setCallback(Sqls.callback.entities());
                    sql.setEntity(dao.getEntity(tClass));
                    dao.execute(sql);
                    List selList = sql.getList(tClass);
    //                List selList = dao.query(tClass, cnd, new Pager(selPage, selPageSize));
    //                List selList = dao.query(tClass, cnd.toString());
                    log.info("selList : " + selList.size());
                    if (selList.size() == 0) {
                        log.info("没数据拉查询下一张表");
                    } else if (subType) {
                        list.addAll(selList);
                    } else if (selPage > 1) {
                        log.info("取前面的数据");
                        if (selList.size() - offset > 0) {
                            list.addAll(selList.subList(0, selList.size() - offset));
                        } else {
                            list.addAll(selList.subList(0, selList.size() - list.size()));
                        }
                    } else if (selList.size() > offset) {
                        log.info("取后面的数据");
                        list.addAll(selList.subList(offset, selList.size()));
                    } else {
                        log.info("其他情况不添加");
                    }
                    if (list.size() < selCount && i + 1 < splitSize) {
                        long currentCount = selCount(tClass, cnd);
                        totalCount += currentCount;
                        offset = size - totalCount % size;
                        if (selList.size() == 0 && offset == size) {
                            offset = 0;
                        }
                        if (currentCount > 0 && page > 1) {
                            int usePage = Math.round(Float.parseFloat(totalCount + "") / size);
                            int has = page * size - totalCount;
                            if (has == 0 || (currentCount > size && has / 2f < size)) {
                                selPage = 1;
                            } else {
                                selPage = page - usePage;
                            }
                            log.info("重置  selPage ：" + selPage);
                        }
                    }
                } finally {
                    TableName.clear();
                }
                if (list.size() >= size) {
                    log.info("查询时间:" + (System.currentTimeMillis() - currentTime) + "ms");
                    return list;
                }
            }
            log.info("查询时间:" + (System.currentTimeMillis() - currentTime) + "ms");
            return list;
        }
    */
    public static <T> long getCount(Class<T> tClass, Condition cnd, Timestamp startTime, Timestamp endTime) {
        long currentTime = System.currentTimeMillis();
        //默认三个月前的时间
        if (startTime == null) {
            startTime = new Timestamp(currentTime - 3 * 30 * 24 * 60 * 60 * 1000l);
        }
        if (endTime == null || endTime.getTime() > currentTime) {
            endTime = new Timestamp(currentTime);
        }
        if (endTime.getTime() < startTime.getTime()) {
            endTime = startTime;
        }
        Dao dao = instance.dao;
        String tableName = dao.getEntity(tClass).getTableName();
        //查询数据所属表
        List<SplitTableBean> splitTableBeans = dao.query(SplitTableBean.class,
                Cnd.wrap("WHERE table_name='" + tableName + "' AND (data_end_time>'" + startTime + "' AND creat_time<'" + endTime + "' OR data_end_time IS NULL)  ORDER BY id DESC"));
        long totalCount = 0;
        int splitSize = splitTableBeans.size();
        for (int i = 0; i < splitSize; i++) {
            SplitTableBean splitTableBean = splitTableBeans.get(i);
            try {
                TableName.set(splitTableBean.getSuffixName());
                totalCount += selCount(tClass, cnd);
            } finally {
                TableName.clear();
            }
        }
        return totalCount;

    }

    private static long selCount(Class tClass, Condition cnd) {
        String shiroKey = "";
        if (Constant.Redis.ENABLE == true) {
            String key = tClass.getName() + TableName.get() + cnd;
            log.info(key);
            shiroKey = Encrypt.e(key);
            log.info(shiroKey);
            long count = RedisUtil.getInstance().getSaveLong(shiroKey, -1);
            if (count != -1) {
                log.info("获取 ：" + count);
                return count;
            }
        }
        Entity tEntity = instance.dao.getEntity(tClass);
        String tName = tEntity.getTableName();
        Sql sql = Sqls.create("select count(1)  from " + tName + cnd.toString());
        sql.setCallback(Sqls.callback.integer());
        instance.dao.execute(sql);
        long count = sql.getInt();
        log.info("count:" + count);
        if (Constant.Redis.ENABLE == true) {
            log.info("存入:" + shiroKey + "  " + count);
            RedisUtil.getInstance().saveLong(shiroKey, count);
            RedisUtil.getInstance().expire(shiroKey, 10 * 60);//缓存10分钟
        }
        return count;
    }

    public static <T> List<SplitTableBean> getSplitTables(
            Class<T> tClass, Timestamp startTime, Timestamp endTime) {
        long currentTime = System.currentTimeMillis();
        //默认三个月前的时间
        if (startTime == null) {
            startTime = new Timestamp(currentTime - 3 * 30 * 24 * 60 * 60 * 1000L);
        }
        if (endTime == null || endTime.getTime() > currentTime) {
            endTime = new Timestamp(currentTime);
        }
        if (endTime.getTime() < startTime.getTime()) {
            endTime = startTime;
        }
        Dao dao = instance.dao;
        String tableName = dao.getEntity(tClass).getTableName();

        //查询数据所属表
        return dao.query(SplitTableBean.class,
                Cnd.wrap("WHERE table_name='" + tableName + "' AND (data_end_time>'" + startTime + "' AND creat_time<'" + endTime + "' OR data_end_time IS NULL)  ORDER BY id "));


    }

}
