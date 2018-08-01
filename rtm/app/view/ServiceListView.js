/**
 * Created by LBM on 2017/8/7.
 */

var sv = {
    v: {
        //服务目录树是否已经加载
        isLoadServiceData: false,
        featureMarksLayer: null,//要素标签层
        featureMarksLayerName: 'FeatureMarkersLayer'
    },
    fn: {
        getServicesData: function (url) {
            common.fn.showMask(g.v.floatContainer, "服务目录加载中，请稍候......");
            ajax.v.method = 'GET';
            ajax.v.url = url;
            ajax.v.params = {};
            ajax.v.successCallBack = function (response, opts) {
                //查询结果转json对象
                var result = Ext.JSON.decode(response.responseText, true);
                var treeCom = Ext.getCmp('ServicesTree');
                if (treeCom) {
                    var treeData = sv.fn.formatServicesData(result);
                    var treeStore = new Ext.create('Ext.data.TreeStore', {
                        data: treeData
                    });
                    treeCom.setStore(treeStore);
                }

                common.fn.hideMask();
            };
            ajax.v.failureCallBack = function (response, opts) {
                common.fn.hideMask();
            };
            ajax.fn.execute();
        },
        formatServicesData: function (serviceData) {
            var treeData = [];
            if (serviceData && serviceData.length > 0) {
                Ext.each(serviceData, function (node) {
                    if (node != null) {
                        node['text'] = node['name'];
                        var parentCode = node['parentCode'];
                        var code = node['code'];
                        //1级节点
                        if (parentCode == '0') {
                            var isExist = false;
                            if (treeData.length > 0) {
                                Ext.each(treeData, function (fnode) {
                                    var fcode = fnode['code'];
                                    if (code == fcode) {
                                        isExist = true;
                                        return true;//true退出本次循环,false退出全部循环
                                    }
                                });
                            }

                            //如果不存在，则添加
                            if (!isExist) {
                                if (node['isChecked'] == null) {
                                    node['checked'] = false;
                                } else {
                                    node['checked'] = true;
                                }

                                if (node['isOpened'] == 0) {
                                    node['expanded'] = false;
                                } else {
                                    node['expanded'] = true;
                                }
                                node['children'] = [];
                                treeData.push(node);
                            }
                        } else {
                            //叶子节点
                            var parentNode = null;
                            if (treeData.length > 0) {
                                Ext.each(treeData, function (fnode) {
                                    var fcode = fnode['code'];
                                    if (parentCode == fcode) {
                                        parentNode = fnode;
                                        return true;
                                    }
                                });
                            }

                            if (parentNode) {
                                if (node['isChecked'] == null) {
                                    node['checked'] = false;
                                } else {
                                    node['checked'] = true;
                                }

                                node['leaf'] = true;

                                var tempChildren = [];
                                Ext.each(parentNode['children'], function (cnode) {
                                    tempChildren.push(cnode);
                                });
                                tempChildren.push(node);
                                parentNode['children'] = tempChildren;
                            }
                        }
                    }
                });
            }
            return treeData;
        },
        addMarks: function (features, isSpatial) {
            if (features && features.length > 0) {
                //初始化标签图层
                if (mv.v.map.getLayer(sv.v.featureMarksLayerName) != null) {
                    //m.v.map.removeLayer(m.v.featureMarksLayer);
                    sv.v.featureMarksLayer.clearMarkers();
                } else {
                    sv.v.featureMarksLayer = new SuperMap.Layer.Markers(sv.v.featureMarksLayerName, {});
                    sv.v.featureMarksLayer.id = sv.v.featureMarksLayerName;
                    mv.v.map.addLayer(sv.v.featureMarksLayer);
                }

                var tempPots = [];
                //创建标签
                var len = features.length;
                for (var i = 0; i < len; i++) {
                    var f = features[i];
                    var size = new SuperMap.Size(18, 18);
                    var offset = new SuperMap.Pixel(-(size.w / 2), -size.h);
                    var icon = new SuperMap.Icon('resources/images/jz/circle.png', size, offset);
                    var marker = new SuperMap.Marker(new SuperMap.LonLat(f['lng'], f['lat']), icon);
                    marker.properties = f;//给标签附上属性
                    sv.v.featureMarksLayer.addMarker(marker);
                    //注册 click 事件,触发 mouseClickHandler()方法
                    marker.events.on({
                        "click": null,//m.fn.featureClickHandler,
                        "scope": marker
                    });

                    if (!isSpatial) {
                        tempPots.push(new SuperMap.Geometry.Point(f['lng'], f['lat']));
                    }
                }

                if (!isSpatial) {
                    if (tempPots.length > 0) {
                        var tempMutiPots = new SuperMap.Geometry.MultiPoint(tempPots);
                        mv.v.map.zoomToExtent(tempMutiPots.getBounds(), true);

                        tempMutiPots.destroy();
                    }
                }

                tempPots = null;
            }
        },
        getBusinessData: function (url) {
            common.fn.showMask(g.v.floatContainer, "业务数据加载中，请稍候......");
            ajax.v.method = 'GET';
            ajax.v.url = url;
            ajax.v.params = {};
            ajax.v.successCallBack = function (response, opts) {
                //查询结果转json对象
                var result = Ext.JSON.decode(response.responseText, true);

                sv.fn.addMarks(result['data'], true);

                common.fn.hideMask();
            };
            ajax.v.failureCallBack = function (response, opts) {
                common.fn.hideMask();
            };
            ajax.fn.execute();
        }
    }
};


Ext.define('rtm.view.ServiceListView', {
    extend: 'Ext.Container',

    /*
    Uncomment to give this component an xtype*/
    xtype: 'jz-servicelistview',
    requires: [
        'Ext.container.Container',
        'Ext.layout.container.Fit',
        'Ext.tree.Panel'
    ],

    layout: {
        type: 'fit'
    },
    items: [
        /* include child components here */
        {
            xtype: 'treepanel',
            id: 'ServicesTree',
            checkPropagation: 'both',
            rootVisible: false,
            useArrows: true,
            frame: false,
            bufferedRenderer: false,
            animate: true,
            rowLines: true,
            columnLines: true,
            singleExpand: true,
            listeners: {
                checkchange: function (node, checked, e, eOpts) {
                    var kw = node.get('name');
                    if (kw == '测绘地理信息机构') {
                        if (checked) {
                            //选中
                            sv.fn.getBusinessData('https://zhfw.tianditu.com/zhfw/mappingagent');
                        } else {
                            //取消选中
                            if (mv.v.map.getLayer(sv.v.featureMarksLayerName) != null) {
                                sv.v.featureMarksLayer.clearMarkers();
                            }
                        }
                    }
                }
            }
        }
    ],
    listeners: {
        afterlayout: function () {
            if (!sv.v.isLoadServiceData) {
                sv.v.isLoadServiceData = true;
                sv.fn.getServicesData('https://zhfw.tianditu.com/zhfw/tree');
            }
        }
    }
});