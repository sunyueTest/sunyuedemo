package com.jxctdzkj.cloudplatform.service;

import com.jxctdzkj.cloudplatform.bean.SysRightsBean;

import java.util.List;

public interface RightsService {

    List<SysRightsBean> getMenus(int roleId);

    List<String> getRights(String userName);

    List<String> getRealm(String userName);

    List<SysRightsBean> getRightsList();

    List<SysRightsBean> selectAllToRight(Integer level);

    void insertRightForSonList(SysRightsBean s);

    List<SysRightsBean> fatherIdGetSonList(Integer id);

    SysRightsBean getRightToId(Integer id);

    List<SysRightsBean> selectLikeToName(String name);

}
