/**
 * Created by Administrator on 2019/11/12.
 */
//封装播放的对象=>利用js的面向对象
(function(window){
    function player($audio){
        return new player.prototype.init($audio);
    }
    player.prototype = {
        constructor: player,
        musicList:[],
        init:function($audio){
            //jQuery封装的对象
            this.$audio = $audio;
            //原生的
            this.audio = $audio.get(0);

        },
        //新增播放的方法
        currentIndex: -1,
        playMusic:function(index, music){
        //    判断是否是同一首音乐
            if(this.currentIndex == index){
            //    同一首音乐
                if(this.audio.paused){
                    this.audio.play();
                }else{
                    this.audio.pause();
                }
            }else{
            //    不是同一首音乐
                this.$audio.attr("src",music.link_url);
                this.audio.play();
                this.currentIndex = index;
            }
        },
    //    处理索引的方法，点击第一首的上一首回到最后一首，点击最后一首的下一首回到第一首
        preIndex: function(){
            var index = this.currentIndex - 1;
            if(index <0){
                index = this.musicList.length - 1;
            }
            return index;
        },
        nextIndex:function(){
            var index = this.currentIndex + 1;
            if(index >this.musicList.length - 1){
                index = 0;
            }
            return index;
        },
    //    删除后台音乐数据
        changeMusic:function(index){
            //删除对应的数据
            this.musicList.splice(index,1);
        //    判断当前删除的是否是正在播放音乐的前面的音乐
            if(index < this.currentIndex){
                this.currentIndex = this.currentIndex - 1;
            }
        },
        //时间跟进度条同步的方法

    //    进度条时间进行更新的方法
        musicTimeUpdate:function(callBack){
            var $this = this;
            //    6.5监听播放的进度
            this.$audio.on("timeupdate",function(){
                var duration = $this.audio.duration;
                var currentTime = $this.audio.currentTime;
                var timeStr = $this.formatDate(currentTime,duration);
                callBack(duration,currentTime,timeStr);
            });
        },
        //时间格式更新方法
        formatDate:function(currentTime,duration){
            var endMin = parseInt(duration / 60);
            var endSec = parseInt(duration % 60);

            if(endMin < 10){
                endMin = "0"+ endMin;
            }
            if(endSec < 10){
                endSec = "0" + endSec;
            }
            var startMin = parseInt(currentTime / 60);
            var startSec = parseInt(currentTime % 60);

            if(startMin < 10){
                startMin = "0"+ startMin;
            }
            if(startSec < 10){
                startSec = "0" + startSec;
            }
            //时间格式
            return startMin+":"+startSec+" / "+endMin+":"+endSec;

        },
        //总时长/播放进度百分比=播放的时长
        musicSeekTo:function(value){
            if(isNaN(value))return;
            this.audio.currentTime = this.audio.duration * value;
        },
        moveVoiceSeekTo: function(value){
        //    o-1没有声音-有声音
            if(isNaN(value))return;
            if(value < 0 || value > 1)return;
            this.audio.volume = value;
        }
    }
    player.prototype.init.prototype = player.prototype;
    window.player = player;
})(window);