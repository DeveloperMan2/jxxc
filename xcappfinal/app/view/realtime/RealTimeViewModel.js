/**
 * Created by LBM on 2017/10/24.
 */
Ext.define('jxxc.view.realtime.RealTimeViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.main',

    stores: {
        /*
        A declaration of Ext.data.Store configurations that are first processed as binds to produce an effective
        store configuration. For example:

        users: {
            model: 'Main',
            autoLoad: true
        }
        */
    },

    data: {
        /* This object holds the arbitrary data that populates the ViewModel and is then available for binding. */
        map: null,
        xcls: null
    }
});