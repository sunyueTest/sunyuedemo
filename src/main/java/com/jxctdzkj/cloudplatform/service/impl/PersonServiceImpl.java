package com.jxctdzkj.cloudplatform.service.impl;

import com.jxctdzkj.cloudplatform.bean.PersonBean;
import org.nutz.dao.Dao;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

public class PersonServiceImpl {
    @Autowired
    Dao dao;

    public int getPersonNum(String userName) {


        return 100;
    }

    private void getPersonNum(String userName, List<PersonBean> list){
        
    }

}
