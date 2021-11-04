package com.jxctdzkj.cloudplatform.service.impl;

import com.jxctdzkj.cloudplatform.bean.SystemTypeBean;
import com.jxctdzkj.cloudplatform.service.SystemTypeManageService;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.dao.pager.Pager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@Transactional
public class SystemTypeManageServiceImpl implements SystemTypeManageService {
    @Autowired
    Dao dao;

    @Override
    public ResultObject getSystemTypeList(Integer page, Integer size, String name) {
        Cnd cnd = Cnd.where("1", "=", 1);
        if (StringUtils.isNotBlank(name)) {
            cnd = cnd.and("name", "like", "%" + name + "%");
        }
        List<SystemTypeBean> list = dao.query(SystemTypeBean.class, cnd, new Pager(page, size));
        int count = dao.count(SystemTypeBean.class, cnd);
        return ResultObject.okList(list, page, size, count);
    }

    @Override
    public ResultObject saveOrUpdate(SystemTypeBean bean) throws Exception {

        // 新增
        if (bean.getId() == 0) {
            if (dao.insert(bean) == null) {
                throw new RuntimeException("类型添加失败");
            }
        } else {
            SystemTypeBean oldBean = dao.fetch(SystemTypeBean.class, Cnd.where("id", "=", bean.getId()));
            if (oldBean != null) {
                oldBean.setName(bean.getName());
                oldBean.setPath(bean.getPath());
                oldBean.setType(bean.getType());
                oldBean.setRemarks(bean.getRemarks());
                if (dao.update(oldBean) <= 0) {
                    throw new RuntimeException("系统类型更新失败");
                }
            } else {
                throw new RuntimeException("找不到对应系统类型");
            }
        }
        return ResultObject.ok("success");
    }

}
