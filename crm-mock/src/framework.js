var contactSearchCallback;

window.Framework = {
    config: {
        name:"EmbedFwk",
        clientIds: {
//           'mypurecloud.com': 'd074bf5f-36bd-4240-a864-cfdc898757b8',
//            'mypurecloud.com': 'e663daab-7533-4b90-8dc1-55a56b761f99',			
            'mypurecloud.com': '',
            'sae1.pure.cloud': '4f1e50f2-8e86-4d5c-b1d7-49bc5c281070',
            'mypurecloud.ie': '',
            'mypurecloud.com.au': '',
            'mypurecloud.jp': '',
            'mypurecloud.de': ''
        },
        customInteractionAttributes: ['PT_URLPop', 'PT_SearchValue', 'PT_TransferContext', 'exampleWorkspaceKey', 'CPF_Cliente'],
        settings: {
            embedWebRTCByDefault: true,
            hideWebRTCPopUpOption: false,
            enableCallLogs: true,
            enableTransferContext: true,
            hideCallLogSubject: true,
            hideCallLogContact: false,
            hideCallLogRelation: false,
            searchTargets: ['people', 'queues', 'frameworkcontacts'],
            theme: {
                primary: '#d4cebd',
                text: '#080'
            }
        }
    },

    initialSetup: function () {
        window.PureCloud.subscribe([
            {
                type: 'Interaction', 
                callback: function (category, interaction) {
                    window.parent.postMessage(JSON.stringify({type:"interactionSubscription", data:{category:category, interaction:interaction}}) , "*");
                }  
            },
            {
                type: 'UserAction', 
                callback: function (category, data) {
                    window.parent.postMessage(JSON.stringify({type:"userActionSubscription", data:{category:category, data:data}}) , "*");
                }  
            },
            {
                type: 'Notification', 
                callback: function (category, data) {
                    window.parent.postMessage(JSON.stringify({type:"notificationSubscription", data:{category:category, data:data}}) , "*");
                }  
            }
        ]);

        window.addEventListener("message", function(event) {
            try {
                var message = JSON.parse(event.data);
                if(message){
                    if(message.type == "clickToDial"){
                        window.PureCloud.clickToDial(message.data);
                    } else if(message.type == "addAssociation"){
                        window.PureCloud.addAssociation(message.data);
                    }else if(message.type == "addAttribute"){
                        window.PureCloud.addCustomAttributes(message.data);
                    }else if(message.type == "addTransferContext"){
                        window.PureCloud.addTransferContext(message.data);
                    }else if(message.type == "sendContactSearch"){
                        if(contactSearchCallback) {
                            contactSearchCallback(message.data);
                        }
                    }else if(message.type == "updateUserStatus"){
                        window.PureCloud.User.updateStatus(message.data);
                    }else if(message.type == "updateInteractionState"){
                        window.PureCloud.Interaction.updateState(message.data);
                    }else if(message.type == "setView"){
                        window.PureCloud.User.setView(message.data);
                    }else if(message.type == "updateAudioConfiguration"){
                        window.PureCloud.User.Notification.setAudioConfiguration(message.data);
                    }else if(message.type == "sendCustomNotification"){
                        window.PureCloud.User.Notification.notifyUser(message.data);
                    }
                }
            } catch {
                //ignore if you can not parse the payload into JSON
            }
        });
    },
    screenPop: function (searchString, interaction) {
        window.parent.postMessage(JSON.stringify({type:"screenPop", data:{searchString:searchString, interactionId:interaction}}) , "*");
    },
    processCallLog: function (callLog, interaction, eventName, onSuccess, onFailure) {
        window.parent.postMessage(JSON.stringify({type:"processCallLog" , data:{callLog:callLog, interactionId:interaction, eventName:eventName}}) , "*");
        var success = true;
        if (success) {
            onSuccess({
                id: callLog.id || Date.now()
            });
        } else {
            onFailure();
        }
    },
    openCallLog: function(callLog, interaction){
        window.parent.postMessage(JSON.stringify({type:"openCallLog" , data:{callLog:callLog, interaction:interaction}}) , "*");
    },
    contactSearch: function(searchString, onSuccess, onFailure) {
        contactSearchCallback = onSuccess;
        window.parent.postMessage(JSON.stringify({type:"contactSearch" , data:{searchString:searchString}}) , "*");
    }
};