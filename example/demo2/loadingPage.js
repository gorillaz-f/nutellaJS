nut.Pages.LoadingPageView = nut.Pages.PageView.extend({
    events: {
        'tap .arrow-down': 'doNext'
    },
    init: function(){
        this.$el.addClass('loading-page');
        var text = $('<div class="loading-text"></div>');
        text.append('<span>感谢你关注我，请往下看吧</span>');
        text.append('<p>这次启动加载，合计耗时：'+this.options.cost+'ms</p>');
        if (Number(this.options.delay)>100) {
            text.append('<p>但加载的动画做得这么好看</p>');
            text.append('<p>我就让你多看了一会：'+this.options.delay+'ms</p>');
        }
        this.$el.append(text);
		this.$el.append('<div class="arrow-down"></div>');
    },
    doNext: function(){
        var nextPage  = nut.pageContext.getPageInst('TimelinePageView');
        nextPage.init();
        nut.pageContext.addAndShowPage(nextPage,{
            transition: 'Cover',
            transitionDirection: 'up',
            transitionDuration: 1500,
        });

    },
});
