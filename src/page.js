//所有page的基类
//如果一个属性只在pad下面有意义，命名时遵循 xxxxIfPad 的约定
Eip.Pages.PageView = Backbone.View.extend({
	tagName: 'div',
	pageId: '',						 //page的Id
	transitionType: '',				 //入场动画类型， '' - 默认的滑动，none - 没有动画
	isDraggable: true,				  // 这个page是不是能够随着手指拖动？
	pageType: '',					   //页面类型, homepage表示这个是homepage
	pageDragger: null,

	//以下属性只在pad下有意义
	isAdaptableIfPad: false,			//在pad下是否做出适应性的变化？
	isFirstPageIfPad: false,			//这个page是不是该卡片的第一个page？
	isDraggableIfPad: true,

	initialize: function(options) {
		var self = this;
		self.options = options;

		self.context = options.context; //容器上下文
		//每个page都有一个全局唯一的pageId
		//self.pageId = "page" + Eip.utils.getAutoIncreamentId();
		self.pageId = "page"+(Date.now().toString());
		self.$el.addClass('page');
	},

	//page的生命周期开始，这个方法不要阻塞
	init: function() {},

	//被加到容器时触发
	onAppendedToContext: function() {},

	//动画开始前
	onTransitionBegin: function() {},

	//动画结束后
	onTransitionEnd: function() {}

});


Eip.Pages.RedPageView = Eip.Pages.PageView.extend({
	init: function(){
		this.$el.css({
			'background-color':'red',
			'display':'block',
			'height':'100%',
			'width':'100%'
		});

		var prevBtn =
		$("<div class='prevBtn' \
				style='float: left;\
						display: block;\
						margin-top: 100px;\
						width: 50px;\
						height: 30px;'>\
		</div>");
		prevBtn.text('PREV');

		var nextBtn =
		$("<div class='nextBtn' \
				style='float: right;\
						display: block;\
						margin-top: 100px;\
						width: 50px;\
						height: 30px;'>\
		</div>");
		nextBtn.text('NEXT');

		this.$el.append(prevBtn);
		this.$el.append(nextBtn);
	}
});

Eip.Pages.BluePageView = Eip.Pages.PageView.extend({
	init: function(){
		this.$el.css({
			'background-color':'blue',
			'display':'block',
			'height':'100%',
			'width':'100%'
		});

		var prevBtn =
		$("<div class='prevBtn' \
				style='float: left;\
						display: block;\
						margin-top: 100px;\
						width: 50px;\
						height: 30px;'>\
		</div>");
		prevBtn.text('PREV');

		var nextBtn =
		$("<div class='nextBtn' \
				style='float: right;\
						display: block;\
						margin-top: 100px;\
						width: 50px;\
						height: 30px;'>\
		</div>");
		nextBtn.text('NEXT');

		this.$el.append(prevBtn);
		this.$el.append(nextBtn);
	}
});

Eip.Pages.GreenPageView = Eip.Pages.PageView.extend({
	init: function(){
		this.$el.css({
			'background-color':'green',
			'display':'block',
			'height':'100%',
			'width':'100%'
		});

		var prevBtn =
		$("<div class='prevBtn' \
				style='float: left;\
						display: block;\
						margin-top: 100px;\
						width: 50px;\
						height: 30px;'>\
		</div>");
		prevBtn.text('PREV');

		var nextBtn =
		$("<div class='nextBtn' \
				style='float: right;\
						display: block;\
						margin-top: 100px;\
						width: 50px;\
						height: 30px;'>\
		</div>");
		nextBtn.text('NEXT');

		this.$el.append(prevBtn);
		this.$el.append(nextBtn);
	}
});
