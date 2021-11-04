package com.jxctdzkj.cloudplatform.controller;

import com.jxctdzkj.cloudplatform.bean.SysRightsBean;
import com.jxctdzkj.cloudplatform.config.Constant;
import com.jxctdzkj.cloudplatform.opLog.EnableOpLog;
import com.jxctdzkj.cloudplatform.service.RightsService;
import com.jxctdzkj.cloudplatform.utils.ResultObject;
import com.jxctdzkj.cloudplatform.utils.ReturnObject;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.nutz.dao.Cnd;
import org.nutz.dao.Dao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

@Slf4j
@RequestMapping({"rights"})
@Controller
public class RightsController {

    @Autowired
    Dao dao;

    @Autowired
    RightsService rightsService;


    @RequestMapping({""})
    public String index() {
        return "rights/rightsList";
    }

    @RequestMapping("newRightList")
    public String newRightList() {
        return "rights/rightsList2";
    }

    @RequestMapping({"getDetail"})
    public ModelAndView getDetail(String flag, Integer id) {
        if ("edit".equals(flag)) {
            SysRightsBean rights = dao.fetch(SysRightsBean.class, id);
            return new ModelAndView("rights/rightsDetail", "data", rights);
        }
        return new ModelAndView("rights/rightsDetail", "data", new SysRightsBean());
    }

    @RequestMapping({"getRightsList"})
    @ResponseBody
    public ResultObject getRightsList() {
        List<SysRightsBean> list = rightsService.getRightsList();
        return ResultObject.ok().data(list);
    }

    @EnableOpLog(Constant.ModifyType.SAVE)
    @RequestMapping({"saveRights"})
    @ResponseBody
    public void saveRights(SysRightsBean rights) {
        if (rights != null) {
            if (StringUtils.isBlank(rights.getUrl())) {
                rights.setUrl(null);
            }
            if (rights.getId() > 0) {
                dao.update(rights);
            } else {
                dao.insert(rights);
            }
        }
    }

    @EnableOpLog(Constant.ModifyType.SAVE)
    @ResponseBody//添加、修改
    @RequestMapping({"newSaveRights"})
    public void saveRights(SysRightsBean rights, Integer thisId, Integer upOrDown) {
        if (rights != null) {
            if (StringUtils.isBlank(rights.getUrl())) {
                rights.setUrl(null);
            }
            if (rights.getId() > 0) {//修改
                SysRightsBean fetch = dao.fetch(SysRightsBean.class, rights.getId());//需要修改的目标
                fetch.setUrl(rights.getUrl());
                fetch.setCate(rights.getCate());
                fetch.setName(rights.getName());
                fetch.setIcon(rights.getIcon());
                fetch.setEnName(rights.getEnName());
                if (rights.getId() != thisId) {
                    if (rights.getId() != thisId) {
                        SysRightsBean fetch1 = dao.fetch(SysRightsBean.class, thisId);
                        fetch.setParentId(fetch1.getParentId());
                        fetch.setLevel(fetch1.getLevel());
                        List<SysRightsBean> query1 = null;
                        if (upOrDown == 1) {//修改在此菜单的下方
                            fetch.setSort((fetch1.getSort()+1));
                            query1 = dao.query(SysRightsBean.class, Cnd.where("parent_id", "=", fetch1.getParentId()).and("sort", ">=", fetch1.getSort()).and("id", ">", fetch1.getId()).and("id", "!=", fetch.getId()).and("is_del", "=", 0));
                            twoHTwo(query1);
                        } else {//修改在此菜单的上方
                            fetch.setSort(fetch1.getSort());
                            query1 = dao.query(SysRightsBean.class, Cnd.where("parent_id", "=", fetch1.getParentId()).and("sort", ">=", fetch1.getSort()).and("id", ">", fetch1.getId()).and("id", "!=", fetch.getId()).and("is_del", "=", 0));
                        }
                        twoHTwo(query1);
                    }
                }
                dao.update(fetch);
            } else {//添加
                if (thisId != -1) {
                    SysRightsBean fetch = dao.fetch(SysRightsBean.class, thisId);//目标
                    List<SysRightsBean> query = null;
                    if (upOrDown == 0) {//目标上方
                        rights.setSort(fetch.getSort());
                        query = dao.query(SysRightsBean.class, Cnd.where("parent_id", "=", fetch.getParentId()).and("sort", ">=", fetch.getSort()).and("id", ">", fetch.getId()));
                        fetch.setSort((fetch.getSort()+1));
                        dao.update(fetch);
                    } else {//目标下方
                        rights.setSort(fetch.getSort()+1);
                        query = dao.query(SysRightsBean.class, Cnd.where("parent_id", "=", fetch.getParentId()).and("sort", ">=", fetch.getSort()).and("id", ">", fetch.getId()));
                        twoHTwo(query);
                    }
                    twoHTwo(query);
                }
                dao.insert(rights);
            }
        }
    }

    @EnableOpLog(Constant.ModifyType.DELETE)
    @RequestMapping({"deleteOperation"})
    @ResponseBody
    public ReturnObject deleteOperation(Integer id) {
        ReturnObject result = new ReturnObject();
        List<SysRightsBean> list = dao.query(SysRightsBean.class, Cnd.where("parent_id", "=", id));
        if (list != null && list.size() > 0) {
            result.setMsg("有子节点不能删除");
            result.setSuccess(false);
            return result;
        }
        dao.delete(SysRightsBean.class, id);
        result.setSuccess(true);
        return result;
    }

    @ResponseBody
    @RequestMapping({"newDeleteOperation"})
    public ResultObject newDeleteOperation(Integer id) {
        SysRightsBean fetch = dao.fetch(SysRightsBean.class, id);
        List<SysRightsBean> parent_id = dao.query(SysRightsBean.class, Cnd.where("parent_id", "=", id).and("is_del", "=", 0));
        if(parent_id.size() != 0){
            return ResultObject.error("warn15");
        }
        fetch.setIsDel("1");
        dao.update(fetch);
        return ResultObject.ok();
    }

    @ResponseBody
    @RequestMapping({"myRights"})
    public ReturnObject myRights(String userName) {
        ReturnObject result = new ReturnObject();
        List<String> data = rightsService.getRights(userName);
        result.setData(data);
        return result;
    }

    @ResponseBody
    @RequestMapping("getRightsListToFather")
    public ResultObject getRightsListToFather(Integer level) {
        List<SysRightsBean> sysRightsBeans = rightsService.selectAllToRight(level);
        return ResultObject.ok().data(sysRightsBeans);
    }

    @EnableOpLog(Constant.ModifyType.SAVE)
    @ResponseBody
    @RequestMapping("insertRightForSonList")
    public void insertRightForSonList(SysRightsBean s, Integer thisId, Integer upOrDown) {
        if (thisId != -1) {
            SysRightsBean fetch = dao.fetch(SysRightsBean.class, thisId);
            if (upOrDown == 0) {
                s.setSort(fetch.getSort());
            } else {
                s.setSort((fetch.getSort() + 1));
            }
            List<SysRightsBean> sort = dao.query(SysRightsBean.class, Cnd.where("sort", ">=", s.getSort()).and("level", "=", 2).and("id", "!=", s.getId()).and("isDel", "=", 0));
            if (2 > 1) {
                sort = dao.query(SysRightsBean.class, Cnd.where("sort", ">=", s.getSort()).and("level", "=", 2).and("parentId", "=", s.getParentId()).and("id", "!=", s.getId()).and("isDel", "=", 0));
            }
            twoHTwo(sort);
        }
        rightsService.insertRightForSonList(s);
    }

    @ResponseBody
    @RequestMapping("fatherIdGetSonList")
    public ResultObject fatherIdGetSonList(Integer id) {
        List<SysRightsBean> sysRightsBeans = rightsService.fatherIdGetSonList(id);
        return ResultObject.ok().data(sysRightsBeans);
    }

    @ResponseBody
    @RequestMapping("getRightToId")
    public SysRightsBean getRightToId(Integer id) {
        return rightsService.getRightToId(id);
    }

    @ResponseBody
    @RequestMapping("selectLikeToName")
    public List<SysRightsBean> selectLikeToName(String name) {
        List<SysRightsBean> sysRightsBeans = rightsService.selectLikeToName(name);
        return sysRightsBeans;
    }

    @EnableOpLog
    @ResponseBody
    @RequestMapping("updateRightListSort")
    public Integer updateRightListSort(Integer treeNodesId, Integer targetNodeId, Integer id) {
        SysRightsBean id1 = dao.fetch(SysRightsBean.class, Cnd.where("id", "=", treeNodesId));//移动
        SysRightsBean id2 = dao.fetch(SysRightsBean.class, Cnd.where("id", "=", targetNodeId));//目标
        if (id == 0) {
            if (id1.getLevel() > 1 && id2.getLevel() == 1) {
                return 1;
            } else {
                id1.setSort(id2.getSort());
                id1.setLevel(id2.getLevel());
                id1.setParentId(id2.getParentId());
                dao.update(id1);
                List<SysRightsBean> query = dao.query(SysRightsBean.class, Cnd.where("parent_id", "=", id2.getParentId()).and("sort", ">=", id2.getSort()).and("id", ">", id2.getId()).and("id", "!=", id1.getId()).and("is_del", "=", "0"));
                twoHTwo(query);
            }
        } else if (id == 1) {
            id1.setParentId(id2.getId());
            id1.setLevel((id2.getLevel()+1));
            id1.setSort(0);
            dao.update(id1);
        } else {
            if (id1.getLevel() > 1 && id2.getLevel() == 1) {
                return 1;
            } else {
                id1.setSort((id2.getSort()+1));
                id1.setLevel(id2.getLevel());
                id1.setParentId(id2.getParentId());
                dao.update(id1);
                List<SysRightsBean> query = dao.query(SysRightsBean.class, Cnd.where("parent_id", "=", id2.getParentId()).and("sort", ">=", id2.getSort()).and("id", ">", id2.getId()).and("id", "!=", id1.getId()).and("id", "!=", id2.getId()).and("is_del", "=", "0"));
                twoHTwo(query);
                twoHTwo(query);
            }
        }
        return 0;
    }

    //排序+1
    private void twoHTwo(List<SysRightsBean> query) {
        for (int i = 0; i < query.size(); i++) {
            query.get(i).setSort((query.get(i).getSort() + 1));
            dao.update(query.get(i));
        }
    }



}
