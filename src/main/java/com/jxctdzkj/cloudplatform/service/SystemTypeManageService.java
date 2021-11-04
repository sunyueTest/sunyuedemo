package com.jxctdzkj.cloudplatform.service;

import com.jxctdzkj.cloudplatform.bean.SystemTypeBean;
import com.jxctdzkj.cloudplatform.utils.ResultObject;


public interface SystemTypeManageService {

    ResultObject getSystemTypeList(Integer page, Integer size, String name);

    ResultObject saveOrUpdate(SystemTypeBean bean) throws Exception;
}
