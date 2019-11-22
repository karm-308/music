/**
 * Created by Administrator on 2019/11/12.
 */
//��װ�������Ķ���=>����js���������(������ǰ����СԲ��)
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
        //���������ק�ƶ�
        isMove: false,

        //    1.�������ĵ���¼�
        progressClick: function (callBack) {
            var $this = this;//��ʱ�˿̵�this��progress
            //   1.1 ���������ĵ��
            this.$progressBar.click(function (event) {
                //  1.2��ȡ�������봰��Ĭ�ϵ�λ��
                var normalLeft = $(this).offset().left;
                //    1.3��ȡ�����λ�þ��봰�ڵĴ�С
                var eventLeft = event.pageX;
                //    1.4����ǰ���Ŀ��
                $this.$progress_line.css("width", eventLeft - normalLeft);
                //    1.4����СԲ��ľ���
                $this.$progress_dot.css("left", eventLeft - normalLeft);
                //    �����������ק�����ͬ��������������ı���
                var value = (eventLeft - normalLeft) / $(this).width();
                callBack(value);
            });
        },
        //   2. ���������ƶ��¼�
        progressMove: function (callBack) {
            var $this = this;//��ʱ�˿̵�this��progress

            //  1.2��ȡ�������봰��Ĭ�ϵ�λ��
            var normalLeft = $this.$progressBar.offset().left;
            var eventLeft;
            var barwidth = this.$progressBar.width();

            //   2.1�������İ����¼�
            this.$progressBar.mousedown(function () {
                $this.isMove = true;
                //   2.2���������ƶ��¼�
                $(document).mousemove(function () {
                    //    1.3��ȡ�����λ�þ��봰�ڵĴ�С
                    eventLeft = event.pageX;
                    //�жϽ���������
                    var offset = eventLeft - normalLeft;
                    if (offset >= 0 && offset <= barwidth) {
                        //    1.4����ǰ���Ŀ��
                        $this.$progress_line.css("width", eventLeft - normalLeft);
                        //    1.4����СԲ��ľ���
                        $this.$progress_dot.css("left", eventLeft - normalLeft);


                    }
                });
            });

            //   2.3��������̧���¼�
            $(document).mouseup(function () {
                $(document).off("mousemove");
                $this.isMove = false;
                //    �����������ק�����ͬ��������������ı���,���ص����ݸ�������
                var value = (eventLeft - normalLeft) / $this.$progressBar.width();
                callBack(value);

            });

        },

        //    3.���ý������沥��ʱ���ƶ�
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