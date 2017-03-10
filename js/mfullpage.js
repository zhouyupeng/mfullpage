/*!
 * https://github.com/zhouyupeng
 * Copyright 2017 ypzhou. All Rights Reserved
 */
(function($, window, undefined) {
    var mfullpage = mfullpage || {};

    function Fullpage(option) {
        this.opt = {
            start: 0, //一开始显示第几个,0开始
            scale: false, //是否缩放
            drag: false, //是否拖动
            percentage: 1 / 2, //缩放值 0-1之间
            timer: 0.3,
            loop: true, //是否循环,默认循环,
            showDot: false,//圆点导航
            beforeChange: function(obj) { //cur滑动前的当前页{'prev':,'cur': '}

            },
            afterChange: function(obj) { //cur滑动后的当前页{'prev':,'cur': '}
            },
            moving: function(movePx) { //滑动中,movePx滑动了多少px,movePx为负表示向下滑
            },
            useMusic: {
                'use': true,
                'autoPlay': false,
                'loopPlay': true,
                'src': 'http://o7l1vj6sj.bkt.clouddn.com/m.mp3'
            }

        }
        this.wrap = $('.fullpage-wrap');
        $.extend(this.opt, option);

        this.obj = {
            viewHeight: this.wrap.height(),
            touchEle: this.wrap.find('.page'),
            eleLength: this.wrap.find('.page').length,
            dragStartY: 0,
            curIndex: 0,
            upordownIndex: 0
        }
        this.init();

    }
    Fullpage.prototype = {
        constructor: Fullpage,
        init: function() {
            var that = this;
            this.opt.showDot ? that.creatNav() : "";
            that.opt.beforeChange({
                'cur': that.opt.start,
                'next': that.opt.start - 1

            });
            setTimeout(function() {
                that.opt.afterChange({
                    'prev': that.opt.start - 1,
                    'cur': that.opt.start
                });
            }, that.opt.timer * 1000);

            that.obj.touchEle.css('height', that.obj.viewHeight + "px").hide();
            that.obj.touchEle.eq(that.opt.start).addClass('fpCur').show();
            that.fpTouch();
            that.musicPlay();
            $(document).on("touchmove", function(ev) {
                ev.preventDefault();
            });
        },
        fpTouch: function() {
            var that = this,
                upOrDown = 0;
            thatObj = that.obj;

            thatObj.touchEle.on("touchstart", function(ev) {
                thatObj.dragStartY =ev.changedTouches[0].pageY; //记录开始touch的位置
            });

            thatObj.touchEle.on("touchmove", function(ev) {
                $(this).siblings().hide();
                var dragMoveY = ev.changedTouches[0].pageY;
                thatObj.curIndex = $(this).index(); //记录当前touch的index
                upOrDown = thatObj.dragStartY - dragMoveY;
                thatObj.upOrDownIndex = that.getUDIndex(upOrDown, thatObj, thatObj.curIndex); //判断touch之后的index

                if (that.opt.moving && typeof(that.opt.moving) === "function") {
                    that.opt.moving(upOrDown);
                }

                if (upOrDown < 0) {

                    that.move(-1, that, $(this), ev)
                } else if (upOrDown > 0) {
                    that.move(1, that, $(this), ev);
                }
                if (upOrDown === 0) {
                    that.hideMask();
                }

            });

            thatObj.touchEle.on("touchend", function(ev) {
                if ((!that.opt.loop && upOrDown < 0 && thatObj.curIndex == 0) || (!that.opt.loop && upOrDown > 0 && //is loop
                        thatObj.curIndex == thatObj.eleLength - 1)) {
                    return;
                }
                if (that.opt.beforeChange && typeof(that.opt.beforeChange) === "function" && Math.abs(upOrDown) > 0) {
                    that.opt.beforeChange({
                        'cur': thatObj.curIndex,
                        'next': thatObj.upOrDownIndex

                    });
                }

                if (upOrDown === 0)
                    return;
                var upOrDownIndex = thatObj.upordownIndex,
                    tag = 1;
                $(this).css({
                    '-webkit-transition': that.opt.timer + "s",
                    'transition': that.opt.timer + "s"
                });
                thatObj.touchEle.eq(upOrDownIndex).css({
                    '-webkit-transition': that.opt.timer + "s",
                    'transition': that.opt.timer + "s",
                });

                Math.abs(upOrDown) > 0 ? that.creatMask() : 0;
                tag = upOrDown > 0 ? -1 : 1;
                var scale = that.opt.scale ? 1 - that.opt.percentage : 1;
                $(this).css({
                    '-webkit-transform': 'translate3d(0,' + (tag * thatObj.viewHeight * that.opt.percentage) + 'px,0) scale(' + (scale) + ')',
                    'transform': 'translate3d(0,' + (tag * thatObj.viewHeight * that.opt.percentage) + 'px,0) scale(' + (scale) + ')'
                });

                if (that.opt.drag) {
                    thatObj.touchEle.eq(upOrDownIndex).show().css({
                        '-webkit-transform': 'translate3d(0,0,0)',
                        'transform': 'translate3d(0,0,0)'
                    });

                } else {
                    thatObj.touchEle.eq(upOrDownIndex).show().css({
                        '-webkit-transform': 'translate3d(0, ' + -1 * thatObj.viewHeight * tag + 'px, 0px)',
                        'transform': 'translate3d(0, ' + -1 * thatObj.viewHeight * tag + 'px, 0px)',
                    });

                    thatObj.touchEle.eq(upOrDownIndex).show().css({
                        '-webkit-transform': 'translate3d(0,0,0)',
                        'transform': 'translate3d(0,0,0)'
                    });

                }
                $(this).on('transitionEnd webkitTransitionEnd', function(ev) { //动画停止后
                    if (upOrDown === 0)
                        return;
                    if (that.opt.afterChange && typeof(that.opt.afterChange) === "function" && Math.abs(upOrDown) > 0) {
                        that.opt.afterChange({
                            'prev': thatObj.curIndex,
                            'cur': thatObj.upOrDownIndex
                        });
                    }
                    that.hideMask();
                    that.opt.showDot ? that.moveDot(thatObj.upOrDownIndex) : "";
                    thatObj.touchEle.removeClass('fpCur').css({
                        '-webkit-transition': '',
                        'transition': ''
                    });

                    thatObj.touchEle.eq(thatObj.upOrDownIndex).addClass('fpCur').siblings().hide();
                    upOrDown = 0;
                });
            });
        },
        move: function(upOrDown, that, thisElm, ev) {
            var thatObj = that.obj,
                zIndex = thisElm.css('z-index');
            var yPx = 0,
                scale = 0,
                translateY = 0,
                dragMoveY = ev.changedTouches[0].pageY;

            yPx = (dragMoveY - thatObj.dragStartY);
            scale = that.opt.scale ? 1 - Math.abs(yPx) / thatObj.viewHeight * that.opt.percentage : 1;

            if ((!that.opt.loop && upOrDown < 0 && thatObj.curIndex == 0) || (!that.opt.loop && upOrDown > 0 && //is loop
                    thatObj.curIndex == thatObj.eleLength - 1)) {
                return;
            }

            if (!that.opt.drag) {
                thatObj.touchEle.eq(thatObj.upOrDownIndex).css({
                    'z-index': ++zIndex,
                    '-webkit-transform': 'translate3d(0, ' + upOrDown * that.obj.viewHeight + 'px, 0px)',
                    'transform': 'translate3d(0, ' + upOrDown * that.obj.viewHeight + 'px, 0px)'
                });
                return; //关闭拖动效果
            }
            translateY = upOrDown * thatObj.viewHeight + dragMoveY - thatObj.dragStartY + "px";
            thatObj.touchEle.eq(thatObj.upOrDownIndex).show().css({
                'z-index': ++zIndex,
                '-webkit-transform': 'translate3d(0, ' + translateY + ', 0px)',
                'transform': 'translate3d(0, ' + translateY + ', 0px)'
            });

            thisElm.css({
                '-webkit-transform': 'translate3d(0, ' + yPx * that.opt.percentage + 'px, 0px) scale(' + (scale) + ')',
                'transform': 'translate3d(0, ' + yPx * that.opt.percentage + 'px, 0px) scale(' + (scale) + ')'
            });
        },
        creatNav: function() {
            var asideNav = '<ul id="slide-progress" class="slide-progress">';
            for (var i = 0; i < this.obj.eleLength; i++) {
                var current = i === this.opt.start ? 'current' : '';
                asideNav += '<li class="progress-dot ' + current + '"></li>';
            }
            asideNav += '</ul>';
            $(asideNav).appendTo(this.wrap);
            var H = $('#slide-progress').height();
            $('#slide-progress').css('marginTop',-H/2);

        },
        moveDot: function(cur) {
            this.wrap.find('.progress-dot').removeClass('current').eq(cur).addClass('current');
        },
        getUDIndex: function(upOrDown, thatObj, curIndex) {
            if (upOrDown < 0) {
                thatObj.upordownIndex = curIndex === 0 ? thatObj.eleLength - 1 : curIndex - 1;

            } else if (upOrDown > 0) {

                thatObj.upordownIndex = curIndex === thatObj.eleLength - 1 ? 0 : curIndex + 1;
            }
            return thatObj.upordownIndex;
        },
        musicPlay: function() {
            var _this = this;
            var useMusic = _this.opt.useMusic;
            if (useMusic.use) {
                var autoplay = useMusic.autoPlay ? 'autoplay="autoplay"' : '';
                var loopPlay = useMusic.loopPlay ? 'loop="loop"' : '';
                var play = useMusic.autoPlay ? 'paly' : '';
                var src = useMusic.src;
                var playDiv = $('<div class="music ' + play + '"><audio id="audio" src=' + src + ' ' + autoplay + ' ' + loopPlay + '></audio></div>');
                playDiv.appendTo(_this.wrap);
                _this.wrap.find('.music').on('click', function() {
                    $(this).toggleClass('play');
                    var audio = _this.wrap.find('#audio');
                    if (audio.get(0).paused) {
                        audio.get(0).play();
                    } else {
                        audio.get(0).pause();
                    }
                });
            }
        },
        creatMask: function() {
            if ($('#fpMask').length === 0) {
                var $div = $("<div id='fpMask' style='position:absolute;left:0;right:0;top:0;bottom:0;z-index:99999;pointer-events: none;'></div>");
                $div.appendTo(this.wrap);
            } else {
                $('#fpMask').show();
            }

            $('#fpMask').on("touchmove", function(ev) {
                ev.preventDefault();
            });
        },
        hideMask: function() {
            $('#fpMask').hide();
        }
    }
    mfullpage.init = function(options) {
        new Fullpage(options);
    }

    if (typeof module !== 'undefined' && typeof exports === 'object' && define.cmd) {
        module.exports = mfullpage;
    } else if (typeof define === 'function' && define.amd) {
        define(function() {
            return mfullpage;
        });
    } else {
        window.mfullpage = mfullpage;
    }

})(window.Zepto, window)
