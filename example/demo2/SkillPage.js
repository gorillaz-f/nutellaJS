nut.Pages.SkillPageView = nut.Pages.PageView.extend({
    skillInfo: [
        {
            name: 'Javascript',
            level: 5,
        },{
            name: 'CSS3/HTML5',
            level: 4,
        },{
            name: 'Java',
            level: 3,
        },{
            name: 'Unix/Linux',
            level: 2,
        },{
            name: '技术团队管理',
            level: 3,
        },{
            name: '产品设计',
            level: 3,
        }
    ],

    events: {
        'tap .arrow-down': 'doNext'
    },

    init: function(){
        var self = this;
        self.$el.addClass('skill-page');

        var wrapper = $('<div id="skill-wrapper"></div>');
        //$(self.skillInfo).each(function(index, skill){
        for (var len=self.skillInfo.length, i=0; i<len; i++){
            var skill = self.skillInfo[i];
            wrapper.append(self.renderChargingBar(i,skill));
        }
        //});
        self.$el.append(wrapper);
        self.$el.append('<div class="arrow-down"></div>');
    },

    renderChargingBar: function(index, skill){
        var bar = $('<div class="battery"></div>');
        bar.addClass('level'+skill.level);
        bar.addClass('no'+(index+1));
        bar.attr('skill-name',skill.name);
        return bar;
    },

    onTransitionEnd: function(){
        this.$('.battery').addClass('charging');
    },

    doNext: function(){
        // 确保动画不会被再次触发
        this.$('.battery').addClass('charged').removeClass('charging');
        var nextPage  = nut.pageContext.getPageInst('FrameworkPageView');
        nextPage.init();
        nut.pageContext.addAndShowPage(nextPage,{
            transition: 'Cover',
            transitionDirection: 'up',
            transitionDuration: 1500,
        });
    },
});
