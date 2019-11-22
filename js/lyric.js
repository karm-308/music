/**
 * Created by Administrator on 2019/11/12.
 */
//封装播放的对象=>利用js的面向对象
(function (window) {
    function Lyric(path) {
        return new Lyric.prototype.init(path);
    }

    Lyric.prototype = {
        constructor: Lyric,
        musicList: [],
        init: function (path) {
            this.path = path;

        },
        //保存时间
        times: [],
        //保存歌词
        lyrics: [],
        //拿到索引
         index: -1,
        //    加载歌词
        loadLyric: function (callBack) {
            var $this = this;
            //ajax能加载网络文件也能加载本地文件
            $.ajax({
                url: $this.path,
                dataType: "text",
                success: function (data) {
                    //console.log(data);
                    //解析歌词
                    $this.parseLyric(data);
                    callBack();
                },
                error: function () {
                    console.log(e)
                }
            });
        },
        parseLyric: function (data) {
            var $this = this;
            //播放下一首清空上一首歌词
            $this.times = [];
            $this.lyrics = [];

            var array = data.split("\n");
            //console.log(array);
            //    利用正则表达式匹配时间格式[00:00.01]

            var timeReg = /\[(\d*:\d*\.\d*)]/
            //    遍历取出每一条歌词
            $.each(array, function (index, ele) {
                //处理歌词
                var lyc = ele.split("]")[1];
                //排除空字符串（没有歌词的）
                if(lyc.length == 1)return true;
                $this.lyrics.push(lyc);

                //console.log(ele);
                var res = timeReg.exec(ele);
                //console.log(res);
                if(res == null) return true;
            //    将时间的分钟转换成秒
                var timeStr = res[1];//00:00:92
                var res2 = timeStr.split(":");
                var min = parseInt(res2[0]) *60;
                var sec = parseFloat(res2[1]);
                var time = parseFloat(Number(min + sec).toFixed(2));
                //console.log(time);
                $this.times.push(time);

            });
        },
    //    同步歌词
        currentIndex:function(currentTime){
            if(currentTime  >=  this.times[0]){
                this.index++;
                this.times.shift();//数组的shif方法是删除数组最前面的一个元素
            }
            return this.index;
        }
    }
    Lyric.prototype.init.prototype = Lyric.prototype;
    window.Lyric = Lyric;
})(window);