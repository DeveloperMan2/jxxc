/**
 * Created by LBM on 2017/12/16.
 */
var r = {
	_self : null,
	time : null,
	keywords : null,
	autoTask : null,
	rtmMarkerGroup : null,
	plesMarkerGroup : null
};

Ext.define('jxxc.view.rtm.RtmController', {
	extend : 'Ext.app.ViewController',
	alias : 'controller.rtm',

	requires : ['Ext.layout.container.Fit', 'Ext.util.TaskManager',
			'Ext.ux.IFrame', 'Ext.window.Window'],

	/**
	 * Called when the view is created
	 */
	init : function() {
		//this.addRtmDateCom('rtmDateId');
		r._self = this;
	},
	rtmAfterRenderHandler : function(container, eOpts) {
		//this.loadRtmState();
		this.querySearch();
	},
	enterHandler : function(text, field, event, eOpts) {
		if (field.getKeyName() == "ENTER") {
			this.querySearch();
			/*r.keywords = text.getValue();
			r.time = Ext.get('rtmDateId').getValue();
			var treeCom = Ext.getCmp('rtmTreeID');
			var store = treeCom.getStore();
			store.load({
			    params: {time: r.time, keywords: r.keywords},    //参数

			    callback: function (records, options, success) {
			        alert(success);
			        if (success) {
			            store.loadData(records);
			        }
			    },
			    scope: store,
			    add: false
			});*/
		}
	},
	changeHandler : function(text, newValue, oldValue, eOpts) {
		if (newValue != '') {
			text.getTrigger('clear').show();
		} else if (newValue == '') {
			text.getTrigger('clear').hide();
		}
	},
	//加载统计信息
	loadRtmState : function() {
		var meView = this.getView();
		var time = meView.lookupReference('rtmDateId').getRawValue();
		var params = {
			time : time,
			keywords : Ext.getCmp('rtmKeyWordId').getValue()
		};

		function successCallBack(response, opts) {
			//查询结果转json对象
			var result = Ext.JSON.decode(
					decodeURIComponent((response.responseText)), true);
			if (result) {
				var states = result['states'];
				var s0 = Ext.getCmp('state0Id');
				var s1 = Ext.getCmp('state1Id');
				var s2 = Ext.getCmp('state2Id');
				var s3 = Ext.getCmp('state3Id');
				s0.setText(states['s0']['name'] + '(' + states['s0']['value']
						+ ')');
				s1.setText(states['s1']['name'] + '(' + states['s1']['value']
						+ ')');
				s2.setText(states['s2']['name'] + '(' + states['s2']['value']
						+ ')');
				s3.setText(states['s3']['name'] + '(' + states['s3']['value']
						+ ')');
			}
		}

		function failureCallBack(response, opts) {
		}

		//  ajaxEx.fn.execute(params, 'GET', 'resources/data/rtmstate.json', successCallBack, failureCallBack);
		//TODO 2018-04-23---本地数据加载暂时屏蔽，若需要加载后台服务数据，需要解除注释
		ajaxEx.fn.execute(params, 'GET', conf.rtmstateUrl + 'rtmstate',
				successCallBack, failureCallBack);
	},
	daterenderHandler : function() {
		//初始化时间控件
		jeDate({
					dateCell : "#rtmDateId",
					format : "YYYY年MM月DD日 hh:mm:ss",
					isinitVal : true,
					isTime : true, //isClear:false,
					isEigth : true,
					minDate : "2000-01-01 00:00:00",
					okfun : function(val) {
						r.time = val;
						r._self.querySearch();
					}
				});

		//初始化关键字控件
		var rtmKwCmp = Ext.getCmp('rtmKeyWordId');
		//执行清空
		rtmKwCmp.getTrigger('clear').handler = this.queryClear;
		//执行查询
		rtmKwCmp.getTrigger('search').handler = this.querySearch;
	},
	querySearch : function() {
		var text = Ext.getCmp('rtmKeyWordId');

		if (r._self) {
			r._self.loadRtmState();
		}

		r.keywords = text.getValue();
		var meView = this.getView();
		var time = meView.lookupReference('rtmDateId').getRawValue();
		r.time = time;
		//            r.time = '';
		var treeCom = Ext.getCmp('rtmTreeID');

		var store = treeCom.getStore();
		store.proxy.url = conf.rtmdataUrl + 'rtmdata';//TODO 2018-04-23---本地数据加载暂时屏蔽，若需要加载后台服务数据，需要解除注释
		store.load({
					params : {
						time : r.time,
						keywords : r.keywords
					}, //参数

					callback : function(records, options, success) {
						if (success) {
							store.loadData(records);
							treeCom.collapseAll();
							treeCom.expandAll();
							treeCom.updateLayout();

							if (records && records.length > 0) {
								var nodes = records[0]['data']['children'];
								if (r._self) {
									r._self.createReservoir(nodes);
								}
							}
						}
					},
					scope : store,
					add : false
				});
	},
	//加载地图水库点信息
	loadReservoirsState : function() {
		var meView = this.getView();
		var time = meView.lookupReference('rtmDateId').getRawValue();
		var params = {
			time : time,
			keywords : Ext.getCmp('rtmKeyWordId').getValue()
		};
		if (r.rtmMarkerGroup) {
			r.rtmMarkerGroup.clearLayers();
		}
		function successCallBack(response, opts) {
			//查询结果转json对象
			var result = Ext.JSON.decode(
					decodeURIComponent((response.responseText)), true);
			if (result) {
				if (r._self) {
					r._self.createReservoir(result['children']);
				}
			}
		}

		function failureCallBack(response, opts) {
		}

		//   ajaxEx.fn.execute(params, 'GET', 'resources/data/rtmresdata.json', successCallBack, failureCallBack);
		//TODO 2018-04-23---本地数据加载暂时屏蔽，若需要加载后台服务数据，需要解除注释
		ajaxEx.fn.execute(params, 'GET', conf.rtmresdataUrl + 'rtmresdata',
				successCallBack, failureCallBack);
	},
	queryClear : function(text) {
		//清空关键字
		text.setValue('');
	},
	loadPles : function() {
		if (r.plesMarkerGroup) {
			r.plesMarkerGroup.clearLayers();
		}

		var params = {};

		function successCallBack(response, opts) {
			var mi = L.icon({
						iconUrl : 'resources/images/jz/people.png',
						iconSize : [24, 24],
						iconAnchor : [12, 24]
					});
			var markers = [];
			//查询结果转json对象
			var result = Ext.JSON.decode(
					decodeURIComponent((response.responseText)), true);
			if (result) {
				Ext.Array.each(result['ples'], function(people) {
							var mp = new L.marker(
									[people['lat'], people['lgt']], {
										icon : mi,
										draggable : false,
										title : '联系电话：' + people['phone']
									});
							if (people['sex'] != null && people['sex'] != '') {
								mp.bindTooltip(people['name'], {
											permanent : true,
											offset : [0, -24],// 偏移
											direction : "top",// 放置位置
											sticky : true,//是否标记在点上面
											className : 'green-anim-tooltip'// CSS控制
										}).openTooltip();
							}
							markers.push(mp);
						});

				//创建标签分组
				if (markers.length > 0) {
					r.plesMarkerGroup = L.layerGroup(markers);
					mv.v.map.addLayer(r.plesMarkerGroup);
				}
			}
		}

		function failureCallBack(response, opts) {
		}

		//ajaxEx.fn.execute(params, 'GET', 'resources/data/rtmples.json', successCallBack, failureCallBack);
		//TODO 2018-04-23---本地数据加载暂时屏蔽，若需要加载后台服务数据，需要解除注释
		ajaxEx.fn.execute(params, 'GET', conf.rtmplesUrl + 'rtmples',
				successCallBack, failureCallBack);
	},
	inspectorChange : function(cb, newValue, oldValue, eOpts) {
		if (newValue) {
			if (r._self) {
				r._self.loadPles();
			}
		} else {
			if (r.plesMarkerGroup) {
				r.plesMarkerGroup.clearLayers();
			}
		}
	},
	refreshChange : function(cb, newValue, oldValue, eOpts) {
		if (newValue) {
			r.autoTask = {
				run : function() {
					//自动刷新函数
					if (r._self) {
						r._self.loadPles();
					}
				},
				interval : Ext.getCmp('refreshTimeGep').getValue() > 0 ? Ext
						.getCmp('refreshTimeGep').getValue()
						* 1000 * 60 : 3000 * 60 //单位毫秒
			};
			Ext.TaskManager.start(r.autoTask);
		} else {
			if (r.autoTask) {
				Ext.TaskManager.stop(r.autoTask, true);
				r.autoTask = null;
			}
		}
	},
	formatState : function(v) {
		if (v === '') {
			return '';
		}

		if (v) {
			//假定登录时间为10点整
			var currentT = 10;
			var ts = v.split('-');
			var minT = parseInt(ts[0]);
			var maxT = (ts[1]);
		}
		if (currentT < maxT) {
			return '进行中...';
		} else if (currentT >= maxT) {
			return '已结束'
		} else if (currentT < minT) {
			return '未开始'
		}
	},
	isEnableDetail : function(view, rowIdx, colIdx, item, record) {
		// Only leaf level tasks may be edited
		return !record.data.leaf;
	},
	/*rtmTreeAdded: function (tr, container, pos, eOpts) {
	    Ext.Ajax.setTimeout(ajax.v.timeout);
	    Ext.Ajax.async = true;
	    Ext.Ajax.cors = true;
	    Ext.Ajax.request({
	        method: ajax.v.method,
	        url: 'resources/data/rtmdata.json',
	        success: function (response, opts) {
	            var result = Ext.JSON.decode(decodeURIComponent((response.responseText)), true);
	            var nodes = result['children'][0]['children'];
	            if (r._self) {
	                r._self.createReservoir(nodes);
	            }
	        },
	        failure: function (response, opts) {
	            //
	        }
	    });
	},*/
	//TODO 2018-04-24---创建弹出面板
	createPopupWindow : function(name, url, msg, time) {
		var me = this;
		if (r.reservoirInfoWindow == null) {
			r.reservoirInfoWindow = Ext.create('Ext.window.Window', {
						ui : 'window-panel-ui',
						iconCls : 'fa fa-info-circle',
						closeToolText : '关闭',
						layout : 'fit',
						bodyPadding : 0,
						header : {
							padding : '0 5 0 0'
						},
						border : false,
						frame : false,
						modal : true,
						scrollable : false,
						resizable : false,
						constrain : true,
						closable : true,
						draggable : true,
						closeAction : 'hide',
						items : [{
							xtype : 'uxiframe',
							id : 'skInfoiFrameId',
							loadMask : true,
							listeners : {
								afterrender : function(uxif, eOpts) {
									me.loadHtmlContent(uxif, url, true, msg,
											time);
									uxif.updateLayout();
								},
								scope : this
							}
						}],
						listeners : {
							close : function() {
								var uxif = Ext.getCmp('skInfoiFrameId');
								me.loadHtmlContent(uxif, 'about:blank', true,
										'', 0);
								uxif.updateLayout();
							}
						}
					});
		} else {
			var uxif = Ext.getCmp('skInfoiFrameId');
			me.loadHtmlContent(uxif, url, true, msg, time);
			uxif.updateLayout();
		}

		var bodyDom = Ext.getBody().dom;
		r.reservoirInfoWindow.setWidth(bodyDom.clientWidth / 3 * 2);
		r.reservoirInfoWindow.setHeight(bodyDom.clientHeight / 3 * 2);
		r.reservoirInfoWindow.setTitle(name);
		r.reservoirInfoWindow.show();
	},
	//TODO 2018-04-24---点击巡查路线弹出新窗口---巡查表中点击水库行只定位，不弹出窗口，如需要弹出，请去掉下面type条件判断
	rowclickHandler : function(td, record, element, rowIndex, e, eOpts) {
		if (e.position.column.xtype != 'actioncolumn') {
			var name = record.get('task');
			var url = record.get('http');
			var type = record.get('type');
			if (url && "reservoir" != type) {
				this.createPopupWindow(name, url, '巡查路线信息加载中...', 1000);
			}
		}
	},
	cellclickHandler : function(element, td, cellIndex, record, tr, rowIndex,
			e, eOpts) {
		if (cellIndex == 0 && record.data.type == 'reservoir'
				&& record.data.lgt != null && record.data.lat != null) {
			var mark = L.latLng(record.data.lat, record.data.lgt);
			mv.v.map.flyTo(mark,
					mv.v.map.options.crs.options.resolutions.length - 2);
		}
	},
	//TODO 2018-04-23---加载水库信息窗
	loadHtmlContent : function(iframe, url, mask, message, millisecond) {
		if (mask) {
			var loadMask = new Ext.LoadMask(iframe, {
						msg : message,
						style : {
							width : '100%',
							height : '100%',
							background : '#FFFFFF'
						}
					});
			loadMask.show();
			Ext.defer(function() {
						loadMask.hide();
					}, millisecond);
		}

		iframe.load(url);
	},
	createReservoir : function(nodes) {
		//创建标签分组
		var markers = [];
		if (nodes != null && nodes.length > 0) {
			//创建水库图标
			Ext.Array.each(nodes, function(node) {
				if (node && node['children'] && node['children'].length > 0) {
					var subNodes = node['children'];
					Ext.Array.each(subNodes, function(data) {
						if (data && data.type == "reservoir") {
							markers
									.push(L
											.marker([data.lat, data.lgt], {
														title : data.task
													})
											.bindPopup('<ul id="dzdxq-ul-list" class="mui-table-view"><li class="mui-table-view-cell"><div class="mui-table"><span class="mui-table-cell mui-col-xs-3 mui-text-left">水库名称:</span><span class="mui-table-cell mui-col-xs-9 mui-text-left">'
													+ data.name
													+ '</span></div></li><li class="mui-table-view-cell"><div class="mui-table"><span class="mui-table-cell mui-col-xs-3 mui-text-left">水库地址:</span><span class="mui-table-cell mui-col-xs-9 mui-text-left">'
													+ data.addr
													+ '</span></div></li><li class="mui-table-view-cell"><div class="mui-table"><span class="mui-table-cell mui-col-xs-3 mui-text-left">当前水位:</span><span class="mui-table-cell mui-col-xs-9 mui-text-left">'
													+ data.level
													+ 'm</span></div></li><li class="mui-table-view-cell"><div class="mui-table"><span class="mui-table-cell mui-col-xs-3 mui-text-left">警戒水位:</span><span class="mui-table-cell mui-col-xs-9 mui-text-left">'
													+ data.warnlevel
													+ 'm</span></div></li></ul>')
											.openPopup());
						}
					});
				}
			});
			if (markers.length > 0) {
				r.rtmMarkerGroup = L.layerGroup(markers);
				mv.v.map.addLayer(r.rtmMarkerGroup);
			}
		}
	}
});
