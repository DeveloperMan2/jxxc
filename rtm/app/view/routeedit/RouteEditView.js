/**
 * Created by LBM on 2017/11/13.
 */
Ext.define('rtm.view.routeedit.RouteEditView', {
    extend: 'Ext.Container',

    /*
     Uncomment to give this component an xtype*/
    xtype: 'jz-routeeditview',

    requires: [
        'Ext.container.Container',
        'Ext.grid.Panel',
        'Ext.grid.column.Action',
        'Ext.layout.container.Fit',
        'rtm.store.RealTime',
        'rtm.view.routeedit.RouteEditViewController'
    ],
    layout: 'fit',
    controller:'editroute',
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
                            text: '路线', dataIndex: 'name', align: 'center', flex: 1, menuDisabled: true,
                            sortable: false
                        },
                        {
                            text: '巡查点', dataIndex: 'fix', align: 'center', flex: 1, menuDisabled: true,
                            sortable: false
                        },
                        {
                            text: '操作',
                            menuDisabled: true,
                            sortable: false,
                            xtype: 'actioncolumn',
                            align: 'center',
                            width: 50,
                            items: [
                                {
                                    iconCls: 'xc-routeedit',
                                    scale: 'large',
                                    tooltip: '编辑路线',
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
