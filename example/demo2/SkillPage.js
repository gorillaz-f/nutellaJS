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
            level: 2,
        }
    ],

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
    },

    renderChargingBar: function(index, skill){
        var bar = $('<div class="battery"></div>');
        bar.addClass('level'+skill.level);
        bar.addClass('no'+(index+1));
        bar.attr('skill-name',skill.name);
        return bar;
    },

    onTransitionEnd: function(){
        var self = this;

        this.$('.battery').addClass('charging');
        setTimeout(function(){
            //self.$('.battery').css('-webkit-animation-play-state','paused');
        },4000);
    },
});