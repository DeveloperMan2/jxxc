/**
 * Created by on 2017/11/13.
 */
Ext.define('jxxc.view.realtime.RealTimeView', {
    extend: 'Ext.Container',

    /*
    Uncomment to give this component an xtype*/
    xtype: 'jz-realtimeview',

    requires: [
        'Ext.container.Container',
        'Ext.grid.Panel',
        'Ext.grid.column.Action',
        'Ext.layout.container.Fit',
        'jxxc.store.RealTime',
        'jxxc.view.realtime.RealTimeViewController',
        'jxxc.view.realtime.RealTimeViewModel'
    ],
    layout: 'fit',
    controller:'realtime',
    initComponent: function () {
        this.items = [{
            xtype: 'container',
            margin: '0 0 0 0',
            items: [
                {
                    xtype: 'gridpanel',
                    store: {
                        type: 'realtime'
                    },
                    columns: [
                        {
                            text: '名称', dataIndex: 'name', align: 'center', flex: 1, menuDisabled: true,
                            sortable: false,
                        },
                        {
                            text: '在线时长(分钟)', dataIndex: 'date', align: 'center', flex: 1, menuDisabled: true,
                            sortable: false,
                        },
                        {
                            text: '控制',
                            menuDisabled: true,
                            sortable: false,
                            xtype: 'actioncolumn',
                            align: 'center',
                            width: 50,
                            items: [
                                {
                                    iconCls: 'xc-location',
                                    scale: 'large',
                                    tooltip: '查看路线',
                                    handler: 'locationHandler'
                                }
                            ]
                        }
                    ],
                    listeners: {
                        'select': 'selectHandler'
                    }
                }
            ]
        }]
        this.callParent();
    }

});
