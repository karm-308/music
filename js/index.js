/**
 * Created by Administrator on 2019/11/8.
 */
$(function () {
    //////0�Զ����������html������ʽ
    //$(".content_list").mCustomScrollbar();


    //1.��������,ͨ����ں����������ݹ�ȥ
    var $audio = $("audio");
    var play = new player($audio);
    var progress;
    var voiceProgress;
    var lyric;
    //���ظ����б�
    getPlayerList();
    function getPlayerList() {
        //ajax�ܼ��������ļ�Ҳ�ܼ��ر����ļ�
        $.ajax({
            url: "./source/musiclist.json",
            dataType: "json",
            success: function (data) {
                //�����ŵ����ݴ����ȥ,�ڴ��ݳ�ȥ
                play.musicList = data;
                var $musicList = $(".content_list ul");
                //1.������ȡ�������ݣ�����ÿһ������
                $.each(data, function (index, ele) {
                    var $item = createMusicItem(index, ele);
                    //�ҵ�content_list�����ul�������
                    $musicList.append($item)
                });
                //    ��ʼ��������Ϣ
                initMusicInfo(data[0]);
                //    ��ʼ��Ĭ�ϵĸ����Ϣ
                initMusicLyric(data[0]);
            },
            error: function () {
                console.log(e)
            },
        });

        //  ��������������Ƴ��¼�
//  $(".list_music").hover(function(){
//      //�ҵ��˵�����ɾ��ͼ�꣬����
//      $(this).find(".list_menu").stop().fadeIn(100);
//      $(this).find(".list_time a").stop().fadeIn(100);
//  //    ����ʱ��
//      $(this).find(".list_time span").stop().fadeOut(100);
//
//  },function(){
//      //�ҵ��˵�����ɾ��ͼ�꣬����
//      $(this).find(".list_menu").stop().fadeOut(100);
//      $(this).find(".list_time a").stop().fadeOut(100);
//      //    ��ʾʱ��
//      $(this).find(".list_time span").stop().fadeIn(100);
//  });
////    ������ѡ��ĵ���¼�
//    $(".list_check").click(function(){
//       $(this).toggleClass("list_checked")
//
//    });

    };
    //1.��ʼ��������Ϣ
    function initMusicInfo(music) {
        //1.1��ȡ��Ӧ��ͼƬ
        var $musicImage = $('.song_info_pic img');
        var $musicName = $('.song_info_name a');
        var $musicSinger = $('.song_info_singer a');
        var $musicAblum = $('.song_info_ablum a');
        var $musicProgress_name = $('.music_progress_name');
        var $musicProgress_time = $('.music_progress_time');
        var $musicMask_bg = $('.mask_bg');
        //    ����Ӧ��Ԫ�ظ�ֵ
        $musicImage.attr("src", music.cover);
        $musicName.text(music.name);
        $musicSinger.text(music.singer);
        $musicAblum.text(music.album);
        $musicProgress_name.text(music.name + " / " + music.singer);
        $musicProgress_time.text("00:00 /" + music.time);
        $musicMask_bg.css("background", "url('" + music.cover + "')");


    }

    //4.��ʼ��������Ϣ
    function initMusicLyric(music) {
        lyric = new Lyric(music.link_lrc);
        var $lryicContener = $(".song_lyric");
        //�����һ�����ֵĸ��
        $lryicContener.html("");

        lyric.loadLyric(function () {
            //    ��������б�
            $.each(lyric.lyrics, function (index, ele) {
                var $item = $("<li>" + ele + "<li>");
                $lryicContener.append($item);
            });
        });
    }

    //2.��ʼ��������
    initProgress();//����
    function initProgress() {
        //������
        //2.���ý��������õ�������ǰ����СԲ��
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
        //������
        //2.���ý��������õ�������ǰ����СԲ��
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

    //3.��ʼ����ť�¼��ļ���
    initEvents();
    function initEvents() {
        /*
         * 1.��̬������Ԫ����Ҫ����¼�ֻ��ͨ���¼�ί�У����̶���Ԫ�ظĳ��¼�ί��
         * 2.�����¼�ί�м���������������Ƴ�
         * */
        $(".content_list").delegate(".list_music", "mouseenter", function () {
            //1.�ҵ��˵�����ɾ��ͼ�꣬����
            $(this).find(".list_menu").stop().fadeIn(100);
            $(this).find(".list_time a").stop().fadeIn(100);
            //    ����ʱ��
            $(this).find(".list_time span").stop().fadeOut(100);

        });

        $(".content_list").delegate(".list_music", "mouseleave", function () {
            //2.�ҵ��˵�����ɾ��ͼ�꣬����
            $(this).find(".list_menu").stop().fadeOut(100);
            $(this).find(".list_time a").stop().fadeOut(100);
            //    ��ʾʱ��
            $(this).find(".list_time span").stop().fadeIn(100);
        });

        //3.������ѡ��ĵ���¼�
        $(".content_list").delegate(".list_check", "click", function () {
            $(this).toggleClass("list_checked")
        });
        //4.����Ӳ˵����Ű�ť�ļ���
        var $musicPlay = $(".music_play");
        $(".content_list").delegate(".list_menu_play", "click", function () {
            //    ��ȡ�Ż�
            var $item = $(this).parents(".list_music");

            //    4.1�л�ͼ��
            $(this).toggleClass("list_menu_play2");
            //    4.2��ԭ����ͼ��
            $item.siblings().find(".list_menu_play").removeClass("list_menu_play2");
            //    4.3ͬ���ײ����Ű�ť
            if ($(this).attr("class").indexOf("list_menu_play2") != -1) {
                //    4.4��ǰ�Ӳ˵��Ĳ��Ű�ť�ǲ���״̬
                $musicPlay.addClass("music_play2");
                //    ���ŵ�ʱ�������ָ���
                $item.find("div").css("color", "#fff");
                //    ��������
                $item.siblings().find("div").css("color", "rgba(255,255,255,0.5)");

            } else {
                //    4.5��ǰ�Ӳ˵��Ĳ��Ű�ť���ǲ���״̬
                $musicPlay.removeClass("music_play2");
                //    ��ͣ��ʱ�������ָֻ�
                $item.find("div").css("color", "rgba(255,255,255,0.5)");

            }
            ;
            //    5.�л����
            $item.find(".list_number").toggleClass("list_number2");
            //�������
            $item.siblings().find(".list_number").removeClass("list_number2");

            //    6.��������
            play.playMusic($item.get(0).index, $item.get(0).music);

            //    1.6���ŵ�ʱ�򽫶�Ӧ�ĸ�����Ϣ��ʼ���л�
            initMusicInfo($item.get(0).music);
            //    �л������Ϣ
            initMusicLyric($item.get(0).music)

        });
        //   6.1 �����ײ��������򲥷Ű�ť�ĵ��
        $musicPlay.click(function () {
            //    �ж���û�в��Ź�����
            if (play.currentIndex == -1) {
                //    û�оͲ��ŵ�һ��
                $(".list_music").eq(0).find(".list_menu_play").trigger("click");
            } else {
                //    �Ѿ����Ź����ֵľ�ֱ�Ӳ���
                $(".list_music").eq(play.currentIndex).find(".list_menu_play").trigger("click");
            }

        });
        //   6.2 �����ײ�����������һ�װ�ť�ĵ��
        $(".music_pre").click(function () {
            $(".list_music").eq(play.preIndex()).find(".list_menu_play").trigger("click");

        });
        //   6.3 �����ײ�����������һ�װ�ť�ĵ��
        $(".music_next").click(function () {
            $(".list_music").eq(play.nextIndex()).find(".list_menu_play").trigger("click");

        });
        //  6.4����ɾ����ť�ĵ��
        $(".content_list").delegate(".list_menu_del", "click", function () {
            //    �ҵ������������
            var $item = $(this).parents(".list_music");
            //    �жϵ�ǰɾ�����Ƿ����ڲ���
            if ($item.get(0).index == play.currentIndex) {
                $(".music_next").trigger("click")
            }
            //    ����ɾ��
            $item.remove();
            play.changeMusic($item.get(0).index);
            //    6.5�������򣬸�ԭ����li����������
            $(".list_music").each(function (index, ele) {
                ele.index = index;
                $(ele).find(".list_number").text(index + 1);
            });
        });

        //    6.5�������ŵĽ���
        play.musicTimeUpdate(function (currentTime, duration, timeStr) {
            //����ʽ����ʱ�丳ֵ��ȥ
            $(".music_progress_time").text(timeStr);
            //    ͬ��������
            //    ���㲥�ű���
            //var value = currentTime / duration * 100;
            //progress.setProgress(value);
            ////    ʵ�ָ�ʵ�ͬ��
            //var index = lyric.currentIndex(currentTime);
            //var $item = $(".song_lyric li").eq(index);
            //$item.addClass("cur");
            //$item.siblings().removeClass("cur");
            ////ʵ�ָ�ʹ���
            //if (index <= 2)return;
            //$(".song_lyric").css({
            //    marginTop: (-index + 2 ) * 30
            //});
        });

        //9.����������ť�ĵ��
        $(".music_voice_icon").click(function () {
            //ͼ���л�
            $(this).toggleClass("music_voice_icon2");
            if ($(this).attr("class").indexOf("music_voice_icon2") != -1) {
                //    ��Ϊû������
                play.moveVoiceSeekTo(0);
            } else {
                //    ��Ϊ������
                play.moveVoiceSeekTo(1);
            }
        });
    }


    //2.����һ����������һ������
    /*1.��̬����������������������
     * 2.��̬���������Ӳ˵��������
     * 3.��̬������number����һ����list_number2
     * 4.��ɾ����ť���һ������list_menu_del
     * */
    function createMusicItem(index, music) {
        var $item = $(" <li class=\"list_music\">" +
            "                        <div class=\"list_check\"><i></i></div>" +
            "                        <div class=\"list_number \">" + (index + 1) + "</div>" +
            "                        <!-- �����������ʱ�������ͣ״̬-->" +
            "                        <div class=\"list_name\">" + music.name + "" +
            "                            <div class=\"list_menu\">" +
            "                                <a href=\"javascript:;\" title=\"����\"" +
            "class='list_menu_play'></a>" +
            "                                <a href=\"javascript:;\" title=\"���\"></a>" +
            "                                <a href=\"javascript:;\" title=\"����\"></a>" +
            "                                <a href=\"javascript:;\" title=\"����\"></a>" +
            "                            </div>" +
            "                        </div>" +
            "                        <div class=\"list_singer\">" + music.singer + "</div>" +
            "                        <div class=\"list_time\">" +
            "                            <span>" + music.time + "</span>" +
            "                            <a href=\"javascript:;\" title=\"ɾ��\" class='list_menu_del'></a>" +
            "                        </div>" +
            "                    </li>");
        //��ÿ�δ��������ֻ��������󶨵�ԭ����li��
        $item.get(0).index = index;
        $item.get(0).music = music;

        return $item;
    }


});
