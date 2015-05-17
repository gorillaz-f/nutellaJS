nut.Pages.FrameworkPageView = nut.Pages.PageView.extend({

    events: {
        'tap .arrow-down': 'doNext',
        'tap .sp-circle-link': 'doRepeat'
    },

    init: function(){
        this.$el.addClass('framework-page');
    },

    onTransitionEnd: function() {
        this.$el.html('\
        <div class="container">\
            <div class="header">\
                <div class="clr"></div>\
            </div>\
            <div class="sp-container">\
                <div class="sp-content">\
                    <div class="sp-globe"></div>\
                    <h2 class="frame-1 six-lines" title="前端">\
                        <span>BackboneJS</span>\
                        <span>JQuery/Zepto</span>\
                        <span>iScroll4</span>\
                        <span>RequireJS</span>\
                        <span>Ionic</span>\
                        <span>Bootstrap</span>\
                    </h2>\
                    <h2 class="frame-2 two-lines long-text" title="跨平台">\
                        <span>Phonegap/Cordova</span>\
                        <span>React Native</span>\
                    </h2>\
                    <h2 class="frame-3 six-lines" title="服务器端">\
                        <span>CasperJS</span>\
                        <span>Multi-thread</span>\
                        <span>Memcached</span>\
                        <span>MongoDB</span>\
                        <span>Httpd/tomcat</span>\
                    </h2>\
                    <h2 class="frame-4 three-lines long-text" title="工具">\
                        <span>Vim/Atom/Sublime</span>\
                        <span>Grunt/Ant/Gradle</span>\
                        <span>Awk/Sed/Grep...</span>\
                    </h2>\
                    <h2 class="frame-5 three-lines long-text" >\
                        <span title="管理">we use Teambition</span>\
                        <span>for cooperation</span>\
                        <span>and management</span>\
                    </h2>\
                    <a class="sp-circle-link" href="#">Repeat</a>\
                </div>\
            </div>\
        </div>\
        ');

		this.$el.append('<div class="arrow-down"></div>');

        var self = this;
        setTimeout(function(){
            //self.$('.sp-container h2').css('-webkit-animation-play-state','paused');

        }, 2000);
    },

    doRepeat: function(){
        //this.$el.find('.sp-container h2').css('-webkit-animation-play-state','running');
        var container = this.$('.sp-container');
        container.hide();
        container.removeClass('sp-container');
        setTimeout(function(){
            container.addClass('sp-container');
            container.show();
        },500);
    },

    doNext: function(){
        var nextPage  = nut.pageContext.getPageInst('PersonalPageView');
        nextPage.init();
        nut.pageContext.addAndShowPage(nextPage,{
            transition: 'Cover',
            transitionDirection: 'up',
            transitionDuration: 1500,
        });
    },
});
