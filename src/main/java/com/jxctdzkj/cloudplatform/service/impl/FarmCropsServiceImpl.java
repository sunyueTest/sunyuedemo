package com.jxctdzkj.cloudplatform.service.impl;

import com.jxctdzkj.cloudplatform.bean.FarmCropsBean;
import com.jxctdzkj.cloudplatform.service.FarmCropsService;
import com.jxctdzkj.cloudplatform.utils.ControllerHelper;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import com.jxctdzkj.cloudplatform.utils.Utils;
import org.apache.commons.lang3.StringUtils;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.dao.Sqls;
import org.nutz.dao.pager.Pager;
import org.nutz.dao.sql.Sql;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

/**
 * 注意！！！！
 * 旧版农场管理和新版大棚管理都使用到了该接口
 * 修改时请注意测试兼容性
 * 禁止删除接口
 */
@Service
public class FarmCropsServiceImpl implements FarmCropsService {

    @Autowired
    Dao dao;

    @Override
    public ResultObject save(FarmCropsBean bean, String plantingDateStr, String harvestDateStr) throws Exception {
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        if (StringUtils.isNotBlank(plantingDateStr) && StringUtils.isNotBlank(harvestDateStr)) {
            long plantingDateLong = sdf.parse(plantingDateStr).getTime();
            long harvestDateLong = sdf.parse(harvestDateStr).getTime();
            if (plantingDateLong > harvestDateLong) {
                return ResultObject.apiError("收获日期不能早于种植日期");
            }
            bean.setPlantingDate(new Timestamp(plantingDateLong));
            bean.setHarvestDate(new Timestamp(harvestDateLong));
        }
        // 新增
        if (bean.getId() == 0) {
            bean.setCreateTime(Utils.getCurrentTimestamp());
            bean.setCreateUser(userName);
            bean.setDeleteFlag("0");
            return dao.insert(bean) != null ? ResultObject.ok("success") : ResultObject.apiError("fail");
        } else {
            FarmCropsBean oldBean = dao.fetch(FarmCropsBean.class, Cnd.where("id", "=", bean.getId()));
            if (oldBean != null) {
                bean.setCreateTime(oldBean.getCreateTime());
                bean.setCreateUser(oldBean.getCreateUser());
                bean.setDeleteFlag(oldBean.getDeleteFlag());
                return dao.update(bean) > 0 ? ResultObject.ok("success") : ResultObject.apiError("fail");
            } else {
                return ResultObject.apiError("fail");
            }
        }
    }

    @Override
    public ResultObject getFarmCropsList(int page, int size, String cropsName, String farmInfoId, String userName) throws Exception {
        //针对多级农户加的判断
        if (userName == null || "".equals(userName) || userName.equals(ControllerHelper.getInstance(dao).getLoginUserName())) {
            userName = ControllerHelper.getInstance(dao).getLoginUserName();
        }
        Cnd cnd = Cnd.where("create_user", "=", userName).and("delete_flag", "=", "0");
        if (StringUtils.isNotBlank(cropsName)) {
            cnd = cnd.and("crops_name", "like", "%" + cropsName + "%");
        }
        if (StringUtils.isNotBlank(farmInfoId)) {
            cnd = cnd.and("farm_info_id", "=", farmInfoId);
        }
        List<FarmCropsBean> list = dao.query(FarmCropsBean.class, cnd, new Pager(page, size));
        list.forEach(l -> {
            LocalDate today = LocalDate.now();
            Date plantingDate = l.getPlantingDate();
            Instant instant = plantingDate.toInstant();
            ZoneId zone = ZoneId.systemDefault();
            LocalDateTime localDateTime = LocalDateTime.ofInstant(instant, zone);
            LocalDate plantingLocalDate = localDateTime.toLocalDate();
            // 已种天数
            long plantingDays = ChronoUnit.DAYS.between(plantingLocalDate, today);
            l.setPlantingDays(String.valueOf(plantingDays));

            Date harvestDate = l.getHarvestDate();
            instant = harvestDate.toInstant();
            localDateTime = LocalDateTime.ofInstant(instant, zone);
            LocalDate harvestLocalDate = localDateTime.toLocalDate();
            // 发育到成熟总天数
            long totalDays = ChronoUnit.DAYS.between(plantingLocalDate, harvestLocalDate);
            l.setTotalDays(String.valueOf(totalDays));

            // 生长周期
            if (plantingDays == 0) {
                if (ChronoUnit.DAYS.between(harvestLocalDate, today) == 0) {
                    l.setGrowthCycle("成熟期");
                } else {
                    l.setGrowthCycle("苗期");
                }
            } else if (plantingDays >= totalDays) {
                l.setGrowthCycle("成熟期");
            } else {
                double percent = (plantingDays / (double) totalDays) * 100;
                if (percent < 33) {
                    l.setGrowthCycle("苗期");
                } else if (percent >= 33 && percent < 66) {
                    l.setGrowthCycle("成长期");
                } else {
                    l.setGrowthCycle("成熟期");
                }
            }
        });
        int count = dao.count(FarmCropsBean.class, cnd);
        return ResultObject.okList(list, page, size, count);
    }

    /**
     * 新版获取农作物增加type,农作物类别，植物0，动物1
     * 花房获取动、植物列表
     *
     * @param page
     * @param size
     * @param cropsName  名称
     * @param farmInfoId 农场、花房ID
     * @param type       动物还是植物类型分类
     * @return
     */
    @Override
    public ResultObject getFarmCropsListTwo(int page, int size, String cropsName, String farmInfoId, String type) throws Exception {
        String userName = ControllerHelper.getInstance(dao).getLoginUserName();
        Cnd cnd = Cnd.where("create_user", "=", userName).and("delete_flag", "=", "0").and("type", "=", type);
        if (StringUtils.isNotBlank(cropsName)) {
            cnd = cnd.and("crops_name", "like", "%" + cropsName + "%");
        }
        if (StringUtils.isNotBlank(farmInfoId)) {
            cnd = cnd.and("farm_info_id", "=", farmInfoId);
        }
        List<FarmCropsBean> list = dao.query(FarmCropsBean.class, cnd, new Pager(page, size));
        list.forEach(l -> {
            LocalDate today = LocalDate.now();
            Date plantingDate = l.getPlantingDate();
            Instant instant = plantingDate.toInstant();
            ZoneId zone = ZoneId.systemDefault();
            LocalDateTime localDateTime = LocalDateTime.ofInstant(instant, zone);
            LocalDate plantingLocalDate = localDateTime.toLocalDate();
            // 已种天数
            long plantingDays = ChronoUnit.DAYS.between(plantingLocalDate, today);
            l.setPlantingDays(String.valueOf(plantingDays));

            Date harvestDate = l.getHarvestDate();
            instant = harvestDate.toInstant();
            localDateTime = LocalDateTime.ofInstant(instant, zone);
            LocalDate harvestLocalDate = localDateTime.toLocalDate();
            // 发育到成熟总天数
            long totalDays = ChronoUnit.DAYS.between(plantingLocalDate, harvestLocalDate);
            l.setTotalDays(String.valueOf(totalDays));

            if ("0".equals(type)) {
                // 生长周期
                if (plantingDays == 0) {
                    if (ChronoUnit.DAYS.between(harvestLocalDate, today) == 0) {
                        l.setGrowthCycle("成熟期");
                    } else {
                        l.setGrowthCycle("苗期");
                    }
                } else if (plantingDays >= totalDays) {
                    l.setGrowthCycle("成熟期");
                } else {
                    double percent = (plantingDays / (double) totalDays) * 100;
                    if (percent < 33) {
                        l.setGrowthCycle("苗期");
                    } else if (percent >= 33 && percent < 66) {
                        l.setGrowthCycle("成长期");
                    } else {
                        l.setGrowthCycle("成熟期");
                    }
                }
            } else {
                // 生长周期
                if (plantingDays == 0) {
                    if (ChronoUnit.DAYS.between(harvestLocalDate, today) == 0) {
                        l.setGrowthCycle("成年期");
                    } else {
                        l.setGrowthCycle("幼生期");
                    }
                } else if (plantingDays >= totalDays) {
                    l.setGrowthCycle("成年期");
                } else {
                    double percent = (plantingDays / (double) totalDays) * 100;
                    if (percent < 33) {
                        l.setGrowthCycle("幼生期");
                    } else if (percent >= 33 && percent < 66) {
                        l.setGrowthCycle("成长期");
                    } else {
                        l.setGrowthCycle("成年期");
                    }
                }
            }

        });
        int count = dao.count(FarmCropsBean.class, cnd);
        return ResultObject.okList(list, page, size, count);
    }


    @Override
    public ResultObject del(String id) throws Exception {
        FarmCropsBean bean = dao.fetch(FarmCropsBean.class, Cnd.where("id", "=", id));
        if (bean != null) {
            bean.setDeleteFlag("1");
            return dao.update(bean) > 0 ? ResultObject.ok("success") : ResultObject.apiError("fail");
        } else {
            return ResultObject.apiError("fail");
        }
    }

    /**
     * 查询花房植物/动物个数，按名称统计
     *
     * @param farmId 花房ID
     * @param type   类型 植物：0，动物：1
     * @return
     * @User 李英豪
     */
    @Override
    public ResultObject findFarmCount(String farmId, String type) throws RuntimeException {
        StringBuffer sql = new StringBuffer();
        sql.append("SELECT crops_name,sum(botany_num) num ");
        sql.append("from farm_crops ");
        sql.append("where delete_flag=0 ");
        if (farmId != null && !"".equals(farmId)) {
            sql.append("and farm_info_id =@farmId ");
        }
        if (type != null && !"".equals(type)) {
            sql.append("and type =@type ");
        }
        sql.append("group by crops_name");
        Sql sqls = Sqls.create(sql.toString());
        sqls.setParam("farmId", farmId).setParam("type", type);
        sqls.setCallback(Sqls.callback.records());
        sqls.forceExecQuery();
        dao.execute(sqls);
        List<String> list = (List<String>) sqls.getResult();
        return ResultObject.ok(list);
    }

}