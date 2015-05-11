/*
 * 掌控 页（Page）的上下文（Context）管理
 * 如页的增减，切换等
 * 
 */

// 最基本的PageContext类
var PageContext = Backbone.View.extend({

	pageList : null,	//页面列表，后面进来的在尾巴
	homePage : null,	//首页对象的引用
	height: 0,			//容器的高度
	width: 0,		    //容器的宽度

	initialize: function() {
		var self = this;
		self.pageList = [];
		//是为避免虚拟键盘弹出的时候，会使html和body的尺寸变化
		//所以在初始化的时候先获取初始尺寸
		//self.$el.css({'height': Eip.windowInnerHeight});
		self.height = self.$el.height();
		self.width = self.$el.width();
	},

	// 创建一个新的页对象
	// 创建后，页对象受到Context管理，但并不代表马上展现
	// @pageName 调用者通过指定页名称来创建页对象，页的命名有一定规则，以PageView为后缀
	// @options  页对象创建时候需要用到的参数，动态参数集，每个页对象都由自己定义的需要的参数
	createPage: function(pageName, options) {
		var self = this;
		var pageView = null;
		// 若调用者没有按规则指定page全名，则由createPage方法做拼接后缀src
		if (!(/PageView$/).test(pageName)) {
			var padPageName = pageName + 'PadPageView';
			var phonePageName = pageName + 'PageView';

			// 对于平板设备
			if (false || Eip.utils.isPad) {
				// 优先使用pad的view，如果不存在则使用phone的view
				pageView = Eip.Pages[padPageName] || Eip.Pages[phonePageName];
			}
			// 对于手机设备
			else {
				pageView = Eip.Pages[phonePageName];
			}
		}
		// 否则使用调者提供的page全名来构建pageview
		else {
			pageView = Eip.Pages[pageName];
		}

		if (!pageView) {
			throw "there's no such page view ["+pageName+"]";
			return null;
		}

		return new pageView($.extend({}, options || {}, {context: self} ));
	},

	// 从上下文容器中删除一个页对象
	removePage: function(pageView) {
		var self = this;
		// 先调用hook，做一些必要的预处理
		self.beforeRemovePage(pageView);
		// 清除dom
		pageView.$el.remove();
		// 从pageList中除去
		var id = pageView.pageId;
		self.pageList = _.filter(self.pageList, function(pv) { return pv.pageId != id; } );
	},


	// 这些接口定义，应该由子类实现
	addAndShowPage: function(pageView) {
		throw "[addAndShowPage] function should be overrided";
	},

	hideAndRemovePage: function(pageView) {
		throw "[hideAndRemovePage] function should be overrided";
	},

	jumpToPageView: function(pageView) {
		throw "[jumpToPageView] function should be overrided";
	},

	goHome: function() {
		throw "[goHome] function should be overrided";
	},


	// 获取最迟加入的页
	getLastPage: function() {
		var self = this;
		return self.pageList[self.pageList.length - 1];
	},

	// 通过ID获取页
	getPageById: function(pid) {
		var self = this;
		return _.find(
			self.pageList, 
			function(pv){
				return pv.pageId === pid;
			}
		);
	},

	// 获取首页引用（不一定是第一页）
	getHomePage: function() {
		var self = this;
		if (self.homePage) {
			return self.homePage;
		}
		else {
			throw "homepage is not defined yet";
			return null;
		}
		//return  _.find(self.pageList, function(p) {return p.pageType === 'homepage'});
	},
	// 设置首页
	setHomePage: function(pageView) {
		var self = this;
		self.pageview = pageView;
	}

});


// 应用于手机设备的PageContext
var PhonePageContext = PageContext.extend({

	curPage: null,		//当前正在显示的页
	prevPage: null, 	//当前页的上一页
	pageContainer: null,	//页的展示容器
	pageInfoMap: null,		//用作记录每个页面的配置参数信息

	initialize: function(options) {
		var self = this;
		// 先调用父类的构建函数
		PageContext.prototype.initialize.call(self, options);

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

		// 监听系统返回键
		self.handleOnBackButton();
	},

	// @overrided
	// 页面被添加并需要展示的时候
	addAndShowPage: function(pageView, options) {
		var self = this;
		pageView.$el.addClass("page");
		pageView.$el.attr("pageid", pageView.pageId); //将pageId写到dom对象上面

		// 默认参数，切换动画使用slide方式，向左切换
		options = $.extend(
			{
				transition:'Cover',
				transitionDirection: 'left'
			}, 
			options||{}
		);

		self.pageInfoMap[pageView.pageId] = options;

		self.pageList.push(pageView);

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
			self.prevPage= null;
		}
		// 当前已经有展示的页面，则需要通过进场动画切换页面
		else {
			// 先将页面添加到dom
			self.pageContainer.append(pageView.el);
			pageView.onAppendedToContext();

			// 再创建一个切换动画实例，并执行
			(new Eip.Transitions[options.transition]({
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

					self.prevPage = self.curPage;
					self.curPage  = pageView;

					var pre = self.curPage;
					var cur = pageView;
					/*
					//如果这个页面是可以拖动的
					//为其添加一个dragger，用作处理拖动手势
					if (pageView.isDraggable) {
						var transitionType = options.transition === 'Cover' ? 'CoverDragger' : 'SlideDragger' ;
						pageView.pageDragger = new Eip.transitions[transitionType]({
							cur: cur.el,
							pre: pre.el,
							width: self.width,
							height: self.height,
							duration: Eip.constants.pageTransitionDurationMS,
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
				duration: options.transitionDuration||Eip.constants.pageTransitionDurationMS
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
		var pre = self.prevPage;
		var transition = self.pageInfoMap[pageView.pageId].transition;
		if (transition == 'Cover') transition = 'Uncover';

		var direction = self.pageInfoMap[pageView.pageId].transitionDirection;

		if (direction === 'left') direction = 'right';
		else if (direction === 'right') direction = 'left';
		else if (direction === 'up') direction = 'down';
		else if (direction === 'down') direction = 'up';

		//强制所有页面的input元素消失
		//目的是还原页面的尺寸为设备尺寸，防止误算
		self.pageContainer.find("input").blur();

		(new Eip.transitions[transition]({
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
			duration: Eip.constants.pageTransitionDurationMS
		}))
		.begin();
	},

	beforeRemovePage: function(pageView) {
		var self = this;
		self.previousPageMap[pageView.pageId] = null;
		self.pageInfoMap[pageView.pageId] = null;
	},


	goHome: function() {
		var self = this;
		var home = self.getHomePage();
		self.jumpToPageView(home);
	},

	// 响应系统返回键被触发的处理
	handleOnBackButton: function(){
		var self = this;
		self.on('backbutton', function() {
			if (self.getLastPage() && self.getLastPage().isLoginPage) {
				/*
				Eip.utils.confirm({
					"msg" : '确定要退出吗？',
					"confirm" : function() {
						navigator.app.exitApp();
					}
				});
*/
			}
			else if (self.loadingView.isLoading) {
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

