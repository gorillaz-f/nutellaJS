nut.Pages.TimelinePageView = nut.Pages.PageView.extend({
    events: {
        //'tap .arrow-down': 'doNext'
    },
    workinfo: [
        {
            id:     'work1',
            date:   '1984',
            label:  '那年，我出生了',
            content:'30年前，我出生在一个平凡家庭里',
        },{
            id:     'work2',
            date:   '2003',
            label:  '华南理工大学 软件工程',
            content:'有幸入读广东最好的大学之一：华工，在这里我完成学业，学会了编程，经历寒窗数十载，终于踏入人生新的征途：职业生涯。（2003~2007）',
        },{
            id:     'work3',
            date:   '2007',
            label:  '招商银行软件研发中心',
            content:'在招行我开始了人生的第一份工作，加入了中间业务组，参与了中间业务平台的功能模块开发，学会了如何成为一名职业打工仔。（2007~2009）',
        },{
            id:     'work4',
            date:   '2009',
            label:  '广州誉博医疗信息科技公司',
            content:'在这家创业型小公司，我在灰常牛的CEO和CTO带领下，领略到什么叫互联网思维，什么叫工程师文化。可惜项目最终没有成功。（2009~2011）',
        },{
            id:     'work5',
            date:   '2011',
            label:  '广东粤电信息科技有限公司',
            content:'我幸运地遇上一位开明的领导，在他的授权下，我将之前学习到的新鲜思维和技术，对陈旧的企业应用进行了一番改造，成绩斐然。及后，我组建了产品团队，管理研发公司的拳头产品。（2011~2015）',
        }
    ],
    init: function(){
        var self = this;
        var timeline = $('<ul id="timeline"></ul>');
        self.$el.append(timeline);
        $(self.workinfo).each(function(index, info){
            var work = self.renderWork(info);
            timeline.append(work);
        });
        self.$el.addClass('timelineContainer');
    },

    renderWork: function(workInfo) {
        var work = $('\
            <li class="work">\
                <input class="radio" name="works" type="radio" >\
                <div class="relative">\
                    <label></label>\
                    <span class="date"></span>\
                    <span class="circle"></span>\
                </div>\
                <div class="content"><p></p></div>\
            </li>\
        ');
        work.find('input').attr('id',workInfo.id);
        work.find('label').text(workInfo.label).attr('for',workInfo.id);
        work.find('.date').text(workInfo.date);
        work.find('.content>p').text(workInfo.content);
        return work;
    },

    // hook
    // 在入场动画完成后的回调钩子
    onTransitionEnd: function(){
        var self =  this;
        var index = 1;
        self.$('input').attr('checked',null);
        self.$('#work'+index).attr('checked',true);
        index++;
        // 这里我们逐个查看timeline work
        var timer = window.setInterval(function(){
            if (index>self.workinfo.length) {
                console.log('timer cleared');
                window.clearInterval(timer);
                return;
            }
            self.$('input').attr('checked',null);
            self.$('#work'+index).attr('checked',true);
            index++;
        },5000);

    },

    doNext: function(){
        var nextPage  = nut.pageContext.getPageInst('SkillPageView');
        nextPage.init();
        nut.pageContext.addAndShowPage(nextPage,{
            transition: 'Cover',
            transitionDirection: 'up',
            transitionDuration: 1500,
        });

    },
});
