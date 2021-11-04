/**
 * 小地图
 * @type {number}
 */

let timer = 0
let cvs = document.getElementById('canvas')
let ctx = cvs.getContext('2d')
let points = [] //已经运动过的数据
let animatePoint = { x: 0, y: 0 } //当前运动点位置
let nextPointIndex = 1 //下一个运动点的index
let previous ;
let next ;

//极限坐标
//三层
let three = [
    { x: 13, y: 13},
    { x: 13, y: 70},
    { x: 173, y: 70},
    { x: 173, y: 13},
];
//二层
let two = [
    { x: 43, y: 116},
    { x: 44, y: 175},
    { x: 142, y: 177},
    { x: 142, y: 115},
];
//一层
let one = [
    { x: 12, y: 222},
    { x: 13, y: 279},
    { x: 175, y: 279},
    { x: 175, y: 222},
];

//初始化
function init (routes) {
    animatePoint = { x: 0, y: 0 }
    nextPointIndex = 1
    //清空给定矩形内的指定像素
    ctx.clearRect(0, 0, cvs.clientWidth, cvs.clientHeight)
    if (routes.length > 0) {
        points.push({
            x: routes[0].x,
            y: routes[0].y,
        })
        animatePoint = {
            x: routes[0].x,
            y: routes[0].y,
        }

        drawPoint(routes[0].x, routes[0].y)
    }

    if (routes.length > 1) {
        this.startTimer()
    }
}

//开始计时器
function startTimer () {
    startTime = new Date().getTime()
    if (routes.length > 1) {
        this.clearTimer()
        this.animate()
    }
}

//清零计时器
function clearTimer () {
    window.cancelAnimationFrame(timer)
}
//动画效果
function animate () {
    //执行一个动画
    timer = window.requestAnimationFrame(animate)
    startMove()
}

//开始移动
function startMove () {
    //目标距离
    let targetDistance = Math.sqrt(
        Math.pow(routes[nextPointIndex - 1].x - routes[nextPointIndex].x, 2) +
        Math.pow(routes[nextPointIndex - 1].y - routes[nextPointIndex].y, 2),
    )

    //运动距离
    let currentDistance = Math.sqrt(
        Math.pow(routes[nextPointIndex - 1].x - animatePoint.x, 2) +
        Math.pow(routes[nextPointIndex - 1].y - animatePoint.y, 2),
    )

    if (currentDistance >= targetDistance) {
        //利用运动距离与目标距离, 判断运动的点是否超过下一个目标点, 超过了就重置下一个点
        startTime = new Date().getTime()

        points[nextPointIndex] = {
            x: routes[nextPointIndex].x,
            y: routes[nextPointIndex].y,
            z: routes[nextPointIndex].z,
        };

        animatePoint = {
            x: routes[nextPointIndex].x,
            z: routes[nextPointIndex].z,
            y: routes[nextPointIndex].y,
        };

        previous = {
            x: routes[nextPointIndex-1].x,
            y: routes[nextPointIndex-1].y,
            z: routes[nextPointIndex-1].z,
        };

        if(nextPointIndex < routes.length-1){
            next = {
                x: routes[nextPointIndex+1].x,
                y: routes[nextPointIndex+1].y,
                z: routes[nextPointIndex+1].z,
            };
        }else{
            next = {
                x: routes[nextPointIndex].x,
                y: routes[nextPointIndex].y,
                z: routes[nextPointIndex].z,
            };
        }

        nextPointIndex++;
        clearTimer();

        if (nextPointIndex <= routes.length - 1) {
            // setTimeout(() => {
                startTimer()
            // }, 500)
        }

        //清空
        ctx.clearRect(0, 0, cvs.clientWidth, cvs.clientHeight);
        // drawPoint(animatePoint.x, animatePoint.y, 'green');
        if(animatePoint.z != next.z){
            removeCtx();
            drawPoint(next.x, next.y, 'green');
            animatePoint={
                x: next.x,
                z: next.z,
                y: next.y,
            };
            animate();
        }

        //最后一个点不删除
        let lastIndex = routes.length - 1;
        if(animatePoint.x == routes[lastIndex].x && animatePoint.y == routes[lastIndex].y){
            drawPoint(animatePoint.x, animatePoint.y, 'red');
        }

        // console.log("routes:",routes[lastIndex]);
        // console.log("nextPointIndex:",  points);
        // console.log("上一个点位：",previous.z);
        // console.log("当前点位",animatePoint);
        // console.log("下一个点位:", next);

        //移除点
        // removeCtx();
        // animate ();

        //绘制点
        // drawPoint(animatePoint.x, animatePoint.y, 'red')
        //移除点
        // removeCtx();

        // setTimeout(function () {
        //移动轨迹线
        //     animate ();
        // },5000)
        return;
    }

    if (nextPointIndex > routes.length - 1) {
        //轨迹运动结束后, 关闭timer
        clearTimer()
        animatePoint = {
            x: routes[routes.length - 1].x,
            y: routes[routes.length - 1].y,
        }
    }
    else {
        let speed = 0.0157;
        let deltaTime = new Date().getTime() - startTime
        let deltaDistance = deltaTime * speed
        let rate = deltaDistance / targetDistance
        let x =
            routes[nextPointIndex - 1].x +
            (routes[nextPointIndex].x - routes[nextPointIndex - 1].x) * rate
        let y =
            routes[nextPointIndex - 1].y +
            (routes[nextPointIndex].y - routes[nextPointIndex - 1].y) * rate

        animatePoint.x = x
        animatePoint.y = y

        //重绘, 将animatePoint设为轨迹的下一个点, 以达到动态的效果
        points[nextPointIndex] = {
            x: animatePoint.x,
            y: animatePoint.y,
        }
        //清空给定矩形内的指定像素
        ctx.clearRect(0, 0, cvs.clientWidth, cvs.clientHeight)
        // drawPolygon(points)
        drawPoint(animatePoint.x, animatePoint.y, 'green')
    }
}
//fill()填充
//clear()清除

function drawPoint (x, y, color) {
    //绘制点
    ctx.fillStyle = color || '#1DEFFF'
    ctx.strokeStyle = '#fff'
    if (!color) {
        ctx.shadowColor = '#FFF'
        ctx.shadowBlur = 10
    }

    //开始一条路径
    ctx.beginPath()
    //创建圆
    ctx.arc(x, y, 2, Math.PI * 2, 0, true)
    //创建从当前点到开始点的路径
    ctx.closePath()
    //会实际地绘制出通过 moveTo() 和 lineTo() 方法定义的路径
    ctx.stroke()
    //填充当前的图像（路径）
    ctx.fill()
}

//画线
// function drawPolygon (points) {
//     //绘制轨迹
//     ctx.clearRect(0, 0, cvs.clientWidth, cvs.clientHeight)
//     ctx.strokeStyle = '#1DEFFF'
//     ctx.shadowColor = '#1DEFFF'
//     ctx.shadowBlur = 10
//     //画线宽度
//     ctx.lineWidth = 1
//
//     ctx.beginPath()
//     ctx.moveTo(points[0].x, points[0].y)
//     let i = 1,
//         len = points.length
//     for (; i < len; i++) {
//         ctx.lineTo(points[i].x, points[i].y)
//     }
//     ctx.stroke()
//
//     let j = 0
//     for (; j < len - 1; j++) {
//         drawPoint(points[j].x, points[j].y)
//     }
// }

//移除坐标点
function removeCtx() {
    clearTimer();
    ctx.clearRect(0, 0, cvs.clientWidth, cvs.clientHeight)
}
