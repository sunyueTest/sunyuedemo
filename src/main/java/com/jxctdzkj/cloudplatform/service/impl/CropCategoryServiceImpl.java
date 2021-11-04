package com.jxctdzkj.cloudplatform.service.impl;

import com.jxctdzkj.cloudplatform.bean.CropCategoryBean;
import com.jxctdzkj.cloudplatform.service.CropCategoryService;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CropCategoryServiceImpl implements CropCategoryService {
    @Autowired
    Dao dao;

    /**
     * 根据农物大类别ID查询该类别下所有小类别信息
     *
     * @param categoryId
     * @param type       小类别名字
     * @return
     * @User 李英豪
     */
    @Override
    public ResultObject findCropCategoryList(long categoryId, String type) throws RuntimeException {
        Cnd cnd = Cnd.where("category_id", "=", categoryId)
                .and("is_del", "=", 0);
        if (type != null && !"".equals(type)) {
            cnd.and("type", "like", "%" + type + "%");
        }
        List<CropCategoryBean> list = dao.query(CropCategoryBean.class, cnd);
        int count = dao.count(CropCategoryBean.class, cnd);
        return ResultObject.okList(list, 0, 0, count);
    }

    /**
     * 根据农物小类别ID删除该小类别
     *
     * @param id
     * @return
     * @User 李英豪
     */
    @Override
    public ResultObject delCropCategory(long id) throws RuntimeException {
        CropCategoryBean bean = dao.fetch(CropCategoryBean.class, Cnd.where("is_del", "=", "0").and("id", "=", id));
        if (bean != null) {
            bean.setIsDel(1);
            dao.update(bean);
            return ResultObject.ok("warn58");
        } else {
            return ResultObject.apiError("error14");
        }
    }

    /**
     * 农作物小类别添加
     *
     * @param categoryName 大作物类别名称
     * @param categoryId   大作物ID
     * @param type         小作物名称
     * @return
     * @User 李英豪
     */
    @Override
    public ResultObject addCropCategory(String categoryName, long categoryId, String type) throws RuntimeException {
        CropCategoryBean bean = dao.fetch(CropCategoryBean.class, Cnd.where("is_del", "=", "0").and("type", "=", type));
        if (bean!=null) {
            return ResultObject.apiError("warn62");
        }else{
            CropCategoryBean cropCategoryBean=new CropCategoryBean();
            cropCategoryBean.setCategory(categoryName);
            cropCategoryBean.setCategoryId(categoryId);
            cropCategoryBean.setType(type);
            dao.insert(cropCategoryBean);
        }
        return ResultObject.ok("ok2");
    }
}
