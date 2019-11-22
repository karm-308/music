/**
 * Created by Administrator on 2019/11/12.
 */
//封装进度条的对象=>利用js的面向对象(背景，前景，小圆点)
(function (window) {
    function Progress($progressBar, $progress_line, $progress_dot) {
        return new Progress.prototype.init($progressBar, $progress_line, $progress_dot);
    }

    Progress.prototype = {
        constructor: Progress,
        musicList: [],
        init: function ($progressBar, $progress_line, $progress_dot) {
            this.$progressBar = $progressBar;
            this.$progress_line = $progress_line;
            this.$progress_dot = $progress_dot;
        },
        //监听鼠标拖拽移动
        isMove: false,

        //    1.进度条的点击事件
        progressClick: function (callBack) {
            var $this = this;//此时此刻的this是progress
            //   1.1 监听背景的点击
            this.$progressBar.click(function (event) {
                //  1.2获取背景距离窗口默认的位置
                var normalLeft = $(this).offset().left;
                //    1.3获取点击的位置距离窗口的大小
                var eventLeft = event.pageX;
                //    1.4设置前景的宽度
                $this.$progress_line.css("width", eventLeft - normalLeft);
                //    1.4设置小圆点的距离
                $this.$progress_dot.css("left", eventLeft - normalLeft);
                //    计算进度条拖拽后歌曲同步，计算进度条的比例
                var value = (eventLeft - normalLeft) / $(this).width();
                callBack(value);
            });
        },
        //   2. 进度条的移动事件
        progressMove: function (callBack) {
            var $this = this;//此时此刻的this是progress

            //  1.2获取背景距离窗口默认的位置
            var normalLeft = $this.$progressBar.offset().left;
            var eventLeft;
            var barwidth = this.$progressBar.width();

            //   2.1监听鼠标的按下事件
            this.$progressBar.mousedown(function () {
                $this.isMove = true;
                //   2.2监听鼠标的移动事件
                $(document).mousemove(function () {
                    //    1.3获取点击的位置距离窗口的大小
                    eventLeft = event.pageX;
                    //判断进度条长度
                    var offset = eventLeft - normalLeft;
                    if (offset >= 0 && offset <= barwidth) {
                        //    1.4设置前景的宽度
                        $this.$progress_line.css("width", eventLeft - normalLeft);
                        //    1.4设置小圆点的距离
                        $this.$progress_dot.css("left", eventLeft - normalLeft);


                    }
                });
            });

            //   2.3监听鼠标的抬起事件
            $(document).mouseup(function () {
                $(document).off("mousemove");
                $this.isMove = false;
                //    计算进度条拖拽后歌曲同步，计算进度条的比例,将回调传递给调用者
                var value = (eventLeft - normalLeft) / $this.$progressBar.width();
                callBack(value);

            });

        },

        //    3.设置进度条随播放时间移动
        setProgress: function (value) {
            if (this.isMove)return;
            if (value < 0 || value > 100) return;
            this.$progress_line.css({
                width: value + "%"
            });
            this.$progress_dot.css({
                left: value + "%"
            });

        }
    }
    Progress.prototype.init.prototype = Progress.prototype;
    window.Progress = Progress;
})(window);