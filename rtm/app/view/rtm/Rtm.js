/**
 * Created by LBM on 2017/12/16.
 */
Ext.define('rtm.view.rtm.Rtm', {
    extend: 'Ext.Container',

    requires: [
        'Ext.container.Container',
        'Ext.data.TreeStore',
        'Ext.data.proxy.Ajax',
        'Ext.form.Label',
        'Ext.form.field.Checkbox',
        'Ext.form.field.Date',
        'Ext.form.field.Text',
        'Ext.grid.column.Action',
        'Ext.layout.container.HBox',
        'Ext.layout.container.VBox',
        'Ext.selection.RowModel',
        'Ext.tree.Column',
        'Ext.tree.Panel',
        'rtm.plugin.SearchField',
        'rtm.view.rtm.RtmController',
        'rtm.view.rtm.RtmModel'
    ],

    /*
     Uncomment to give this component an xtype*/
    xtype: 'jz-rtmview',


    viewModel: {
        type: 'rtm'
    },

    controller: 'rtm',
    listeners: {
        afterrender: 'rtmAfterRenderHandler'
    },

    layout: {
        type: 'vbox',
        pack: 'start',
        align: 'stretch'
    },

    items: [
        {
            xtype: 'container',
            layout: {
                type: 'hbox',
                pack: 'start',
                align: 'middle'
            },
            margin: '5 5 5 5',
            items: [
                {
                    xtype: 'checkboxfield',
                    name: 'inspectorMapId',
                    margin: '0 5 0 5',
                    height: 30,
                    boxLabel: '开启巡检人员分布图',
                    listeners: {
                        change: 'inspectorChange'
                    }
                },
                {
                    xtype: 'component',
                    width: 20
                },
                {
                    xtype: 'checkboxfield',
                    name: 'refreshId',
                    margin: '0 5 0 5',
                    // checked:true,
                    height: 30,
                    boxLabel: '自动刷新',
                    listeners: {
                        change: 'refreshChange'
                    }
                },
                {
                    xtype: 'textfield',
                    id: 'refreshTimeGep',
                    width: 50,
                    value: 5
                },
                {
                    xtype: 'label',
                    text: '分钟'
                }
            ]
        },
        {
            xtype: 'component',
            height: 5
        }
        ,
        {
            xtype: 'container',
            height: 40,
            layout: {
                type: 'hbox',
                pack: 'start',
                align: 'middle'
            }
            ,
            margin: '5 5 5 5',
            items: [
                {
                    xtype: 'datefield',
                    // format: 'Y-m-d H:i:s',
                    format: 'Y-m-d',
                    fieldLabel: '巡查时间',
                    reference: 'rtmDateId',
                    flex: 1,
                    emptyText: '请选择起始时间',
                    allowBlank: false,
                    labelWidth: 60,
                    // value: new Date(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate(), 8, 0, 0),
                    value: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
                    listeners: {
                        change: 'querySearch'
                    }//默认提前一天
                },
                {
                    xtype: 'component',
                    width: 10
                },
                {
                    xtype: 'label',
                    text: '关键字：'
                },
                {
                    xtype: 'searchField',
                    id: 'rtmKeyWordId',
                    floating: false,
                    hideLabel: true,
                    flex: 0.7,
                    height: 30,
                    emptyText: "水库名称或编码",
                    listeners: {
                        specialkey: 'enterHandler',
                        change: 'changeHandler'
                    }
                }
            ]
        }
        ,
        {
            xtype: 'component',
            height: 5
        }
        ,
        {
            xtype: 'container',
            height: 30,
            layout: {
                type: 'hbox',
                pack: 'start',
                align: 'center'
            }
            ,
            margin: '5 5 5 5',
            items: [
                {
                    xtype: 'label',
                    text: '统计信息：'
                },
                {
                    xtype: 'label',
                    width: 14,
                    height: 14,
                    style: {
                        background: 'green'
                    }
                },
                {
                    xtype: 'label',
                    id: 'state0Id',
                    text: '正常()'
                },
                {
                    xtype: 'component',
                    width: 5
                },
                {
                    xtype: 'label',
                    width: 14,
                    height: 14,
                    style: {
                        background: 'orange'
                    }
                },
                {
                    xtype: 'label',
                    id: 'state1Id',
                    text: '超时()'
                },
                {
                    xtype: 'component',
                    width: 5
                },
                {
                    xtype: 'label',
                    width: 14,
                    height: 14,
                    style: {
                        background: 'blue'
                    }
                },
                {
                    xtype: 'label',
                    id: 'state2Id',
                    text: '进行中()'
                },
                {
                    xtype: 'component',
                    width: 5
                },
                {
                    xtype: 'label',
                    width: 14,
                    height: 14,
                    style: {
                        background: 'red'
                    }
                },
                {
                    xtype: 'label',
                    id: 'state3Id',
                    text: '作废()'
                }
            ]
        }
        ,
        {
            xtype: 'component',
            height: 5
        }
        ,
        {
            xtype: 'treepanel',
            id: 'rtmTreeID',
            ui: 'rtm-tree-grid-ui',
            margin: '0 5 5 5',
            flex: 1,
            border: true,
            reserveScrollbar: true,
            useArrows: true,
            rootVisible: false,
            sealedColumns: true,
            selModel: 'rowmodel',
            multiSelect: false,
            singleExpand: false,
            scrollable: true,
            autoLoad: false,
            store: {
                type: 'tree',
                folderSort: false,
                proxy: {
                    type: 'ajax',
                    url: 'resources/data/rtmdata.json'//TODO 2018-04-23---测试本地数据加载，加载后台服务需要屏蔽该行代码。
                    //  url: conf.serviceRootUrl+'rtmdata'
                },
                autoLoad: false
            },

            listeners: {
                'cellclick': 'cellclickHandler',
                'rowclick': 'rowclickHandler'/*,
                'added': 'rtmTreeAdded'*/
            }
            ,
            selModel: {
                mode: "single",
                selection: "rowmodel"
            }
            ,
            viewConfig: {
                getRowClass: function (record, rowIndex, rowParams, store) {
                    var cls = "";
                    var state = record.get("state");
                    var leaf = record.get("leaf");
                    //TODO 2018-04-23---目前为取消巡检路线变色，仅水库行按照状态变色，酌情处理
                    if (leaf) {
                        switch (state) {
                            case '正常' :
                                cls = 'x-grid-row-green';
                                break;
                            case '超时' :
                                cls = 'x-grid-row-orange';
                                break;
                            case '进行中' :
                                cls = 'x-grid-row-blue';
                                break;
                            case '作废' :
                                cls = 'x-grid-row-red';
                                break;
                        }
                    }
                    return cls;
                }
            }
            ,
            columns: [
                {
                    xtype: 'treecolumn',
                    text: '巡检路线',
                    dataIndex: 'task',
                    flex: 1.5,
                    menuDisabled: true,
                    resizable: false,
                    sortable: false
                },
                /*{
                 text: '巡检状态',
                 dataIndex: 'duration',
                 flex: 1,
                 menuDisabled: true,
                 resizable: false,
                 sortable: false,
                 align: 'center',
                 formatter: 'this.formatState'//@todo:如果后台没有返回状态，则根据持续时间判断。
                 }*/
                {
                    text: '巡检状态',
                    dataIndex: 'state',
                    flex: 0.8,
                    menuDisabled: true,
                    resizable: false,
                    sortable: false,
                    align: 'center'
                },
                {
                    text: '巡检人',
                    dataIndex: 'inspector',
                    flex: 0.8,
                    menuDisabled: true,
                    resizable: false,
                    sortable: false,
                    align: 'center'
                }, {
                    text: '电话',
                    dataIndex: 'phone',
                    flex: 1.2,
                    menuDisabled: true,
                    resizable: false,
                    sortable: false,
                    align: 'center'
                },
                {
                    xtype: 'actioncolumn',
                    text: '操作',
                    width: 55,
                    menuDisabled: true,
                    tooltip: '快速定位',
                    align: 'center',
                    items: [{
                        getClass: function (v, metaData, record) {          // Or return a class from a function
                            if (!record.data.leaf) {
                                return;
                            } else {
                                return 'xc-location';
                            }
                        },
                        handler: function (grid, rowIndex, colIndex) {//add on 2014-1-23
                            var rec = grid.getStore().getAt(rowIndex);
                            var mark = L.latLng(rec.get('lat'), rec.get('lgt'));
                            mv.v.map.flyTo(mark, mv.v.map.options.crs.options.resolutions.length - 2);
                        }
                    }]
                }
            ]
        }
    ]
})
;
