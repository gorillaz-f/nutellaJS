/*
 * 掌控 页（Page）的上下文（Context）管理
 * 如页的增减，切换等
 *
 */

// 最基本的PageContext类
nut.Contexts.PageContext = Backbone.View.extend({

	pagesMap : null,	//容器中的页面
	homePage : null,	//首页的引用
	height: 0,			//容器的高度
	width: 0,		    //容器的宽度

	initialize: function() {
		var self = this;

		self.pagesMap = {}; // {pageId:pageView}

		//是为避免虚拟键盘弹出的时候，会使html和body的尺寸变化
		//所以在初始化的时候先获取初始尺寸
		//self.$el.css({'height': nut.windowInnerHeight});
		self.height = self.$el.height();
		self.width = self.$el.width();
	},

	// 从nut已登记的Pages中，获取(创建)一个指定名称(类名)的Page实例
	// 创建后的Page实例未受到Context管理，并且不马上展现
	// @pageName 调用者通过指定页名称来创建页实例，页的命名有一定规则，以PageView为后缀
	// @options  页对象创建时候需要用到的参数，动态参数集，每个页对象都由自己定义的需要的参数
	getPageInst: function(pageName, options) {
		var self = this;
		var pageView = null;
		// 若调用者没有按规则指定page全名，则由createPage方法做拼接后缀src
		if (!(/PageView$/).test(pageName)) {
			var padPageName = pageName + 'PadPageView';
			var phonePageName = pageName + 'PageView';

			// 对于平板设备
			if (false || nut.utils.isPad) {
				// 优先使用pad的view，如果不存在则使用phone的view
				pageView = nut.Pages[padPageName] || nut.Pages[phonePageName];
			}
			// 对于手机设备
			else {
				pageView = nut.Pages[phonePageName];
			}
		}
		// 否则使用调者提供的page全名来构建pageview
		else {
			pageView = nut.Pages[pageName];
		}

		if (!pageView) {
			throw "there's no such page view ["+pageName+"]";
		}

		return new pageView($.extend({}, options || {}, {context: self} ));
	},


	// 在上下文容器中添加一个页实例，添加后受到管理
	addPage: function(pageView){
		var self = this;
		pageView.$el.addClass("page");
		pageView.$el.attr("pageid", pageView.pageId); //将pageId写到dom对象上面

		self.pagesMap[pageView.pageId] = pageView;
	},

	// 从上下文容器中删除一个页实例，脱离管理后，还会销毁对象
	removePage: function(pageView) {
		if (!pageView) {
			return;
		}

		var self = this;
		var id = pageView.pageId.toString();
		// 先调用hook，做一些必要的预处理
		self.beforeRemovePage(pageView);
		// 清除dom
		pageView.$el.remove();
		// 从容器中除去
		delete self.pagesMap[id];
	},

	// 这些接口定义，应该由子类实现
	addAndShowPage: function(pageView) {
		throw "[addAndShowPage] function should be overrided";
	},
	hideAndRemovePage: function(pageView) {
		throw "[hideAndRemovePage] function should be overrided";
	},
	goToPageView: function(pageView) {
		throw "[jumpToPageView] function should be overrided";
	},
	goHome: function() {
		throw "[goHome] function should be overrided";
	},


	// 通过ID获取页
	getPageById: function(pid) {
		return this.pagesMap[pid];
	},
	// 获取首页（不一定是第一页）
	getHomePage: function() {
		var self = this;
		if (self.homePage) {
			return self.homePage;
		}
		else {
			throw "homepage is not defined yet";
		}
	},
	// 设置首页
	setHomePage: function(pageView) {
		this.homePage = pageView;
	}

});


// 应用于手机设备的PageContext
nut.Contexts.PhonePageContext = nut.Contexts.PageContext.extend({

	curPage: null,		//当前正在显示的页
	prevPageMap: null, 	//用于记录每一页的上一页
	pageContainer: null,	//页的展示容器
	pageInfoMap: null,		//用作记录每个页面的配置参数信息

	initialize: function(options) {
		var self = this;
		// 先调用父类的构建函数
		nut.Contexts.PageContext.prototype.initialize.call(self, options);

		self.pageContainer = $("\
			<div \
				offsetx='0' \
				offsety='0' \
				style='-webkit-transform:translate3d(0,0,0);\
						width:100%;\
						height:100%;\
						overflow:visible;\
						position:absolute;\
						top:0;\
						left:0'\
			>\
			</div>"
		);
		self.pageContainer.appendTo(self.el);

		self.pageInfoMap = {};
		self.prevPageMap = {};

		// 监听系统返回键
		self.handleOnBackButton();
	},

	// @overrided
	// 页面被添加并需要展示的时候
	addAndShowPage: function(pageView, options) {

		var self = this;

		self.addPage(pageView);

		// 默认参数，切换动画使用slide方式，向左切换
		options = $.extend(
			{
				transition:'Cover',
				transitionDirection: 'left'
			},
			options||{}
		);

		self.pageInfoMap[pageView.pageId] = options;
		//强制所有页面的input元素消失
		//目的是还原页面的尺寸为设备尺寸，防止误算
		self.pageContainer.find("input").blur();

		// 如果当前还没有正在展示的页面，即此pageView为第一页
		if (!self.curPage) {
			// 将pageView添加到展示容器
			self.pageContainer.append(pageView.el);
			// 由于第一个页没有进场动画，因此直接调用hook，视为完成切换
			pageView.onAppendedToContext();
			pageView.onTransitionBegin();
			pageView.onTransitionEnd();

			self.curPage = pageView;
			self.prevPageMap[pageView.pageId] = null;

			// 默认第一页是HomePage
			self.setHomePage(pageView);
		}
		// 当前已经有展示的页面，则需要通过进场动画切换页面
		else {
			// 先将页面添加到dom
			self.pageContainer.append(pageView.el);
			pageView.onAppendedToContext();

			// 再创建一个切换动画实例，并执行
			(new nut.Transitions[options.transition]({
				cur: 	self.curPage.el,
				next: 	pageView.el,
				width: 	self.width,
				height: self.height,
				direction: 	options.transitionDirection,
				onBegin: function() {
					//动画开始的时候，没有额外的工作，直接调用pageView的hook
					pageView.onTransitionBegin();
				},
				onEnd: function() {
					// 新添加的页变成当前页，原来的当前页则成为新加页的上一页
					self.prevPageMap[pageView.pageId] = self.curPage.pageId;
					self.curPage  = pageView;

					var pre = self.curPage;
					var cur = pageView;
					/*
					//如果这个页面是可以拖动的
					//为其添加一个dragger，用作处理拖动手势
					if (pageView.isDraggable) {
						var transitionType = options.transition === 'Cover' ? 'CoverDragger' : 'SlideDragger' ;
						pageView.pageDragger = new nut.transitions[transitionType]({
							cur: cur.el,
							pre: pre.el,
							width: self.width,
							height: self.height,
							duration: nut.constants.pageTransitionDurationMS,
							onLeave: function() {
								self.curPage = pre;
								self.removePage(cur);

								self.trigger("goBackToPage", self.curPage);
								self.curPage.pageDragger && self.curPage.pageDragger.initBefore();
							}
						});

						pageView.pageDragger.initBefore();
					}
					*/

					pageView.onTransitionEnd();
				},
				duration: options.transitionDuration||nut.constants.pageTransitionDurationMS
			}))
			.begin();

		}
	},

	// @overrided
	// 页面被隐藏然后需要被销毁的时候
	hideAndRemovePage: function(pageView) {
		var self = this;
		if (self.curPage.pageId !== pageView.pageId) {
			setTimeout(function() { alert("its not allowed!");}, 1);
			return;
		}

		//var pre = self.getPageById(self.previousPageMap[pageView.pageId]);
		var pre = self.getPageById(self.prevPageMap[pageView.pageId]);
		var transition = self.pageInfoMap[pageView.pageId].transition;
		if (transition === 'Cover') transition = 'Uncover';

		var direction = self.pageInfoMap[pageView.pageId].transitionDirection;

		if (direction === 'left') direction = 'right';
		else if (direction === 'right') direction = 'left';
		else if (direction === 'up') direction = 'down';
		else if (direction === 'down') direction = 'up';

		//强制所有页面的input元素消失
		//目的是还原页面的尺寸为设备尺寸，防止误算
		self.pageContainer.find("input").blur();

		(new nut.Transitions[transition]({
			cur:  pageView.el,
			next:  pre.el,
			width:  self.width,
			height:  self.height,
			direction:  direction,
			onBegin:  function() {  },
			onEnd:  function() {

				self.curPage = pre;
				self.removePage(pageView);

				self.curPage.pageDragger && self.curPage.pageDragger.initBefore();

				self.trigger("goBackToPage", self.curPage);

			},
			duration: nut.constants.pageTransitionDurationMS
		}))
		.begin();
	},

	beforeRemovePage: function(pageView) {
		var self = this;
		self.prevPageMap[pageView.pageId] = null;
		self.pageInfoMap[pageView.pageId] = null;
	},


	goHome: function() {
		var self = this;
		var home = self.getHomePage();
		self.goToPageView(home);
	},

	// 响应系统返回键被触发的处理
	handleOnBackButton: function(){
		var self = this;
		self.on('backbutton', function() {
			if (self.loadingView.isLoading) {
				return ;
			}
			else if(self.curPage.doBack){
				self.curPage.doBack();
			}
			else{
				self.hideAndRemovePage(self.curPage);
			}
		});
	}

});
