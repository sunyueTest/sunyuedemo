package com.jxctdzkj.cloudplatform.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@Slf4j
@RequestMapping({"consolePanel"})
public class ConsolePanelController {

    @RequestMapping({""})
    public String index() {
        return "consolePanel/consolePanel";
    }
}
