package com.jxctdzkj.cloudplatform.service.impl;

import com.jxctdzkj.cloudplatform.bean.*;
import com.jxctdzkj.cloudplatform.service.VersionManageService;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import lombok.extern.slf4j.Slf4j;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.nutz.trans.Trans;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class VersionManageServiceImpl implements VersionManageService {
    @Autowired
    Dao dao;

    @Override
    public List<SysVersionConfigBean> getVersionList() {
        try {
            return dao.query(SysVersionConfigBean.class, null);
        } catch (Exception e) {
            log.info(e.getMessage());
            return null;
        }
    }

    @Override
    public SysVersionConfigBean getVersionDetail(int id) {
        try {
            return dao.fetch(SysVersionConfigBean.class, id);
        } catch (Exception e) {
            log.info(e.getMessage());
        }
        return null;
    }

    @Override
    public Integer updateVersion(SysVersionConfigBean version) {
        return dao.update(version);
    }

    @Override
    public ResultObject insertVersion(SysVersionConfigBean version) {
        try {
            dao.insert(version);
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResultObject.apiError("err113");
        }
        return ResultObject.ok("ok2");
    }


    @Override
    public ResultObject deleteVersion(int id) {
        try {
            dao.delete(SysVersionConfigBean.class, id);
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResultObject.apiError("err114");
        }
        return ResultObject.ok("ok3");
    }


}
