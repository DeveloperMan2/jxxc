/**
 * Created by LBM on 2017/12/16.
 */
Ext.define('jxxc.view.rtm.RtmController', {
        extend: 'Ext.app.ViewController',
        alias: 'controller.rtm',

        /**
         * Called when the view is created
         */
        init: function () {
            //this.addRtmDateCom('rtmDateId');
        },

        daterenderHandler: function () {
            // alert('1');
            //初始化时间控件
            jeDate({
                dateCell: "#rtmDateId",
                format: "YYYY年MM月DD日 hh:mm:ss",
                isinitVal: true,
                isTime: true, //isClear:false,
                minDate: "2000-01-01 00:00:00",
                okfun: function (val) {
                    alert(val)
                }
            });

            //初始化关键字控件
            var rtmKwCmp = Ext.getCmp('rtmKeyWordId');
            //执行清空
            rtmKwCmp.getTrigger('clear').handler = this.queryClear;
            //执行查询
            rtmKwCmp.getTrigger('search').handler = this.querySearch;
        },
        querySearch: function (text) {
            alert(text.getValue());
        },
        queryClear: function (text) {
            //清空关键字
            text.setValue('');
        },
        formatState: function (v) {
            if (v == '') {
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
        isEnableDetail: function (view, rowIdx, colIdx, item, record) {
            // Only leaf level tasks may be edited
            return !record.data.leaf;
        },
        rtmTreeAdded: function (tr, container, pos, eOpts) {
            Ext.Ajax.setTimeout(ajax.v.timeout);
            Ext.Ajax.async = true;
            Ext.Ajax.cors = true;
            Ext.Ajax.request({
                method: ajax.v.method,
                url: 'resources/data/rtmdata.json',
                success: function (response, opts) {
                    var result = Ext.JSON.decode(decodeURIComponent((response.responseText)), true);
                    var nodes = result['children'][0]['children'];
                    if (nodes != null && nodes.length > 0) {
                        //创建水库图标
                        Ext.Array.each(nodes, function (node) {
                            if (node && node['children'] && node['children'].length > 0) {
                                var subNodes = node['children'];
                                Ext.Array.each(subNodes, function (data) {
                                    if (data && data.type == "reservoir") {
                                        L.marker([data.lat, data.lgt], {title: data.task}).addTo(mv.v.map).bindPopup('<ul id="dzdxq-ul-list" class="mui-table-view"><li class="mui-table-view-cell"><div class="mui-table"><span class="mui-table-cell mui-col-xs-3 mui-text-left">水库名称:</span><span class="mui-table-cell mui-col-xs-9 mui-text-left">'+data.name+'</span></div></li><li class="mui-table-view-cell"><div class="mui-table"><span class="mui-table-cell mui-col-xs-3 mui-text-left">水库地址:</span><span class="mui-table-cell mui-col-xs-9 mui-text-left">'+data.addr+'</span></div></li><li class="mui-table-view-cell"><div class="mui-table"><span class="mui-table-cell mui-col-xs-3 mui-text-left">当前水位:</span><span class="mui-table-cell mui-col-xs-9 mui-text-left">112.4m</span>						</div></li><li class="mui-table-view-cell"><div class="mui-table"><span class="mui-table-cell mui-col-xs-3 mui-text-left">警戒水位:</span><span class="mui-table-cell mui-col-xs-9 mui-text-left">120.4m</span></div></li></ul>').openPopup();
                                    }
                                });
                            }
                        })
                    }
                },
                failure: function (response, opts) {
                    //
                }
            });
        }

    }
)
;