nut.Pages.PersonalPageView = nut.Pages.PageView.extend({

    events: {
        'tap .arrow-down': 'doNext',
    },

    init: function(){
        this.$el.addClass('personal-page');
    },

    onTransitionEnd: function() {
        //this.$el.addClass('blur');
        this.$el.append('\
            <div class="blur-text">\
                <h1 label="name">冯文杰</h1>\
                <h1 label="home">广州</h1>\
                <h1 label="qq">105143171</h1>\
                <h1 label="phone">13501506686</h1>\
                <h1 label="gmail">gorillaz.f@gmail.com</h1>\
                <h1 label="github">github.com/gorillaz-f</h1>\
            </div>\
        ');
    },

    doNext: function(){
        var nextPage  = nut.pageContext.getPageInst('xxPageView');
        nextPage.init();
        nut.pageContext.addAndShowPage(nextPage,{
            transition: 'Cover',
            transitionDirection: 'up',
            transitionDuration: 1500,
        });
    },
});
