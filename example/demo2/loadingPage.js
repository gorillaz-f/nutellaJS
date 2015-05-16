nut.Pages.LoadingPageView = nut.Pages.PageView.extend({
    events: {
        'tap .arrow-down': 'doNext'
    },
    init: function(){
        this.$el.addClass('loading-page');
        var text = $('<div class="loading-text"></div>');
        text.append('<span>感谢你关注我，请往下看吧</span>');

        var memo = $('<div class="memo-text"></div>');
        memo.append('<p>network cost：'+this.options.cost+'ms</p>');
        if (Number(this.options.delay)>100) {
            memo.append('<p>force wait：'+this.options.delay+'ms</p>');
            memo.append('<p>total wait：'+ (Number(this.options.delay)+Number(this.options.cost)) +'ms</p>');
        }
        else {
            memo.append('<p>total wait：'+this.options.delay+'ms</p>');
        }
        this.$el.append(text);
        this.$el.append(memo);
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
