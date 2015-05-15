nut.Pages.LoadingPageView = nut.Pages.PageView.extend({
    events: {
        'tap .arrow-down': 'doNext'
    },
    init: function(){
        this.$el.append('<div class="loading-text">感谢你关注我  往下看看吧</div>');
		this.$el.append('<div class="arrow-down"></div>');
        this.$el.addClass('loading-page');
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
