package com.jxctdzkj.cloudplatform.service;

import com.jxctdzkj.cloudplatform.bean.SysRightsBean;
import com.jxctdzkj.cloudplatform.bean.SysVersionConfigBean;
import com.jxctdzkj.cloudplatform.utils.ResultObject;

import java.util.List;

public interface VersionManageService {

    List<SysVersionConfigBean> getVersionList();

    SysVersionConfigBean getVersionDetail(int id);

    Integer updateVersion(SysVersionConfigBean version);

    ResultObject insertVersion(SysVersionConfigBean version);

    ResultObject deleteVersion(int id);



}
