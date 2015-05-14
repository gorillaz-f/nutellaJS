//所有page的基类
//如果一个属性只在pad下面有意义，命名时遵循 xxxxIfPad 的约定
nut.Pages.PageView = Backbone.View.extend({
	tagName: 	'div',
	pageId: 	'',		//page的Id
	pageType: 	'',		//页面类型, homepage表示这个是homepage
	pageDragger: null,
	isDraggable: true,	//这个page是不是能够随着手指拖动？
	transitionType: '',	//入场动画类型， '' - 默认的滑动，none - 没有动画

	initialize: function(options) {
		var self = this;
		self.options = options;

		self.context = options.context; //容器上下文
		//每个page都有一个全局唯一的pageId
		//self.pageId = "page" + nut.utils.getAutoIncreamentId();
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
