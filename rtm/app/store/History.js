/**
 * Created by LBM on 2017/11/19.
 */
Ext.define('jxxc.store.History', {
    extend: 'Ext.data.Store',
    alias: 'store.history',

    proxy: {
        type: 'ajax',
        url: 'resources/data/history.json',
        reader: {
            type: 'json'
        }
    },
    autoLoad: true
});