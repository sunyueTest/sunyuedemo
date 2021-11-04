package com.jxctdzkj.cloudplatform.service.impl;

import com.jxctdzkj.cloudplatform.bean.ConfigurationTypeBean;
import com.jxctdzkj.cloudplatform.service.ConfigurationService;
import com.jxctdzkj.cloudplatform.utils.ControllerHelper;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import org.apache.commons.lang3.StringUtils;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.dao.pager.Pager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @Auther huangwei
 * @Date 2019/12/3
 **/
@Service
public class ConfigurationServiceImpl implements ConfigurationService {

    @Autowired
    Dao dao;

    //获取参数列表
    @Override
    public ResultObject getArgsList(int page, int size,String typeName) {
        //
        String userName = ControllerHelper.getLoginUserName();
        Cnd and = Cnd.where("user_name", "=", userName).and("is_del", "=", 0);
        if(StringUtils.isNotBlank(typeName)){
            and.and("typeName","like","%"+typeName+"%");
        }
        List<ConfigurationTypeBean> beans = dao.query(ConfigurationTypeBean.class, and, new Pager(page, size));
        int count = dao.count(ConfigurationTypeBean.class, and);
        return  ResultObject.okList(beans,page, size,count);
    }
}
