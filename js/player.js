/**
 * Created by Administrator on 2019/11/12.
 */
//��װ���ŵĶ���=>����js���������
(function(window){
    function player($audio){
        return new player.prototype.init($audio);
    }
    player.prototype = {
        constructor: player,
        musicList:[],
        init:function($audio){
            //jQuery��װ�Ķ���
            this.$audio = $audio;
            //ԭ����
            this.audio = $audio.get(0);

        },
        //�������ŵķ���
        currentIndex: -1,
        playMusic:function(index, music){
        //    �ж��Ƿ���ͬһ������
            if(this.currentIndex == index){
            //    ͬһ������
                if(this.audio.paused){
                    this.audio.play();
                }else{
                    this.audio.pause();
                }
            }else{
            //    ����ͬһ������
                this.$audio.attr("src",music.link_url);
                this.audio.play();
                this.currentIndex = index;
            }
        },
    //    ���������ķ����������һ�׵���һ�׻ص����һ�ף�������һ�׵���һ�׻ص���һ��
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
    //    ɾ����̨��������
        changeMusic:function(index){
            //ɾ����Ӧ������
            this.musicList.splice(index,1);
        //    �жϵ�ǰɾ�����Ƿ������ڲ������ֵ�ǰ�������
            if(index < this.currentIndex){
                this.currentIndex = this.currentIndex - 1;
            }
        },
        //ʱ���������ͬ���ķ���

    //    ������ʱ����и��µķ���
        musicTimeUpdate:function(callBack){
            var $this = this;
            //    6.5�������ŵĽ���
            this.$audio.on("timeupdate",function(){
                var duration = $this.audio.duration;
                var currentTime = $this.audio.currentTime;
                var timeStr = $this.formatDate(currentTime,duration);
                callBack(duration,currentTime,timeStr);
            });
        },
        //ʱ���ʽ���·���
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
            //ʱ���ʽ
            return startMin+":"+startSec+" / "+endMin+":"+endSec;

        },
        //��ʱ��/���Ž��Ȱٷֱ�=���ŵ�ʱ��
        musicSeekTo:function(value){
            if(isNaN(value))return;
            this.audio.currentTime = this.audio.duration * value;
        },
        moveVoiceSeekTo: function(value){
        //    o-1û������-������
            if(isNaN(value))return;
            if(value < 0 || value > 1)return;
            this.audio.volume = value;
        }
    }
    player.prototype.init.prototype = player.prototype;
    window.player = player;
})(window);