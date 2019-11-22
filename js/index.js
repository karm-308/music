/**
 * Created by Administrator on 2019/11/8.
 */
$(function () {
    //////0自定义滚动条在html设置样式
    //$(".content_list").mCustomScrollbar();


    //1.歌曲播放,通过入口函数把她传递过去
    var $audio = $("audio");
    var play = new player($audio);
    var progress;
    var voiceProgress;
    var lyric;
    //加载歌曲列表
    getPlayerList();
    function getPlayerList() {
        //ajax能加载网络文件也能加载本地文件
        $.ajax({
            url: "./source/musiclist.json",
            dataType: "json",
            success: function (data) {
                //将播放的数据传入进去,在传递出去
                play.musicList = data;
                var $musicList = $(".content_list ul");
                //1.遍历获取到的数据，创建每一条音乐
                $.each(data, function (index, ele) {
                    var $item = createMusicItem(index, ele);
                    //找到content_list里面的ul进行添加
                    $musicList.append($item)
                });
                //    初始化歌曲信息
                initMusicInfo(data[0]);
                //    初始化默认的歌词信息
                initMusicLyric(data[0]);
            },
            error: function () {
                console.log(e)
            },
        });

        //  监听鼠标的移入和移出事件
//  $(".list_music").hover(function(){
//      //找到菜单栏和删除图标，淡出
//      $(this).find(".list_menu").stop().fadeIn(100);
//      $(this).find(".list_time a").stop().fadeIn(100);
//  //    隐藏时长
//      $(this).find(".list_time span").stop().fadeOut(100);
//
//  },function(){
//      //找到菜单栏和删除图标，淡出
//      $(this).find(".list_menu").stop().fadeOut(100);
//      $(this).find(".list_time a").stop().fadeOut(100);
//      //    显示时长
//      $(this).find(".list_time span").stop().fadeIn(100);
//  });
////    监听复选框的点击事件
//    $(".list_check").click(function(){
//       $(this).toggleClass("list_checked")
//
//    });

    };
    //1.初始化歌曲信息
    function initMusicInfo(music) {
        //1.1获取对应的图片
        var $musicImage = $('.song_info_pic img');
        var $musicName = $('.song_info_name a');
        var $musicSinger = $('.song_info_singer a');
        var $musicAblum = $('.song_info_ablum a');
        var $musicProgress_name = $('.music_progress_name');
        var $musicProgress_time = $('.music_progress_time');
        var $musicMask_bg = $('.mask_bg');
        //    给对应的元素赋值
        $musicImage.attr("src", music.cover);
        $musicName.text(music.name);
        $musicSinger.text(music.singer);
        $musicAblum.text(music.album);
        $musicProgress_name.text(music.name + " / " + music.singer);
        $musicProgress_time.text("00:00 /" + music.time);
        $musicMask_bg.css("background", "url('" + music.cover + "')");


    }

    //4.初始化歌曲信息
    function initMusicLyric(music) {
        lyric = new Lyric(music.link_lrc);
        var $lryicContener = $(".song_lyric");
        //清空上一首音乐的歌词
        $lryicContener.html("");

        lyric.loadLyric(function () {
            //    创建歌词列表
            $.each(lyric.lyrics, function (index, ele) {
                var $item = $("<li>" + ele + "<li>");
                $lryicContener.append($item);
            });
        });
    }

    //2.初始化进度条
    initProgress();//调用
    function initProgress() {
        //播放类
        //2.设置进度条，拿到背景，前景，小圆点
        var $progressBar = $(".music_progress_bar");
        var $progress_line = $(".music_progress_line");
        var $progress_dot = $(".music_progress_dot");
        progress = Progress($progressBar, $progress_line, $progress_dot);
        progress.progressClick(function (value) {
            play.musicSeekTo(value);

        });
        progress.progressMove(function (value) {
            play.musicSeekTo(value);
        });
        //声音类
        //2.设置进度条，拿到背景，前景，小圆点
        var $voiceBar = $(".music_voice_bar");
        var $voice_line = $(".music_voice_line");
        var $voice_dot = $(".music_voice_dot");
        voiceProgress = Progress($voiceBar, $voice_line, $voice_dot);
        voiceProgress.progressClick(function (value) {
            play.moveVoiceSeekTo(value);

        });
        voiceProgress.progressMove(function (value) {
            play.moveVoiceSeekTo(value);
        });
    }

    //3.初始化按钮事件的监听
    initEvents();
    function initEvents() {
        /*
         * 1.动态创建的元素想要添加事件只能通过事件委托，将固定的元素改成事件委托
         * 2.利用事件委托监听歌曲的移入和移出
         * */
        $(".content_list").delegate(".list_music", "mouseenter", function () {
            //1.找到菜单栏和删除图标，淡入
            $(this).find(".list_menu").stop().fadeIn(100);
            $(this).find(".list_time a").stop().fadeIn(100);
            //    隐藏时长
            $(this).find(".list_time span").stop().fadeOut(100);

        });

        $(".content_list").delegate(".list_music", "mouseleave", function () {
            //2.找到菜单栏和删除图标，淡出
            $(this).find(".list_menu").stop().fadeOut(100);
            $(this).find(".list_time a").stop().fadeOut(100);
            //    显示时长
            $(this).find(".list_time span").stop().fadeIn(100);
        });

        //3.监听复选框的点击事件
        $(".content_list").delegate(".list_check", "click", function () {
            $(this).toggleClass("list_checked")
        });
        //4.添加子菜单播放按钮的监听
        var $musicPlay = $(".music_play");
        $(".content_list").delegate(".list_menu_play", "click", function () {
            //    提取优化
            var $item = $(this).parents(".list_music");

            //    4.1切换图标
            $(this).toggleClass("list_menu_play2");
            //    4.2复原其他图标
            $item.siblings().find(".list_menu_play").removeClass("list_menu_play2");
            //    4.3同步底部播放按钮
            if ($(this).attr("class").indexOf("list_menu_play2") != -1) {
                //    4.4当前子菜单的播放按钮是播放状态
                $musicPlay.addClass("music_play2");
                //    播放的时候让文字高亮
                $item.find("div").css("color", "#fff");
                //    文字排他
                $item.siblings().find("div").css("color", "rgba(255,255,255,0.5)");

            } else {
                //    4.5当前子菜单的播放按钮不是播放状态
                $musicPlay.removeClass("music_play2");
                //    暂停的时候让文字恢复
                $item.find("div").css("color", "rgba(255,255,255,0.5)");

            }
            ;
            //    5.切换序号
            $item.find(".list_number").toggleClass("list_number2");
            //序号排他
            $item.siblings().find(".list_number").removeClass("list_number2");

            //    6.播放音乐
            play.playMusic($item.get(0).index, $item.get(0).music);

            //    1.6播放的时候将对应的歌曲信息初始化切换
            initMusicInfo($item.get(0).music);
            //    切换歌词信息
            initMusicLyric($item.get(0).music)

        });
        //   6.1 监听底部控制区域播放按钮的点击
        $musicPlay.click(function () {
            //    判断有没有播放过音乐
            if (play.currentIndex == -1) {
                //    没有就播放第一首
                $(".list_music").eq(0).find(".list_menu_play").trigger("click");
            } else {
                //    已经播放过音乐的就直接播放
                $(".list_music").eq(play.currentIndex).find(".list_menu_play").trigger("click");
            }

        });
        //   6.2 监听底部控制区域上一首按钮的点击
        $(".music_pre").click(function () {
            $(".list_music").eq(play.preIndex()).find(".list_menu_play").trigger("click");

        });
        //   6.3 监听底部控制区域下一首按钮的点击
        $(".music_next").click(function () {
            $(".list_music").eq(play.nextIndex()).find(".list_menu_play").trigger("click");

        });
        //  6.4监听删除按钮的点击
        $(".content_list").delegate(".list_menu_del", "click", function () {
            //    找到被点击的音乐
            var $item = $(this).parents(".list_music");
            //    判断当前删除的是否正在播放
            if ($item.get(0).index == play.currentIndex) {
                $(".music_next").trigger("click")
            }
            //    界面删除
            $item.remove();
            play.changeMusic($item.get(0).index);
            //    6.5重新排序，给原生的li，还有索引
            $(".list_music").each(function (index, ele) {
                ele.index = index;
                $(ele).find(".list_number").text(index + 1);
            });
        });

        //    6.5监听播放的进度
        play.musicTimeUpdate(function (currentTime, duration, timeStr) {
            //将格式化的时间赋值进去
            $(".music_progress_time").text(timeStr);
            //    同步进度条
            //    计算播放比例
            //var value = currentTime / duration * 100;
            //progress.setProgress(value);
            ////    实现歌词的同步
            //var index = lyric.currentIndex(currentTime);
            //var $item = $(".song_lyric li").eq(index);
            //$item.addClass("cur");
            //$item.siblings().removeClass("cur");
            ////实现歌词滚动
            //if (index <= 2)return;
            //$(".song_lyric").css({
            //    marginTop: (-index + 2 ) * 30
            //});
        });

        //9.监听声音按钮的点击
        $(".music_voice_icon").click(function () {
            //图标切换
            $(this).toggleClass("music_voice_icon2");
            if ($(this).attr("class").indexOf("music_voice_icon2") != -1) {
                //    变为没有声音
                play.moveVoiceSeekTo(0);
            } else {
                //    变为有声音
                play.moveVoiceSeekTo(1);
            }
        });
    }


    //2.定义一个方法创建一条音乐
    /*1.动态创建索引，歌曲名，歌手
     * 2.动态创建，给子菜单添加类名
     * 3.动态创建的number新增一个类list_number2
     * 4.给删除按钮添加一个类名list_menu_del
     * */
    function createMusicItem(index, music) {
        var $item = $(" <li class=\"list_music\">" +
            "                        <div class=\"list_check\"><i></i></div>" +
            "                        <div class=\"list_number \">" + (index + 1) + "</div>" +
            "                        <!-- 鼠标点击歌曲的时候进行悬停状态-->" +
            "                        <div class=\"list_name\">" + music.name + "" +
            "                            <div class=\"list_menu\">" +
            "                                <a href=\"javascript:;\" title=\"播放\"" +
            "class='list_menu_play'></a>" +
            "                                <a href=\"javascript:;\" title=\"添加\"></a>" +
            "                                <a href=\"javascript:;\" title=\"下载\"></a>" +
            "                                <a href=\"javascript:;\" title=\"分享\"></a>" +
            "                            </div>" +
            "                        </div>" +
            "                        <div class=\"list_singer\">" + music.singer + "</div>" +
            "                        <div class=\"list_time\">" +
            "                            <span>" + music.time + "</span>" +
            "                            <a href=\"javascript:;\" title=\"删除\" class='list_menu_del'></a>" +
            "                        </div>" +
            "                    </li>");
        //将每次创建的音乐还有索引绑定到原生的li上
        $item.get(0).index = index;
        $item.get(0).music = music;

        return $item;
    }


});
