var deviceLine0;
var deviceLine1;
var deviceLine2;
var x = "";
var y = "";
var $this;
var colorNum = "";
var camerNumberList = "";


$(function () {
    $.ajax({
        type: "get",
        url: "../newFarmInfo/getListForTouchScreen",
        dataType: "json",
        success: function (data) {
            if (data.state == 'success') {
                addDapengItem(data.datas);
            }
        },
        error: function (e) {
            console.log(e);
        }
    });

    $("#body_main").on('click', '.dapeng-item', function () {
        window.location.href = "../newFarmInfo/toYanglingControlScreen?id=" + $(this).attr("data-id") + "&farmName=" + $(this).text();
        // window.location.href = "toYanglingControlScreen";
        // window.open("/unrestricted/toYanglingControlScreen","_self");
    });
});

function addDapengItem(list) {
    let colors = ["#7fd173", "#51CFFF", "#B8AFFF", "#BAD4FF"];
    $main = $('#body_main');
    let $item;
    let index = 0;
    for (let i = 0; i < list.length; i++) {
        $item = $('<div class="dapeng-item" ></div>');
        $item.attr('data-id', list[i].id);
        $item.text(list[i].farmName);
        $item.css("background-color", colors[index++ % 4]);
        // $item.attr("onclick", "jumpToControlScreen();");
        $item.appendTo($main);
    }
}

Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};
