$(document).ready(function () {
        let tableData, hot, layer, style,
            //待删除的列在前端表格中对应的下标
            toBeRemovedCols = '',
            //待删除的行对应的数据库的主键id
            toBeRemovedRows = '';
        const sortedWarn = '排序状态下不能进行编辑，请先取消排序列的排序状态';
        let colorMap = new Map();
        colorMap.set("#E91E63", "primary");
        colorMap.set("#C2185B", "primary_dark");
        colorMap.set("#F8BBD0", "primary_light");
        colorMap.set("#CDDC39", "accent");
        colorMap.set("#212121", "primary_text");
        colorMap.set("#727272", "secondary_text");
        colorMap.set("#B6B6B6", "divider");

        layui.use('layer', function () {
            layer = layui.layer;
        });

        //数据是否被更改的标识
        var changed = false;

        $.ajax({
            url: "../dynamicTable/selDetail",
            data: {"rightId": $("#rightId").val()},
            dataType: "json",
            type: "get",
            timeout: 30000,
            error: function (data, type, err) {

                // layer.closeAll('loading');
            },
            success: function (res) {
                if ('success' == res.state) {
                    tableData = res.data.data;
                    style = res.data.style;
                    console.log("收到初始化表格数据");
                    console.log(res.data);
                    initDynamicTable(tableData, style);
                } else {
                    console.log("error");
                    // layer.closeAll('loading');
                }
            }
        });

        function initDynamicTable(data, style) {
            var container = document.getElementById('example');

            hot = new Handsontable(container, {
                data: tableData,//挂载的数据

                rowHeaders: true,
                colHeaders: true,
                manualColumnResize: true,//允许手动调整列高
                manualRowResize: true,//允许手动调整行宽
                // manualColumnMove: true,
                // manualRowMove: true,
                // headerTooltips: true,
                dropdownMenu: true,//允许下拉菜单
                columnSorting: true,//允许列排序
                //右键菜单选项
                contextMenu: [
                    'row_above', 'row_below',// '---------',
                    'col_left', 'col_right', //'---------',
                    'remove_row', 'remove_col', //'---------',
                    'cut', 'copy'
                ],//右键菜单
                // bindRowsWithHeaders: 'strict',
                language: 'zh-CN',
                // all 全列按最大宽度展开; none 紧缩的表格; last 最后一列展开
                stretchH: 'all',
                //表格第0列存储的时数据库表记录的主键，默认隐藏
                // hiddenColumns: {
                //     columns: [0],
                // },
                // //隐藏第0行
                // hiddenRows: {
                //     rows: [0],
                // },
                //多选时，只能选择连续的行/列
                selectionMode: 'range',
                autoColumnSize: true,//自适应列大小
                filters: true,//开启过滤功能
                currentRowClassName: 'currentRow',//选中当前行的样式class名称
                currentColClassName: 'currentCol',//选中当前列的样式class名称
                colWidths: [60],
                rowHeights: [10],
                className: "htCenter htMiddle",
                observeChanges: true//检测内容变动
            });

            //设置第一行和第一列主键id列为只读
            hot.updateSettings({
                cells: function (row, col) {
                    var cellProperties = {};

                    if (col == 0 || row == 0) {
                        cellProperties.readOnly = true;
                    }
                    return cellProperties;
                }
            });

            //设置初始化单元格样式
            for (let i = 0; i < style.length; i++) {
                setStyle(style[i].row, style[i].col, style[i].className);
            }

            hot.addHook('afterRender', function (flag) {
                console.log("表格被重新渲染！！！！！");
            });

            hot.addHook('beforeChange', function (changeData, source) {
                console.log(changeData);
                if (isSort()) {
                    layer.msg(sortedWarn);
                    return false;
                }
            });

            //添加单元格改变的触发事件
            hot.addHook('afterChange', function (changeData, source) {
                // changeData 是一个二维数组，记录所有修改信息
                console.log(changeData);

                //判断修改的元素的值和原来相比是否发生变化，如果有变化则执行上传操作，否则不上传
                let flag = false;
                for (let i = 0; i < changeData.length; i++) {
                    if (changeData[i] && changeData[i][2] != changeData[i][3]) {
                        flag = true;
                        break;
                    }
                }
                if (!flag) return;

                let change = changeData[0],
                    row = change[0],
                    colProp = change[1];
                console.log("\"信息改变！\",主键id： " + tableData[row][0]);

                //由于设置隐藏列的主键值会触发单元格修改的事件，因此这里添加约束
                if (colProp == 0) {
                    return;
                }
                //拼接参数
                let cols = '', newValues = '', ids = '';
                for (let i = 0; i < changeData.length; i++) {
                    cols += tableData[0][changeData[i][1]];
                    newValues += (changeData[i][3] == '' || changeData[i][3] == null) ? ' ' : changeData[i][3];
                    ids += tableData[changeData[i][0]][0];
                    if (i != changeData.length - 1) {
                        cols += ",";
                        newValues += ",";
                        ids += ",";
                    }
                }
                console.log("修改的数据库列" + cols);
                console.log("修改之后的值" + newValues);
                console.log("修改的id" + ids);
                $.ajax({
                    url: "../dynamicTable/report",
                    data: {
                        "rightId": $("#rightId").val(),
                        "cols": cols,
                        "newValues": newValues,
                        "type": "save",
                        "ids": ids
                    },
                    dataType: "json",
                    timeout: 30000,
                    error: function (data, type, err) {
                        console.log(err);
                        // layer.closeAll('loading');
                    },
                    success: function (data) {
                        if ('success' == data.state) {
                            console.log(data.data);
                            //为新创建的行的第一个单元格设置MySQL记录的主键值
                            if (data.data && data.data.newId) {
                                tableData[row][0] = data.data.newId;
                            }
                            console.log("修改成功： " + tableData[row][0]);
                        } else {
                            layer.msg($.i18n.prop(data.msg), {icon: 2});
                        }
                    }
                });
            });

            //新增一行的触发事件
            hot.addHook('afterCreateRow', function (index, amount, source) {
                console.log("新增一行");
                console.log(index);
                console.log(amount);
                $.ajax({
                    url: "../dynamicTable/report",
                    data: {
                        "rightId": $("#rightId").val(),
                        "newRowIndex": index,
                        "type": "newRow"
                    },
                    dataType: "json",
                    timeout: 30000,
                    error: function (data, type, err) {
                        console.log(err);
                    },
                    success: function (data) {
                        if ('success' == data.state) {
                            //为新创建的行的第一个单元格设置MySQL记录的主键值
                            if (data.data && data.data.newId) {
                                tableData[index][0] = data.data.newId;
                            }
                            console.log("添加行成功: " + tableData[index][0]);
                        } else {
                            layer.msg($.i18n.prop(data.msg), {icon: 2});
                        }
                    }
                });
            });

            //新增一列的触发事件
            hot.addHook('afterCreateCol', function (index, amount, source) {
                console.log("新增一列");
                console.log(index);
                console.log(amount);
                $.ajax({
                    url: "../dynamicTable/report",
                    data: {
                        "rightId": $("#rightId").val(),
                        "newColIndex": index,
                        "type": "newCol"
                    },
                    dataType: "json",
                    timeout: 30000,
                    error: function (data, type, err) {
                        console.log(err);
                    },
                    success: function (data) {
                        if ('success' == data.state) {
                            //为新创建的行的第一个单元格设置MySQL记录的主键值
                            if (data.data && data.data.newColumn) {
                                console.log(data.data);
                                tableData[0][index] = data.data.newColumn;
                            }
                            console.log("添加列成功");
                        } else {
                            layer.msg($.i18n.prop(data.msg), {icon: 2});
                        }
                    }
                });
            });

            //删除行之前的触发事件
            hot.addHook('beforeRemoveRow', function (index, amount, physicalRows) {
                if (isSort()) {
                    layer.msg(sortedWarn);
                    return false;
                }

                let len = physicalRows.length;
                if (tableData.length - len < 2) {
                    layer.msg($.i18n.prop('rowsMustMoreThanOne'));
                    return false;
                }
                toBeRemovedRows = '';
                //在此记录待删除的行主键值
                for (let i = 0; i < len; i++) {
                    toBeRemovedRows += tableData[physicalRows[i]][0];
                    if (i != len - 1) {
                        toBeRemovedRows += ",";
                    }
                }
                console.log("待删除的行在数据表的id为" + toBeRemovedRows);
                console.log("删除的行数据如下");
                console.log(physicalRows);
            });

            /**
             *  删除行的触发事件
             */
            hot.addHook('afterRemoveRow', function (index, amount, physicalRows) {
                console.log("删除一行: " + index);
                console.log("删除的行数据如下");
                console.log(physicalRows);

                //前端表格中被删除的行的坐标
                var tableRowIndexs = "";
                for (let i = 0; i < physicalRows.length; i++) {
                    tableRowIndexs += physicalRows[i];
                    if (i != physicalRows.length - 1) {
                        tableRowIndexs += ",";
                    }
                }

                $.ajax({
                    url: "../dynamicTable/report",
                    data: {
                        "rightId": $("#rightId").val(),
                        "ids": toBeRemovedRows,
                        "rowIds": tableRowIndexs,
                        "type": "delRow"
                    },
                    dataType: "json",
                    timeout: 30000,
                    error: function (data, type, err) {
                        console.log(err);
                    },
                    success: function (data) {
                        if ('success' == data.state) {
                            console.log("删除行成功");
                        } else {
                            layer.msg($.i18n.prop(data.msg), {icon: 2});
                        }
                    }
                });
            });

            //删除列之后的触发事件
            hot.addHook('afterRemoveCol', function (index, amount, physicalRows) {
                console.log("删除一列: " + index);
                console.log("删除的列数据如下");
                console.log(physicalRows);
                $.ajax({
                    url: "../dynamicTable/report",
                    data: {
                        "rightId": $("#rightId").val(),
                        "removedColIndexs": toBeRemovedCols,
                        "type": "delCol"
                    },
                    dataType: "json",
                    timeout: 30000,
                    error: function (data, type, err) {
                        console.log(err);
                    },
                    success: function (data) {
                        if ('success' == data.state) {
                            console.log("删除列成功");
                        } else {
                            layer.msg($.i18n.prop(data.msg), {icon: 2});
                        }
                    }
                });
            });

            //删除列之前的触发事件
            hot.addHook('beforeRemoveCol', function (index, amount, physicalColumns) {
                if (isSort()) {
                    layer.msg(sortedWarn);
                    return false;
                }

                toBeRemovedCols = '';
                let len = physicalColumns.length;
                if (tableData[0].length - len < 2) {
                    layer.msg($.i18n.prop('colsMustMoreThanOne'));
                    return false;
                }

                for (let i = 0; i < physicalColumns.length; i++) {
                    toBeRemovedCols += physicalColumns[i];
                    if (i != physicalColumns.length - 1) {
                        toBeRemovedCols += ",";
                    }
                }
            });


            //添加一列之前的触发事件
            //总列数不能超过20
            hot.addHook('beforeCreateCol', function (index, amount) {
                if (isSort()) {
                    layer.msg(sortedWarn);
                    return false;
                }
                if (tableData[0].length == 21) {
                    layer.msg($.i18n.prop('colsNotMoreThan20'));
                    return false;
                }
            });

            //添加一行之前的触发事件
            //总行数不能超过200
            hot.addHook('beforeCreateRow', function (index, amount) {
                if (isSort()) {
                    layer.msg(sortedWarn);
                    return false;
                }
                if (tableData.length == 200) {
                    layer.msg($.i18n.prop('rowsNotMoreThan200'));
                    return false;
                }
            });

            /**
             * 单元格元属性被修改后触发(className)
             */
            hot.addHook('afterSetCellMeta', function (row, column, key, value) {
                console.log("单元格样式修改上传服务器");
                console.log("row: " + row + " column: " + column + " key: " + key + " value: " + value);
                $.ajax({
                    url: "../dynamicTable/report",
                    data: {
                        "rightId": $("#rightId").val(),
                        "valueId": tableData[row][0],
                        "columnId": tableData[0][column],
                        "className": value,
                        "type": "changeStyle"
                    },
                    dataType: "json",
                    timeout: 30000,
                    error: function (data, type, err) {
                        console.log(err);
                    },
                    success: function (data) {
                        if ('success' == data.state) {
                        } else {
                            layer.msg($.i18n.prop(data.msg), {icon: 2});
                        }
                    }
                });
            });


            // 列出全局变量
            let Crow, Ccol, Ccell, valT, selectRange, selectRangeArr = [];
            // 获取所选区域单元格数组 当前高亮
            hot.addHook('afterOnCellMouseUp', function (event, cellCoords) {
                // console.log("鼠标抬起事件触发");
                // console.log(cellCoords);
                Crow = cellCoords.row, Ccol = cellCoords.col;
                selectRangeArr = []; // 所选区域所有单元格数组
                Ccell = hot.getCell(Crow, Ccol)
                selectRange = hot.getSelected(); // 获取所选区域范围
                var txt = hot.getDataAtCell(selectRange[0][0], selectRange[0][1]); // 获取所选区域第一个单元格值
                // 单击任意单元格取消编辑状态
                // $(".handsontableInputHolder").css({
                //     "display": "none"
                // });
                $("#templateCellInput").val(txt);
                var rangeRowArr = []; // 所选区域行数组
                var rangeColArr = []; // 所选区域列数组
                for (var i = selectRange[0][0]; i < selectRange[0][2] + 1; i++) {
                    rangeRowArr.push(i);
                }
                for (var i = selectRange[0][1]; i < selectRange[0][3] + 1; i++) {
                    rangeColArr.push(i);
                }
                // $("td").removeClass("currentTd");
                for (var i = 0; i < rangeRowArr.length; i++) {
                    for (var n = 0; n < rangeColArr.length; n++) {
                        var selectRangeCell = {row: rangeRowArr[i], col: rangeColArr[n]};
                        selectRangeArr.push(selectRangeCell);
                        // var rangeCell = hot.getCell(selectRangeArr[i].row, selectRangeArr[i].col);
                        // $(rangeCell).addClass("currentTd");
                    }
                }
            });

            // 添加表格失去焦点时的当前单元格类
            hot.addHook('afterOnCellMouseDown', function (event, cellCoords) {
                // console.log("鼠标左键按下的事件触发");
                // Crow = cellCoords.row, Ccol = cellCoords.col;
                // var curCell = hot.getCell(Crow, Ccol);
                // $(curCell).addClass("currentTd");
                // for (var i = 0; i < selectRangeArr.length; i++) {
                //     var rangeCell = hot.getCell(selectRangeArr[i].row, selectRangeArr[i].col);
                //     $(rangeCell).removeClass("currentTd");
                // }

                // $("td").removeClass("currentTd");
                // for (var i = 0; i < selectRangeArr.length; i++) {
                //     var rangeCell = hot.getCell(selectRangeArr[i].row, selectRangeArr[i].col);
                //     $(rangeCell).addClass("currentTd");
                // }
            });

            // 所选单元格的值和input同步
            $("#templateCellInput").keyup(function () {
                var val = $(this).val();
                if (selectRangeArr.length > 0) {
                    hot.setDataAtCell(selectRangeArr[0].row, selectRangeArr[0].col, val)
                }
            });

            /**
             * 列排序，注意列排序后需要重新计算行id和索引之间的映射关系
             */
            $('#sortDiv').click(function () {
                if (selectRangeArr.length == 0) {
                    layer.msg('请先选中待排序列', {icon: 2});
                }
                let config = hot.getPlugin('columnSorting').getSortConfig(selectRangeArr[0].col);
                //如果该列未曾被排序,则升序
                if (config == undefined) {
                    // 对所选区域第一个单元格所在列进行排序
                    hot.getPlugin('columnSorting').sort({
                        column: selectRangeArr[0].col,
                        sortOrder: 'asc'
                    });
                } else if (config.sortOrder == 'asc') {
                    //如果已被升序，则降序
                    hot.getPlugin('columnSorting').sort({
                        column: selectRangeArr[0].col,
                        sortOrder: 'desc'
                    });
                } else {
                    //清除排序，恢复现场
                    hot.getPlugin('columnSorting').clearSort();
                }

            });

            /**
             * 清除数据及样式
             */
            $('#clearDiv').click(function () {
                if (selectRangeArr.length == 0) {
                    layer.msg('请先选中待清除区域', {icon: 2});
                }

                //拼接参数
                let cols = '', newValues = '', ids = '';
                for (let i = 0; i < selectRangeArr.length; i++) {
                    cols += tableData[0][selectRangeArr[i].col];
                    newValues += ' ';
                    ids += tableData[selectRangeArr[i].row][0];
                    if (i != selectRangeArr.length - 1) {
                        cols += ",";
                        newValues += ",";
                        ids += ",";
                    }
                }
                // 修改所选区域所有单元格样式并赋予属性
                let changeArr = [];
                let tempArr = [];
                for (let i = 0; i < selectRangeArr.length; i++) {
                    tempArr = [];
                    tempArr.push(selectRangeArr[i].row, selectRangeArr[i].col, '');
                    changeArr.push(tempArr);
                    hot.setCellMeta(selectRangeArr[i].row, selectRangeArr[i].col, "className", "htMiddle htCenter");
                }
                //批量清除单元格内容
                hot.setDataAtCell(changeArr);
                // console.log(changeArr);


            });

            /**
             * 修改单元格样式
             */
            $(".style-btn div.btn").click(function (e) {
                if (isSort()) {
                    layer.msg(sortedWarn);
                    return;
                }
                console.log(e.target);
                var id = $(this).attr("id");
                var styleType = $(this).parent();
                var StyleClassName = '';

                // 修改单元格文本样式
                var toogleSwitch = true;
                if (styleType.hasClass("font-style")) {
                    var fontClass = "";
                    switch (id) {
                        case "bold-div" :
                            fontClass = "htBold"; // 加粗
                            break;
                        case "underline-div" :
                            fontClass = "htUnderline"; // 下划线
                            break;
                    }
                    StyleClassName = fontClass;
                }

                // 修改单元格对齐方式
                if (styleType.hasClass("align-style")) {
                    var alignClass = "";
                    switch (id) {
                        case "left-div" :
                            alignClass = "htLeft"; // 左对齐
                            break;
                        case "center-div" :
                            alignClass = "htCenter"; // 居中对齐
                            break;
                        case "right-div" :
                            alignClass = "htRight"; // 右对齐
                            break;
                    }
                    StyleClassName = alignClass;
                }

                // 定义修改类名 创建对应属性方法
                var setRangeCellClass = function (index, rangeCell, originClassName) {
                    if (styleType.hasClass("align-style")) {
                        $(rangeCell).removeClass("htLeft htCenter htRight htJustify");
                        hot.setCellMeta(selectRangeArr[index].row, selectRangeArr[index].col, "className", deleteClassString(originClassName, ['htLeft', 'htCenter', 'htRight']) + ' ' + StyleClassName);
                    } else {
                        hot.setCellMeta(selectRangeArr[index].row, selectRangeArr[index].col, "className", toggleClassString(originClassName, StyleClassName));
                    }
                    $(rangeCell).toggleClass(StyleClassName);
                    // var cellClass = $(rangeCell)[0].className;

                };

                // 修改所选区域所有单元格样式并赋予属性
                for (var i = 0; i < selectRangeArr.length; i++) {
                    let rangeCell = hot.getCell(selectRangeArr[i].row, selectRangeArr[i].col);
                    let originClassName = hot.getCellMeta(selectRangeArr[i].row, selectRangeArr[i].col).className;

                    setRangeCellClass(i, rangeCell, originClassName);
                }
            });

            /**
             * 设置字体颜色
             */
            $('[name="unique-name-1"]').paletteColorPicker({
                onchange_callback: function (clicked_color) {
                    if (isSort()) {
                        layer.msg(sortedWarn);
                        return;
                    }
                    console.log('onchange_callback!!!');
                    console.log(clicked_color);

                    // 定义改变样式方法
                    let value = clicked_color, newClassName;
                    var changeCellStyle = function (index, rangeCell, originClassName) {
                        newClassName = handleString(originClassName, '_fcolor') + " " + colorMap.get(value) + '_fcolor';
                        $(rangeCell).removeClass().addClass(newClassName);
                        $(rangeCell).css({"color": value});
                        $('.font-color').css({"color": value});
                        hot.setCellMeta(selectRangeArr[index].row, selectRangeArr[index].col, "className", newClassName);
                    };
                    for (let i = 0; i < selectRangeArr.length; i++) {
                        let originClassName = hot.getCellMeta(selectRangeArr[i].row, selectRangeArr[i].col).className;
                        let rangeCell = hot.getCell(selectRangeArr[i].row, selectRangeArr[i].col);
                        console.log(hot.getCellMeta(selectRangeArr[i].row, selectRangeArr[i].col).className + "    ////////////");
                        console.log(hot.getCellMeta(selectRangeArr[i].row, selectRangeArr[i].col));

                        changeCellStyle(i, rangeCell, originClassName);
                    }
                }
            });

            /**
             * 设置背景颜色
             */
            $('[name="unique-name-2"]').paletteColorPicker({
                onchange_callback: function (clicked_color) {
                    if (isSort()) {
                        layer.msg(sortedWarn);
                        return;
                    }
                    // 定义改变样式方法
                    let value = clicked_color, newClassName;
                    var changeCellStyle = function (index, rangeCell, originClassName) {
                        //设置背景色之前需要把class中关于背景色的属性清除，否则设置背景色不会立即生效
                        newClassName = handleString(originClassName, '_bkgcolor') + " " + colorMap.get(value) + "_bkgcolor";
                        $(rangeCell).removeClass().addClass(newClassName);
                        $(rangeCell).css({"background-color": value});
                        hot.setCellMeta(selectRangeArr[index].row, selectRangeArr[index].col, "className", newClassName);
                    };
                    for (let i = 0; i < selectRangeArr.length; i++) {
                        let originClassName = hot.getCellMeta(selectRangeArr[i].row, selectRangeArr[i].col).className;
                        let rangeCell = hot.getCell(selectRangeArr[i].row, selectRangeArr[i].col);
                        console.log(hot.getCellMeta(selectRangeArr[i].row, selectRangeArr[i].col).className + "    修改之前的className");
                        changeCellStyle(i, rangeCell, originClassName);
                    }
                }
            });

            //选择更多，改变字体颜色
            // $('.more-color').colpick({
            //     colorScheme: 'dark',
            //     layout: 'rgbhex',
            //     color: '000000',
            //     onSubmit: function (hsb, hex, rgb, el) {
            //         var id = $(el).attr('id');
            //         switch (id) {
            //             case "more-color":
            //                 $('#color-bottom-line').css('color', '#' + hex);
            //                 break;
            //             case "more-bgcolor":
            //                 $('#bg-color-bottom-line').css('background-color', '#' + hex);
            //                 break;
            //         }
            //         $(el).colpickHide();
            //
            //
            //     }
            // });

            //点击图标，直接更改颜色
            $('.color-btn').click(function () {
                let id = $(this).attr('id');
                let value = '';
                if (id == 'bgcolor-div') {
                    value = $('#bg-color-bottom-line').css('background-color');
                } else {
                    value = $('#color-bottom-line').css('color');
                }
                var changeCellStyle = function (index, rangeCell) {
                    if (id == 'bgcolor-div') {
                        $(rangeCell).css({"background-color": value});
                        hot.setCellMeta(selectRangeArr[index].row, selectRangeArr[index].col, "bgColor", value);
                    }
                    if (id == 'color-div') {
                        $(rangeCell).css({"color": value});
                        hot.setCellMeta(selectRangeArr[index].row, selectRangeArr[index].col, "fontColor", value);
                    }
                };

                for (let i = 0; i < selectRangeArr.length; i++) {
                    let rangeCell = hot.getCell(selectRangeArr[i].row, selectRangeArr[i].col);
                    changeCellStyle(i, rangeCell);
                }
            });
        }

        $("#example-container").height($(window).height());

        /**
         * 空格分隔的字符串排除含有指定字符串的单词
         * @param str
         * @param suffix
         * @returns {string}
         */
        function handleString(str, suffix) {
            console.log(">>>handleString 之前：" + str);
            let res = '';
            let arr = str.split(' ');
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].indexOf(suffix) == -1) {
                    res += arr[i] + ' ';
                }
            }
            console.log(">>>handleString 之后" + res);
            return res;
        }

        /**
         * 粗体、下划线等样式切换，如果存在则删除，如果不存在则加入
         * @param str
         * @param className
         * @returns {string}
         */
        function toggleClassString(str, className) {
            if (str.indexOf(className) == -1) {
                str += ' ' + className;
            } else {
                str = str.replace(className, '');
            }
            return str;
        }

        /**
         * 删除str中所有在arr中出现的字符串
         * @param str
         * @param arr
         */
        function deleteClassString(str, arr) {
            let strArr = str.split(' ');
            let res = '';
            let originSet = new Set(strArr);
            let excludeSet = new Set(arr);
            let differenceNew = Array.from(new Set(strArr.concat(arr).filter(function(v){ originSet.has(v)} && !excludeSet.has(v))));

            for (let i = 0; i < differenceNew.length; i++) {
                res += differenceNew[i] + ' ';
            }
            return res;
        }


        let rowMap = new Map();
        let colMap = new Map();

        let tempRow, tempCol;

        /**
         * 表格初始化时为单元格设置样式
         * @param row 对应数据库表 dynamic_table_value的id
         * @param col 对应数据库表 dynamic_table_statistics中pattern字段中的相应列
         * @param className css类名字符串
         */
        function setStyle(row, col, className) {
            if (isSort()) {
                layer.msg(sortedWarn);
                return;
            }
            console.log("<><><设置单元格样式之前><><>: " + className);
            // console.log(row, col, className);
            tempRow = rowMap.get(row);
            if (tempRow == undefined || tempRow == "" || tempRow == null) {
                for (let i = 0; i < tableData.length; i++) {
                    if (tableData[i][0] == row) {
                        rowMap.set(row, i);
                        break;
                    }
                }
            }
            if (rowMap.get(row) == undefined) return;

            tempCol = colMap.get(col);
            if (tempCol == undefined || tempCol == "" || tempCol == null) {
                //TODO 这个地方的tableData[0]有待考究
                for (let i = 0; i < tableData[0].length; i++) {
                    if (tableData[0][i] == col) {
                        colMap.set(col, i);
                        break;
                    }
                }
            }
            if (colMap.get(col) == undefined) return;

            console.log(rowMap.get(row), colMap.get(col));
            let rangeCell = hot.getCell(rowMap.get(row), colMap.get(col));
            $(rangeCell).removeClass().addClass(className);
            console.log("<><><设置单元格样式之后><><>: " + className);

            hot.setCellMeta(rowMap.get(row), colMap.get(col), "className", className);
        }

        /**
         * 判断表格是否被排序
         * @returns {*}
         */
        function isSort() {
            return hot.getPlugin('columnSorting').isSorted();
        }

    }
);
