package com.jxctdzkj.cloudplatform.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("gingerIndex")
public class GingerIndexController {

    @RequestMapping("")
    public String gingerIndex(){
        return "gingerIndex/gingerIndex";
    }

}
