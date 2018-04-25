/**
 * Created by LBM on 2017/12/16.
 */
Ext.define('jxxc.view.rtm.Rtm', {
    extend: 'Ext.Container',

    requires: [
        'Ext.container.Container',
        'Ext.data.TreeStore',
        'Ext.data.proxy.Ajax',
        'Ext.form.Label',
        'Ext.form.field.Checkbox',
        'Ext.form.field.Text',
        'Ext.grid.column.Action',
        'Ext.layout.container.HBox',
        'Ext.layout.container.VBox',
        'Ext.selection.RowModel',
        'Ext.tree.Column',
        'Ext.tree.Panel',
        'jxxc.plugin.SearchField',
        'jxxc.view.rtm.RtmController',
        'jxxc.view.rtm.RtmModel'
    ],

    /*
     Uncomment to give this component an xtype*/
    xtype: 'jz-rtmview',


    viewModel: {
        type: 'rtm'
    },

    controller: 'rtm',

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
                    boxLabel: '开启巡检人员分布图'
                },
                {
                    xtype: 'component',
                    width: 20
                },
                {
                    xtype: 'checkboxfield',
                    name: 'refreshId',
                    margin: '0 5 0 5',
                    height: 30,
                    boxLabel: '自动刷新'
                },
                {
                    xtype: 'textfield',
                    width: 50
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
                    xtype: 'label',
                    text: '巡查时间：'
                },
                {
                    xtype: 'container',
                    height: 32,
                    html: '<div style="height: 32px;line-height: 32px"><input id="rtmDateId" type="text" placeholder="请选择"  readonly style="width: 100%; height:32px; border:1px #bcc2c6 solid;text-align: center;font-weight:normal;color: #7f8c8d;"></div>',
                    listeners: {
                        afterrender: 'daterenderHandler'
                    },
                    flex: 1
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
                    flex: 1,
                    height: 30,
                    emptyText: "水库名称或编码",
                    listeners: {
                        specialkey: function (text, field, event, eOpts) {
                            if (field.getKeyName() == "ENTER") {
                                alert(text.getValue());
                            }
                        },
                        change: function (text, newValue, oldValue, eOpts) {
                            if (newValue != '') {
                                text.getTrigger('clear').show();
                            } else if (newValue == '') {
                                text.getTrigger('clear').hide();
                            }
                        }
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
                        background: '#0F0'
                    }
                },
                {
                    xtype: 'label',
                    text: '正常(10)'
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
                        background: '#F00'
                    }
                },
                {
                    xtype: 'label',
                    text: '异常(1)'
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
                        background: '#FF0'
                    }
                },

                {
                    xtype: 'label',
                    text: '未巡检(5)'
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
                        background: '#00F'
                    }
                },
                {
                    xtype: 'label',
                    text: '巡检中(4)'
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
            store: {
                type: 'tree',
                folderSort: false,
                proxy: {
                    type: 'ajax',
                    url: 'resources/data/rtmdata.json'
                }
            },

            listeners: {
                'cellclick': function (element, td, cellIndex, record, tr, rowIndex, e, eOpts) {
                    if (cellIndex == 0 && record.data.type == 'reservoir' && record.data.lgt != null && record.data.lat != null) {
                        var mark = L.latLng(record.data.lat, record.data.lgt);
                        mv.v.map.flyTo(mark, 13);
                    }
                },
                'added': 'rtmTreeAdded'
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
                    switch (state) {
                        case '巡检中' :
                            cls = 'x-grid-row-blue';
                            break;
                        case '未巡检' :
                            cls = 'x-grid-row-yellow';
                            break;
                        case '正常' :
                            cls = 'x-grid-row-green';
                            break;
                        case '异常' :
                            cls = 'x-grid-row-red';
                            break;
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
                    text: '详情',
                    width: 55,
                    menuDisabled: true,
                    tooltip: '查看详情',
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
                            //var rec = grid.getStore().getAt(rowIndex);

                        }
                    }]
                }
            ]
        }
    ]
})
;