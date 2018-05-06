/**
 * Created by LBM on 2017/7/28.
 */
var hv = {
    v: {
        hlData: null,
        isShowPlanXcPath: true,//是否显示预设巡查路线
        xcPath: null,//实际巡查路线
        xcPlanPath: null,//预设巡查路线
        markerGroup: null,
        markerPlanGroup: null,
        //------------轨迹回放相关-----------------------
        trackMarker: null,
        curTrackPoint: null,
        preTrackPoint: null,
        nextTrackPoint: null,
        _intervalFlag: null
        //---------------------------------------------
    },
    fn: {
        setHistoryData: function (hData) {
            if (hData) {
                var s = new Ext.create('Ext.data.Store', {data: hData});
                var hlGrid = Ext.getCmp('historyLineGridID');
                if (hlGrid) {
                    hlGrid.setStore(s);
                }
            }
        },
        /*@param hid--历史轨迹ID
        * 通过ID调用后台返回历史轨迹数据*/
        getHistoryData: function (hlid) {
            if (hlid) {
                function successCallBack(response, opts) {
                    var result = Ext.JSON.decode(decodeURIComponent((response.responseText)), true);
                    if (result && result.length > 0) {
                    	result = result[0]
                        hv.v.hlData = result;
                        if (hv.v.xcPath) {
                            hv.v.xcPath.remove();
                            hv.v.xcPath = null;
                        }

                        if (hv.v.xcPlanPath) {
                            hv.v.xcPlanPath.remove();
                            hv.v.xcPlanPath = null;
                        }

                        if (hv.v.markerGroup) {
                            hv.v.markerGroup.clearLayers();
                        }

                        if (hv.v.markerPlanGroup) {
                            hv.v.markerPlanGroup.clearLayers();
                        }

                        //重点巡查点
                        var markerIcon2 = L.icon({
                            iconUrl: 'resources/images/xcapp/marker2.png',
                            iconSize: [24, 24],
                            iconAnchor: [12, 24]
                        });

                        //一般巡查点
                        var markerIcon1 = L.icon({
                            iconUrl: 'resources/images/xcapp/marker1.png',
                            iconSize: [24, 24],
                            iconAnchor: [12, 24]
                        });

                        //参考巡查点
                        var markerIcon0 = L.icon({
                            iconUrl: 'resources/images/xcapp/marker0.png',
                            iconSize: [24, 24],
                            iconAnchor: [12, 24]
                        });

                        //创建实际巡查路线
                        var nodes = result['path'];
                        if (nodes && nodes.length > 0) {
                            var path = [];
                            var markers = [];
                            Ext.each(nodes, function (node) {
                                if (node != null && node['y'] > 0 && node['x'] > 0) {
                                    var seg = [node['y'], node['x']];
                                    path.push(seg);

                                    var level = node['level'];
                                    var markerIcon = null;

                                    if (level == 0) {
                                        markerIcon = markerIcon0
                                    }
                                    else if (level == 1) {
                                        markerIcon = markerIcon1
                                    }
                                    else {
                                        markerIcon = markerIcon2
                                    }


                                    var mp = new L.marker([node['y'], node['x']], {
                                        icon: markerIcon,
                                        draggable: false,
                                        title: node['desc']
                                    });
                                    if (node['node'] != null && node['node'] != '') {
                                        mp.bindTooltip(node['node'], {
                                            permanent: true,
                                            offset: [0, 0],// 偏移
                                            direction: "right",// 放置位置
                                            //sticky:true,//是否标记在点上面
                                            className: 'green-anim-tooltip'// CSS控制
                                        }).openTooltip();
                                    }
                                    markers.push(mp);
                                }
                            });

                            //创建路径
                            if (path.length > 0) {
                                hv.v.xcPath = L.polyline(path, {color: 'green'}).addTo(mv.v.map);
                                mv.v.map.fitBounds(hv.v.xcPath.getBounds());
                            }

                            //创建标签分组
                            if (markers.length > 0) {
                                hv.v.markerGroup = L.layerGroup(markers);
                                mv.v.map.addLayer(hv.v.markerGroup);
                            }
                        }

                        //创建预设巡查路线
                        var pNodes = result['planPath'];
                        if (pNodes && pNodes.length > 0) {
                            var path = [];
                            var markers = [];
                            Ext.each(pNodes, function (node) {
                                if (node != null) {
                                    var seg = [node['y'], node['x']];
                                    path.push(seg);

                                    var level = node['level'];
                                    var markerIcon = null;

                                    if (level == 0) {
                                        markerIcon = markerIcon0
                                    }
                                    else if (level == 1) {
                                        markerIcon = markerIcon1
                                    }
                                    else {
                                        markerIcon = markerIcon2
                                    }


                                    var mp = new L.marker([node['y'], node['x']], {
                                        icon: markerIcon,
                                        draggable: false,
                                        title: node['desc']
                                    });
                                    if (node['node'] != null && node['node'] != '') {
                                        mp.bindTooltip(node['node'], {
                                            permanent: true,
                                            offset: [0, 0],// 偏移
                                            direction: "left",// 放置位置
                                            //sticky:true,//是否标记在点上面
                                            className: 'purple-anim-tooltip'// CSS控制
                                        }).openTooltip();
                                    }
                                    markers.push(mp);
                                }
                            });

                            //创建路径
                            if (path.length > 0) {
                                hv.v.xcPlanPath = L.polyline(path, {color: 'purple',dashArray:'10',dashOffset:'5'});
                            }

                            //创建标签分组
                            if (markers.length > 0) {
                                hv.v.markerPlanGroup = L.layerGroup(markers);
                            }

                            if (hv.v.isShowPlanXcPath) {
                                //创建路径
                                if (hv.v.xcPlanPath) {
                                    hv.v.xcPlanPath.addTo(mv.v.map);
                                }

                                //创建标签分组
                                if (hv.v.markerPlanGroup) {
                                    mv.v.map.addLayer(hv.v.markerPlanGroup);
                                }
                            }
                        }
                    }
                }

                function failureCallBack(response, opts) {
                    console.log('历史路线加载失败');
                }
              //  ajax.fn.execute({id: hlid}, 'GET', 'resources/data/history.json', successCallBack, failureCallBack);
              ajax.fn.execute({id: hlid}, 'GET',conf.servicePathUrl+'rtmhistory', successCallBack, failureCallBack);

            }
        },
        //获取两点之间的距离
        getDistance: function (pxA, pxB) {
            var f1 = pxA.y, l1 = pxA.x, f2 = pxB.y,
                l2 = pxB.x;
            var toRadian = Math.PI / 180;
            var R = 6371; //地球半径，单位：千米
            var deltaF = (f2 - f1) * toRadian;
            var deltaL = (l2 - l1) * toRadian;
            var a = Math.sin(deltaF / 2) * Math.sin(deltaF / 2) + Math.cos(f1 * toRadian) * Math.cos(f2 * toRadian) * Math.sin(deltaL / 2) * Math.sin(deltaL / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var distance = R * c;
            return distance * 1000;//返回米制数据
        },
        crateTrackPoint: function (nodes) {
            if (nodes) {
                if (hv.v.trackMarker) {
                    hv.v.trackMarker.remove();
                }

                var path = [];
                Ext.each(nodes, function (node) {
                    if (node != null && node['y'] >0 && node['x'] > 0) {
                        var seg = [node['y'], node['x']];
                        path.push(seg);
                    }
                });

                /* var trackIcon = L.icon({
                     iconUrl: 'resources/images/xcapp/car.png',
                     iconSize: [52, 26],
                     iconAnchor: [26, 13]
                 });*/

                if (path) {
                    hv.v.trackMarker = L.Marker.movingMarker(path, 10000, {
                        //icon: trackIcon,
                        icon: L.AwesomeMarkers.icon({
                            icon: 'spinner',
                            prefix: 'fa',
                            markerColor: 'red',
                            spin: true
                        }),
                        draggable: false,
                        title: ''
                    }).addTo(mv.v.map).bindTooltip('巡查中...', {
                        permanent: true,
                        offset: [0, 0],// 偏移
                        direction: "right",// 放置位置
                        //sticky:true,//是否标记在点上面
                        className: 'red-anim-tooltip'// CSS控制
                    }).openTooltip();

                    hv.v.trackMarker.start();

                    hv.v.trackMarker.on('end', function () {
                        hv.v.trackMarker.remove();
                        hv.v.trackMarker = null;
                    });

                }
            }
        },
        startTrack: function (data) {
            var nodes = data['path'];
            if (hv.v.trackMarker) {
                if (hv.v.trackMarker.isPaused()) {
                    hv.v.trackMarker.resume();
                }
                else {
                    hv.fn.crateTrackPoint(nodes);
                }
            }
            else {
                hv.fn.crateTrackPoint(nodes);
            }
        },
        pauseTrack: function () {
            if (hv.v.trackMarker) {
                hv.v.trackMarker.pause();
            }
        },
        stopTrack: function () {
            if (hv.v.trackMarker) {
                hv.v.trackMarker.stop();
            }
        }
    }
};

Ext.define('historyline.view.HistoryView', {
    extend: 'Ext.Container',

    //Uncomment to give this component an xtype
    xtype: 'jz-historyview',
    requires: [
        'Ext.button.Segmented',
        'Ext.container.Container',
        'Ext.layout.container.Fit'
    ],
    layout: 'fit',
    initComponent: function () {
        this.items = [{
            xtype: 'container',
            margin: '0 0 0 0',
            items: [
                {
                    xtype: 'segmentedbutton',
                    allowMultiple: false,
                    defaults: {
                        border: false,
                        scale: 'small'
                    },
                    items: [
                        {
                            iconCls: 'xc-play',
                            tooltip: '播放',
                            handler: this.onPlayHandler
                        },
                        {
                            iconCls: 'xc-pause',
                            tooltip: '暂停',
                            handler: this.onPauseHandler
                        },
                        {
                            iconCls: 'xc-stop',
                            tooltip: '停止',
                            handler: this.onStopHandler
                        }
                    ]
                }
                /*{
                    xtype: 'checkboxfield',
                    name: 'planPathId',
                    margin: '0 5 0 5',
                    checked: false,
                    isCheckbox: true,
                    height: 30,
                    boxLabel: '开启预设巡查路线',
                    listeners: {
                        change: function (cb, newValue, oldValue, eOpts) {
                            hv.v.isShowPlanXcPath = newValue;
                            if (hv.v.isShowPlanXcPath) {
                                //创建路径
                                if (hv.v.xcPlanPath) {
                                    hv.v.xcPlanPath.addTo(mv.v.map);
                                }

                                //创建标签分组
                                if (hv.v.markerPlanGroup) {
                                    hv.v.markerPlanGroup.eachLayer(function (marker) {
                                        marker.openTooltip();
                                    });

                                    mv.v.map.addLayer(hv.v.markerPlanGroup);
                                }
                            } else {
                                if (hv.v.xcPlanPath) {
                                    hv.v.xcPlanPath.remove();
                                }

                                if (hv.v.markerPlanGroup && mv.v.map.hasLayer(hv.v.markerPlanGroup)) {
                                    mv.v.map.removeLayer(hv.v.markerPlanGroup);
                                }
                            }
                        }
                    }
                },*/
                /*{
                    xtype: 'gridpanel',
                    id: 'historyLineGridID',
                    allowDeselect: false,
                    store: {
                        //type: 'history'
                        data: parent.historyData
                    },
                    columns: [
                        {
                            text: '名称', dataIndex: 'name', align: 'center', flex: 1, menuDisabled: true,
                            sortable: false
                        },
                        {
                            text: '日期', dataIndex: 'date', align: 'center', flex: 1, menuDisabled: true,
                            sortable: false
                        },
                        {
                            text: '控制',
                            menuDisabled: true,
                            sortable: false,
                            xtype: 'actioncolumn',
                            align: 'center',
                            width: 100,
                            items: [
                                {
                                    iconCls: 'xc-play',
                                    scale: 'large',
                                    tooltip: '播放',
                                    handler: this.onPlayHandler
                                },
                                {
                                    iconCls: 'xc-pause',
                                    scale: 'large',
                                    tooltip: '暂停',
                                    handler: this.onPauseHandler
                                },
                                {
                                    iconCls: 'xc-stop',
                                    scale: 'large',
                                    tooltip: '停止',
                                    handler: this.onStopHandler
                                }
                            ]
                        }
                    ],
                    listeners: {
                        'select': this.selectHistoryLineHandler
                    }
                }*/
            ]
        }]
        this.callParent();
    },
    onPlayHandler: function (gp, rowIndex, colIndex, btn, timeStamp) {
        /*var curItem = gp.getStore().getAt(rowIndex);
        gp.getSelectionModel().select(curItem, true);
        var curData = curItem['data'];
        //开启巡查轨迹回放
        hv.fn.startTrack(curData);*/

        //开启巡查轨迹回放
        if(hv.v.hlData){
            hv.fn.startTrack(hv.v.hlData);
        }
    }
    ,
    onPauseHandler: function (gp, rowIndex, colIndex, btn, timeStamp) {
        /*var selItem = gp.selection.data;
        var curItem = gp.getStore().getAt(rowIndex).data;
        //只能在选中行执行操作
        if (selItem == curItem) {
            hv.fn.pauseTrack();
        }*/

        hv.fn.pauseTrack();
    },
    onStopHandler: function (gp, rowIndex, colIndex, btn, timeStamp) {
        /*var selItem = gp.selection.data;
        var curItem = gp.getStore().getAt(rowIndex).data;
        //只能在选中行执行操作
        if (selItem == curItem) {
            hv.fn.stopTrack();
        }*/

        hv.fn.stopTrack();
    },
    selectHistoryLineHandler: function (gp, record, index, eOpts) {

    }
});
