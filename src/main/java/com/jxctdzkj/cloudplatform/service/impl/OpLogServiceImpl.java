package com.jxctdzkj.cloudplatform.service.impl;

import com.jxctdzkj.cloudplatform.bean.OpLogBean;
import com.jxctdzkj.cloudplatform.service.OpLogService;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * @Description
 * @Author chanmufeng
 * @Date 2019/7/24 11:05
 **/
@Service
public class OpLogServiceImpl implements OpLogService {

    @Autowired
    Dao dao;

    @Override
    public void save(OpLogBean log) {
        dao.insert(log);
    }



}
