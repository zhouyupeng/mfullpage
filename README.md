# mfullpage
移动端的单页滚动插件

## 快速上手
### HTML

	<div class="fullpage-wrap">
        <div class="fp-inner">
            <div class="page"></div>
            <div class="page"></div>
            <div class="page"></div>
            <div class="page"></div>
        </div>
        <div class="arrow"></div>
    </div>



## 参数
mfullpage.init({
    start: 0,
    scale: false,
    drag: false,
    percentage: 1 / 2,
    timer: 0.3,
    loop: true,
    showDot: false,
    beforeChange: function(obj) {
	},
    afterChange: function(obj) {
    },
    moving: function(movePx) {
    },
    useMusic: {
        'use': true,
        'autoPlay': false,
        'loopPlay': true,
        'url':
    }
});
### start
从第几屏开始，默认是第一屏。

### scale
是否开启缩小动画效果,默认是 `false`。

### percentage
缩小比例，0-1之间

### drag
是否开启拖动效果，默认是 `false`。

### timer
每屏动画切换的时间，默认0.3s

### loop
是否开启循环滚动，默认`false`。

### showDot
是否显示右边圆点导航，默认`false`。

### beforeChange
obj 两个属性 {'next':,'cur': '}，`cur`和`next`表示当前屏和将要切换的下一屏

### afterChange
obj 两个属性 {'prev':,'cur': '}，`cur`和`prev`表示滑动结束后的当前屏和上一屏

### moving
movePx 手指滑动了多少px，负数表示向下滑

### useMusic
{'use': true,'autoPlay': false,'loopPlay': true,'src':}
use，是否开始音乐,默认`true`,src，音乐地址

## demo
- [index](http://zhouyupeng.github.io/mfullpage/index.html)
- [drag](http://zhouyupeng.github.io/mfullpage/drag.html)
- [scale](http://zhouyupeng.github.io/mfullpage/scale.html)
- [loop-false](http://zhouyupeng.github.io/mfullpage/loop-false.html)
- [drag-scale](http://zhouyupeng.github.io/mfullpage/drag-scale.html)
- [dotNav](http://zhouyupeng.github.io/mfullpage/dotNav.html)
