/**
 * Created by LBM on 2017/7/28.
 */
var mv = {
    v: {
        map: null,
        infowin: null,
        mapDivId: null,
        //地图控件是否已经初始化
        isMapAdded: false,
        mapToolPanel: null,
        //矢量图层
        gaodeImgLayer: null,
        gaodeVecLayer: null,
        //实时显示当前位置图层
        realTimePositionLayer: null,
        //实时显示行进路线图层
        realTimeRouteLayer: null,
        measureDistool:null,
        //实时显示当前位置图层
        realTimePositionLayerName: 'realTimePositionLayerName',
        //实时显示行进路线图层
        realTimeRouteLayerName: 'realTimeRouteLayerName',
        baseMapSilderCnp: Ext.create('Ext.slider.Single', {
            width: 200,
            value: 0,
            increment: 10,
            zeroBasedSnapping: true,
            minValue: 0,
            hidden: true,
            maxValue: 100,
            floating: true,
            renderTo: Ext.getBody(),
            listeners: {
                changecomplete: function (view, newv) {
                    var opacity = 1 - newv / 100;
                    if (mv.v.gaodeImgLayer != null) {
                        mv.v.gaodeImgLayer.setOpacity(opacity);
                    }
                    if (mv.v.gaodeVecLayer != null) {
                        mv.v.gaodeVecLayer.setOpacity(opacity);
                    }
                }
            }
        })
    },
    fn: {
        fullExtent:function () {
            return  L.latLngBounds(L.latLng(conf.extentBottom,conf.extentLeft),L.latLng(conf.extentTop,conf.extentRight));
        },
        initMap: function (mapid) {//定位到江西
            var res = conf.resolutions;
            var crs = new L.Proj.CRS('SR-ORG:7408','+proj=longlat +ellps=GRS80 +no_defs', {
                origin: conf.origin,
                resolutions: res
            });
            mv.v.map = L.map(mapid, {
                zoomControl: false,
                attributionControl: false,
                crs: crs,
                zoom: 0
            });
            if (mv.v.gaodeVecLayer == null) {

                mv.v.gaodeVecLayer = L.esri.tiledMapLayer({url: conf.esriMapVectorUrl,id:"esrivector"});
            }

           mv.v.gaodeVecLayer.addTo(mv.v.map);

            //创建地图工具栏
            mv.fn.createMapToolPanel(mapid);

            mv.v.map.fitBounds(mv.fn.fullExtent());

            //添加鼠标位置
            L.control.mousePosition().addTo(mv.v.map);
        },
        mapZoomHandler: function (evt) {

        },
        clearLayerByID: function (id) {
            if (mv.v.map != null) {
                var i;
                for (i in mv.v.map._layers) {
                    if (mv.v.map._layers[i].options.id == id) {
                        mv.v.map._layers[i].remove();
                        return;
                    }
                }
            }
        },
        colorHex: function (cs) {
            var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
            var that = cs;
            if (/^(rgb|RGB)/.test(that)) {
                var aColor = that.replace(/(?:||rgb|RGB)*/g, "").split(",");
                var strHex = "#";
                for (var i = 0; i < aColor.length; i++) {
                    var hex = Number(aColor[i]).toString(16);
                    if (hex === "0") {
                        hex += hex;
                    }
                    strHex += hex;
                }
                if (strHex.length !== 7) {
                    strHex = that;
                }
                return strHex;
            } else if (reg.test(that)) {
                var aNum = that.replace(/#/, "").split("");
                if (aNum.length === 6) {
                    return that;
                } else if (aNum.length === 3) {
                    var numHex = "#";
                    for (var i = 0; i < aNum.length; i += 1) {
                        numHex += (aNum[i] + aNum[i]);
                    }
                    return numHex;
                }
            } else {
                return that;
            }
        },
        closeInfoWin: function () {
            if (mv.v.infowin) {
                try {
                    mv.v.infowin.hide();
                    mv.v.infowin.destroy();
                }
                catch (e) {
                }
            }
        },
        //加载实时展示数据
        loadRealTimeRoute: function (data) {
            if (data) {
                //初始化实时位置图层
                if (mv.v.map.getLayersByName(mv.v.realTimePositionLayerName).length > 0) {
                    mv.v.realTimePositionLayer.clearMarkers();
                } else {
                    mv.v.realTimePositionLayer = new SuperMap.Layer.Markers(mv.v.realTimePositionLayerName, {});
                    mv.v.realTimePositionLayer.id = mv.v.realTimePositionLayerName;
                    mv.v.map.addLayer(mv.v.realTimePositionLayer);
                }

                //初始化实时路线图层
                if (mv.v.map.getLayersByName(mv.v.realTimeRouteLayerName).length > 0) {
                    mv.v.realTimeRouteLayer.removeAllFeatures();
                } else {
                    mv.v.realTimeRouteLayer = new SuperMap.Layer.Vector(mv.v.realTimeRouteLayerName);
                    mv.v.realTimeRouteLayer.id = mv.v.realTimeRouteLayerName;
                    //mv.v.realTimeRouteLayer.style = rtLineStyle;
                    mv.v.map.addLayer(mv.v.realTimeRouteLayer);
                }

                // var callbacks = {
                //     over: function (currentFeature) {
                //         var pt = currentFeature.geometry.getCentroid();
                //         this.closeInfoWin();
                //         var popup = new SuperMap.Popup.FramedCloud("popwin",
                //             new SuperMap.LonLat(pt.x, pt.y),
                //             null,
                //             currentFeature.attributes.route.get('name'),
                //             null,
                //             true);
                //         m.v.infowin = popup;
                //         mv.v.map.addPopup(popup);
                //     }
                // };
                // var selectFeature = new SuperMap.Control.SelectFeature(mv.v.realTimePositionLayer,
                //     {
                //         callbacks: callbacks
                //     });
                // mv.v.map.addControl(selectFeature);
                // selectFeature.activate();

                var tempPots = [];
                Ext.each(data, function (route) {
                    if (route != null) {
                        //创建实时位置图标
                        var x = route.get('x');
                        var y = route.get('y');
                        tempPots.push(new SuperMap.Geometry.Point(x, y));

                        var size = new SuperMap.Size(32, 32);
                        var offset = new SuperMap.Pixel(-(size.w / 2), -size.h);
                        var icon = new SuperMap.Icon('resources/images/jz/people.png', size, offset);
                        var marker = new SuperMap.Marker(new SuperMap.LonLat(x, y), icon);
                        marker.properties = route;//给标签附上属性
                        mv.v.realTimePositionLayer.addMarker(marker);
                        //注册 click 事件,触发 mouseClickHandler()方法
                        marker.events.on({
                            "mouseover": mv.fn.featureInfoHandler,
                            "scope": marker
                        });

                        //创建实时路线
                        var rtls = [];
                        var path = route.get('path');
                        if (path) {
                            var nodes = [];
                            Ext.each(path, function (node) {
                                if (node != null) {
                                    //创建实时位置图标
                                    var x = node['x'];
                                    var y = node['y'];
                                    nodes.push(new SuperMap.Geometry.Point(x, y));
                                }
                            });

                            if (nodes.length > 0) {
                                var rgb = 'RGB(' + parseInt(Math.random() * 255) + ',' + parseInt(Math.random() * 255) + ',' + parseInt(Math.random() * 255) + ')';
                                var ls = new SuperMap.Geometry.LineString(nodes);
                                var rtLine = new SuperMap.Feature.Vector(ls);
                                rtLine.style = {
                                    strokeColor: mv.fn.colorHex(rgb),
                                    strokeWidth: 3
                                }
                                rtls.push(rtLine);
                            }
                        }

                        if (rtls.length > 0) {
                            mv.v.realTimeRouteLayer.addFeatures(rtls);
                            mv.v.realTimeRouteLayer.redraw();
                        }
                    }
                });

                var features = mv.v.realTimePositionLayer.markers;
                if (features != null) {
                    for (var i = 0; i < features.length; i++) {
                        var feature = features[i];
                        var po = feature.lonlat;
                        var contentHTML = "";
                        contentHTML += "<span style=' font-size:12px;line-height: 13px;'>";
                        contentHTML += feature.properties.data.name;
                        contentHTML += "</span>";
                        var width = (feature.properties.data.name.length) * 13;
                        var ht = 15;
                        var popup2 = new SuperMap.Popup("d",
                            new SuperMap.LonLat(po.lon - width / 2, po.lat + ht / 2),
                            new SuperMap.Size(width, ht),
                            contentHTML,
                            false);
                        popup2.setOpacity(0.6);
                        popup2.setBackgroundColor('#FFF');
                        popup2.setBorder("0px");
                        mv.v.map.addPopup(popup2);
                    }
                }

                if (tempPots.length > 0) {
                    var tempMutiPots = new SuperMap.Geometry.MultiPoint(tempPots);
                    //mv.v.map.zoomToExtent(tempMutiPots.getBounds(), true);
                    mv.v.map.setCenter(tempMutiPots.getBounds().getCenterLonLat(), 10);
                    tempMutiPots.destroy();
                }

                tempPots = null;
            }
        },
        featureInfoHandler: function () {
            mv.v.map.removeAllPopup();
            var marker = this;
            var contentHTML = "<div style='font-size:12px;color: #000000; opacity: 1; overflow-y:hidden;'>";
            contentHTML += "<div>" + marker.properties.data.name + "</div></div>";

            //构建固定位置浮动弹窗，自适应显示
            var popup = new SuperMap.Popup.Anchored(
                marker.properties.data.id, //唯一标识
                marker.getLonLat(), //标记覆盖物的坐标
                new SuperMap.Size(10, 27),
                contentHTML,
                null,
                true,
                null);
            popup.autoSize = true;
            mv.v.map.addPopup(popup);

        },
        measureDistince: function () {
        },
        mapFullExtent: function () {
            //显示配置文件配置的显示范围
            mv.v.map.fitBounds(mv.fn.fullExtent());
        },
        createMapToolPanel: function (parentId) {
            if (mv.v.mapToolPanel != null) {
                return;
            } else {
                var parentContainer = Ext.getDom(parentId);
                mv.v.mapToolPanel = new Ext.create('Ext.container.Container', {
                    renderTo: parentContainer,
                    x: -500,
                    y: -100,
                    floating: true,
                    bodyStyle: 'opacity:0.9; filter: Alpha(Opacity=90);',
                    height: 30,
                    layout: {
                        type: 'hbox',
                        pack: 'start',
                        align: 'stretch'
                    },
                    defaults: {
                        border: false,
                        //ui: 'base-layeritem'
                    },
                    items: [
                        {
                            xtype: 'button',
                            tooltip: '全屏显示',
                            text: '全屏',
                            action: 'fullScreen',
                            pressed: false,
                            enableToggle: true,
                            iconCls: 'jz-tool-fullscreen'
                        },

                        /*{
                         xtype: 'button',
                         tooltip: '关键字检索',
                         text: '查询',
                         iconCls: 'jz-tool-query',
                         handler: function () {
                         //创建地图查询面板
                         mv.fn.createMapQueryPanel(mv.v.mapDivId);
                         }
                         },*/
                        /* {
                         xtype: 'button',
                         tooltip: '地图图例',
                         text: '图例',
                         iconCls: 'jz-plugin-legend',
                         handler: function () {
                         //创建地图图例面板
                         mv.fn.createMapLegendPanel(mv.v.mapDivId);
                         }
                         },*/
                        {
                            xtype: 'button',
                            tooltip: '地图全幅',
                            text: '全幅',
                            iconCls: 'jz-tool-fullextent',
                            handler: function () {
                                //地图全幅显示
                                mv.fn.mapFullExtent();
                            }
                        },
                        {
                            xtype: 'button',
                            tooltip: '测距',
                            text: '测距',
                            iconCls: 'jz-tool-fullextent',
                            handler: function (view) {
                                //地图全幅显示
                                //  mv.fn.measureDistince();
                                //   L.control.ruler({view:view}).addTo(mv.v.map);
                            },
                            listeners: {
                                added: function (view, ct, index, eOpts) {
                                 mv.v.measureDistool = L.control.ruler({view: view}).addTo(mv.v.map);
                                }
                            }
                        }
                        ,
                        {
                            xtype: 'button',
                            tooltip: '清除地图',
                            text: '清除',
                            iconCls: 'jz-tool-clear',
                            handler: function () {
                                if ( mv.v.measureDistool != null) {
                                    mv.v.measureDistool.clearHandler();
                                }
                                //清空专题地图
                                /*if (mv.v.geoVecLayer) {
                                    mv.v.geoVecLayer.removeAllFeatures();
                                    if (mv.v.mapPopup) {
                                        mv.v.map.removePopup(mv.v.mapPopup);
                                    }

                                    mv.v.lastStyle = null;
                                    mv.v.lastFeature = null;
                                    mv.v.mapPopup = null;
                                }*/
                            }
                        },
                        {
                            xtype: 'button',
                            tooltip: '透明度',
                            text: '透明度',
                            iconCls: 'jz-tool-opacity',
                            handler: function (view) {
                                if (mv.v.baseMapSilderCnp.hidden) {
                                    mv.v.baseMapSilderCnp.el.alignTo(view.el, "bl?", [0, 0], true);
                                }
                                mv.v.baseMapSilderCnp.setHidden(!mv.v.baseMapSilderCnp.hidden);
                            }
                        },
                        {
                            xtype: 'segmentedbutton',
                            defaults: {
                                border: false,
                                ui: 'map-tool-ui',
                                scale: 'medium'
                            }
                            ,
                            items: [{
                                xtype: 'button',
                                action: 'image',
                                text: '影像',
                                iconCls: 'jz-tool-image'
                            }, {
                                xtype: 'button',
                                action: 'vector',
                                pressed: true,
                                text: '矢量',
                                iconCls: 'jz-tool-vector'
                            }],
                            listeners: {
                                toggle: function (container, button, pressed) {
                                    if (pressed) {
                                        var action = button['action'];
                                        mv.fn.switchBaseLayer(action);
                                    }
                                }
                            }
                        }
                    ]
                })
                ;
            }
            //var toolDom = mv.v.mapToolPanel.el.dom;
            //mv.v.mapToolPanel.el.alignTo(parentContainer, "tl?", [parentContainer.clientWidth - 5 - toolDom.clientWidth, 5], true);
            mv.v.mapToolPanel.el.alignTo(parentContainer, "tl?", [5, 5], true);
            mv.v.mapToolPanel.updateLayout();
        },
        switchBaseLayer: function (action) {
            //显示影像地图
            mv.fn.clearLayerByID('esriimage');
            mv.fn.clearLayerByID('esrivector');
            var opactity = 1 - (mv.v.baseMapSilderCnp.getValue() / 100);
            switch (action) {
                case"image": {
                    if (mv.v.gaodeImgLayer == null) {

                        mv.v.gaodeImgLayer =  L.esri.tiledMapLayer({url: conf.esriMapImgUrl,id:"esriimage",zoomOffset:-1});
                    }
                    mv.v.gaodeImgLayer.setOpacity(opactity);
                    mv.v.gaodeImgLayer.addTo(mv.v.map);
                    break;
                }
                case "vector": {
                    if (mv.v.gaodeVecLayer == null) {
                        mv.v.gaodeVecLayer =  L.esri.tiledMapLayer({url: conf.esriMapVectorUrl,id:"esrivector"});
                    }
                    mv.v.gaodeVecLayer.setOpacity(opactity);
                    mv.v.gaodeVecLayer.addTo(mv.v.map);
                    break;
                }
                default: {
                    break;
                }
            }
            /*mv.v.tdtBaseLayer.redraw();
            mv.v.tdtLabelBaseLayer.redraw();*/
        },
        refreshLayout: function (id) {
            var parentContainer = Ext.getDom(id);
            if (mv.v.mapToolPanel) {
                var toolDom = mv.v.mapToolPanel.el.dom;
                // mv.v.mapToolPanel.el.alignTo(parentContainer, "tl?", [parentContainer.clientWidth - 5 - toolDom.clientWidth, 5], true);
                mv.v.mapToolPanel.el.alignTo(parentContainer, "tl?", [5, 5], true);
            }
            /*if (mv.v.mapLegendPanel) {
                var legendDom = mv.v.mapLegendPanel.el.dom;
                mv.v.mapLegendPanel.el.alignTo(parentContainer, "tl?", [parentContainer.clientWidth - 5 - legendDom.clientWidth, parentContainer.clientHeight - 5 - legendDom.clientHeight], true);
            }*/
        }
    }
}
Ext.define('jxxc.view.MapView', {
    extend: 'Ext.Container',

    //Uncomment to give this component an xtype
    xtype: 'jz-mapview',

    requires: [
        'Ext.container.Container',
        'Ext.layout.container.Fit'
    ],
    layout: 'fit',
    initComponent: function () {
        this.items = [{
            xtype: 'container',
            html: '<div id="mapContainerId" style="width: 100%;height: 100%;overflow: hidden;margin:0;position: relative;border: hidden;"></div>',
            margin: '0 0 0 0',
            listeners: {
                afterlayout: function () {
                    if (!mv.v.isMapAdded) {
                        mv.v.isMapAdded = true;
                        mv.v.mapDivId = 'mapContainerId';
                        mv.fn.initMap(mv.v.mapDivId);
                    }
                    if (mv.v.map) {
                        mv.v.map.invalidateSize();
                    }

                    mv.fn.refreshLayout(mv.v.mapDivId);
                }
            }
        }];
        this.callParent();
    }
});