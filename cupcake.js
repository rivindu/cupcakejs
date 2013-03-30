/* 
 * \__________________________________cupcake__________________________________/
 * 
 * cupcake.js is a javascript library which manages both HTML5 session and local 
 * storages coming with all HTML5 supported browsers. 
 * 
 * You can get more details in cupcake page >> www.rivindu.com/cupcakejs
 * 
 * Licensed under the MIT license.
 * 
 * Copyright (c) 2012-2013 Rivindu Perera
 * 
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation 
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the 
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN 
 * THE SOFTWARE.
 * 
 */


(function() {
    
    var lStore,
        localCakeValue,
        localCakeExpireValue,
        localHardMonitorList,
        localSoftMonitorList;
    
    var sStore,
        sessionCakeValue,
        sessionCakeExpireValue,
        sessionHardMonitorList,
        sessionSoftMonitorList;
    
    var cakeType ={
        "LOCAL" : 0,
        "SESSION" : 1
    };
    
    var mainActionType = {
            "UPDATE" :0,
            "DELETE" :1,
            "EXPIRE" :2,
            "KEYCHANGE" :3
    };
    
//------------------------------Initialization--------------------------------\\        
    function initialize_() {
        var localStoreExists = false;
        var sessionStoreExists = false;
        
        var localStoreExists = (function() {
            try {
                localStorage.setItem("cupcakeTest", "cupcakeTest");
                localStorage.removeItem("cupcakeTest");
                return true;
            } catch (ex) {
                return false;
            }
        }());
        
        var sessionStoreExists = (function() {
            try {
                sessionStorage.setItem("cupcakeTest", "cupcakeTest");
                sessionStorage.removeItem("cupcakeTest");
                return true;
            } catch (ex) {
                return false;
            }
        }());
        
        if(localStoreExists){
            lStore = window.localStorage;
            
            localCakeValue = lStore.getItem("cupcake");
            localCakeExpireValue = lStore.getItem("cupcake_exp");
            localHardMonitorList=lStore.getItem("cupcake_mon");
            
            if(localCakeValue === null){
                lStore.setItem("cupcake","{}");
                lStore.setItem("cupcake_exp", "{}");
                lStore.setItem("cupcake_mon", "{}");
                
                localCakeValue = lStore.getItem("cupcake");
                localCakeExpireValue = lStore.getItem("cupcake_exp");
                localHardMonitorList=lStore.getItem("cupcake_mon");
            }
            
            localCakeValue = JSON.stringify(eval("(" + localCakeValue + ")"));
            localCakeValue= JSON.parse(localCakeValue);
            
            localCakeExpireValue = JSON.stringify(eval("(" + localCakeExpireValue + ")"));
            localCakeExpireValue= JSON.parse(localCakeExpireValue);
            
            localHardMonitorList = JSON.stringify(eval("(" + localHardMonitorList + ")"));
            localHardMonitorList = JSON.parse(localHardMonitorList);
            
            localSoftMonitorList = {};
            
            removeExpiredKeys_(cakeType.LOCAL);
        }
        if(sessionStoreExists){
            sStore =window.sessionStorage;
            
            sessionCakeValue = sStore.getItem("cupcake");
            sessionCakeExpireValue = sStore.getItem("cupcake_exp");
            sessionHardMonitorList=sStore.getItem("cupcake_mon");
            
            if(sessionCakeValue === null){
                sStore.setItem("cupcake","{}");
                sStore.setItem("cupcake_exp", "{}");
                sStore.setItem("cupcake_mon", "{}");
                
                sessionCakeValue = sStore.getItem("cupcake");
                sessionCakeExpireValue = sStore.getItem("cupcake_exp");
                sessionHardMonitorList = sStore.getItem("cupcake_mon");
            }
            
            sessionCakeValue = JSON.stringify(eval("(" + sessionCakeValue + ")"));
            sessionCakeValue= JSON.parse(sessionCakeValue);
            
            sessionCakeExpireValue = JSON.stringify(eval("(" + sessionCakeExpireValue + ")"));
            sessionCakeExpireValue= JSON.parse(sessionCakeExpireValue);
            
            sessionHardMonitorList = JSON.stringify(eval("(" + sessionHardMonitorList + ")"));
            sessionHardMonitorList = JSON.parse(sessionHardMonitorList);
            
            sessionSoftMonitorList = {};
            
            removeExpiredKeys_(cakeType.SESSION);            
        }
    }
//-------------------------End of Initialization------------------------------\\

//------------------------------Utility Functions-----------------------------\\

   /**
    * Get Storage type
    * 
    * @param {cakeType} type
    * @returns {Object} store
    */
   function getCakeStoreByType_(type){
        if(type===cakeType.LOCAL){
           return  lStore;
        }
        else {
            return sStore;
        }
    }
    
    /**
     * Get storage value
     * 
     * @param {cakeType} type
     * @returns {Object} value
     */
    function getCakeValueByType_(type){
        if(type===cakeType.LOCAL){
           return  localCakeValue;
        }
        else {
            return sessionCakeValue;
        }
    }
    
    /**
     * Get hard monitor list
     * 
     * @param {cakeType} type
     * @returns {Object} monitorList
     */
    function getHardMonitorListByType_(type){
        if(type===cakeType.LOCAL){
           return  localHardMonitorList;
        }
        else {
            return sessionHardMonitorList;
        }
    }
    
    /**
     * Get soft monitor list
     * 
     * @param {cakeType} type
     * @returns {Obejct} monitorList
     */
    function getSoftMonitorListByType_(type){
        if(type===cakeType.LOCAL){
           return  localSoftMonitorList;
        }
        else {
            return sessionSoftMonitorList;
        }
    }
    
    /**
     * Get expire values
     * 
     * @param {cakeType} type
     * @returns {Object} expireValues
     */
    function getExpireValueByType_(type){
        if(type===cakeType.LOCAL){
           return  localCakeExpireValue;
        }
        else {
            return sessionCakeExpireValue;
        }
    }
//--------------------------End of Utility Functions--------------------------\\

//--------------------------------Core Functions------------------------------\\
    /**
     * Save item to the storage
     * 
     * @param {String} key
     * @param {String} value
     * @param {Number} expire
     * @param {cakeType} type
     * @returns {Boolean} status
     */
    function saveItem_(key, value, expire, type)
    {       
         if(!keyExists_(key,type)){     
                getCakeValueByType_(type)[key] = value;          
                reLoadData_(type);
                if(expire > 0){
                    addExpire_(key, expire, type);
                }
                return true;
            }
            else{
                return false;
            }
             
    }
    
    /**
     * Retrieve item from the storage
     * 
     * @param {String} key
     * @param {cakeType} type
     * @returns {String} status
     */
    function getItem_(key,type)
    {
        return getCakeValueByType_(type)[key];
    }
    
    /**
     * Update value of an existing key
     * 
     * @param {String} key
     * @param {String} newValue
     * @param {cakeType} type
     * @returns {Boolean} status
     */
    function updateValue_(key, newValue, type)
    {       
        getCakeValueByType_(type)[key] = newValue;
        reLoadData_(type);
        if (Object.keys(getHardMonitorListByType_(type)).indexOf(key) > -1) {
            invokeHardMonitor_(key, mainActionType.UPDATE, type);
        }
        if (Object.keys(getSoftMonitorListByType_(type)).indexOf(key) > -1) {
            invokeSoftMonitor_(key, mainActionType.UPDATE, type);
        }
        return true;    
    }
    
    /**
     * Update key name of exisitng key
     * 
     * @param {String} originalKey
     * @param {String} newKey
     * @param {cakeType} type
     * @returns {Boolean} status
     */
    function updateKey_(originalKey, newKey,type)
    {       
        if (!keyExists_(newKey, type)) {
            var tempVal = getCakeValueByType_(type)[originalKey];
            removeItem_(originalKey, type, 1);
            var status = saveItem_(newKey, tempVal, 0, type);
            if (status) {
                if (Object.keys(getExpireValueByType_(type)).indexOf(originalKey) > -1) {
                    var tmpTimeStamp = getExpireValueByType_(type)[originalKey];
                    removeExpireRecord_(originalKey, type);
                    getExpireValueByType_(type)[newKey] = tmpTimeStamp;
                    reLoadExpireData_(type);
                    setTimeout(function() {
                        manageExpire_(newKey, type);
                    }, tmpTimeStamp - (new Date().getTime()));

                }
                if (Object.keys(getHardMonitorListByType_(type)).indexOf(originalKey) > -1) {
                    invokeHardMonitor_(originalKey, mainActionType.KEYCHANGE, type);
                }
                if (Object.keys(getSoftMonitorListByType_(type)).indexOf(originalKey) > -1) {
                    invokeSoftMonitor_(originalKey, mainActionType.KEYCHANGE, type);
                }

                if (Object.keys(getHardMonitorListByType_(type)).indexOf(originalKey) > -1) {
                    var tempfunc = getHardMonitorListByType_(type)[originalKey];
                    removeHardMonitor_(originalKey, type);
                    addHardMonitor_(newKey, tempfunc, type);

                }
                if (Object.keys(getSoftMonitorListByType_(type)).indexOf(originalKey) > -1) {
                    var tempfunc = getSoftMonitorListByType_(type)[originalKey];
                    removeSoftMonitor_(originalKey, type);
                    addSoftMonitor_(newKey, tempfunc, type);
                }
            }

        }
        return status;
    }
    
    /**
     * Removes an item from the storage
     * 
     * @param {String} key
     * @param {cakeType} type
     * @param {origin} origin
     * @returns {Boolean} status
     */
    function removeItem_(key, type, origin)
    {    
        delete getCakeValueByType_(type)[key];
        reLoadData_(type);
        //origin => 0 for direct delete
        //       => 1 for indirect delete
        if (Object.keys(getHardMonitorListByType_(type)).indexOf(key) > -1 && origin === 0) {
            invokeHardMonitor_(key, mainActionType.DELETE, type);
        }
        if (Object.keys(getSoftMonitorListByType_(type)).indexOf(key) > -1 && origin === 0) {
            invokeSoftMonitor_(key, mainActionType.DELETE, type);
        }
        return true;
    }
    
    /**
     * Returns all keys in the storage
     * 
     * @param {cakeType} type
     * @returns {Array} keyArray
     */
    function getAllKeys_(type)
    {
        return Object.keys(getCakeValueByType_(type));
    }
    
    /**
     * Add "hard reload" friendly Monitor 
     * 
     * @param {String} key
     * @param {String} func - callback function
     * @param {cakeType} type
     * @returns {Boolean} status
     */
    function addHardMonitor_(key, func, type)
    {        
        if (keyExists_(key, type)) {
            getHardMonitorListByType_(type)[key] = func;
            reLoadHardMonitorData_(type);
            return true;
        }
        else {
            return false;
        }    
    }
    
    /**
     * Invoke the hard monitor
     * 
     * @param {String} key
     * @param {String} action
     * @param {cakeType} type
     * @returns {Boolean} status of the operation
     */
    function invokeHardMonitor_(key,action,type)
    {
        window[getHardMonitorListByType_(type)[key]](key,action);
    }
    
    /**
     * Remove hard monitor
     * 
     * @param {String} key
     * @param {cakeType} type
     * @returns {Boolean} status of the operation
     */
    function removeHardMonitor_(key, type)
    {
        delete getHardMonitorListByType_(type)[key];
        reLoadHardMonitorData_(type);
        return true;
    }
    
    /**
     * Add monitor which will be disable after hard reload
     * 
     * @param {String} key
     * @param {Object} func - calback function
     * @param {cakeType} type
     * @returns {Boolean} status
     */
    function addSoftMonitor_(key, func, type)
    {
         getSoftMonitorListByType_(type)[key]=func;    
         return true;
    }
    
    /**
     * Invoke the soft monitor
     * 
     * @param {String} key
     * @param {action} action
     * @param {cakeType} type
     * @returns {Boolean} status
     */
    function invokeSoftMonitor_(key,action,type)
    {
        getSoftMonitorListByType_(type)[key](key,action);
    }
    
    /**
     * Remove soft monitor
     * 
     * @param {String} key
     * @param {cakeType} type
     * @returns {Boolean} status
     */
    function removeSoftMonitor_(key, type)
    {
        delete getSoftMonitorListByType_(type)[key];
    }
    
    /**
     * Add expire trigger to key
     * 
     * @param {String} key
     * @param {Number} duration
     * @param {cakeType} type
     * @returns {Boolean} status
     */
    function addExpire_(key, duration, type)
    {
        if (keyExists_(key, type)) {
            getExpireValueByType_(type)[key] = (new Date().getTime()) + duration;
            reLoadExpireData_(type);
            setTimeout(function() {
                manageExpire_(key, type);
            }, duration);
            return true;
        }
        else {
            return false;
        }
    }
    
    /**
     * Remove key entries once expired
     * 
     * @param {String} key
     * @param {cakeType} type
     * @returns {Boolean} status
     */
    function manageExpire_(key, type)
    {
        if (Object.keys(getHardMonitorListByType_(type)).indexOf(key) > -1) {
            invokeHardMonitor_(key, mainActionType.EXPIRE, type);
        }
        if (Object.keys(getSoftMonitorListByType_(type)).indexOf(key) > -1) {
            invokeSoftMonitor_(key, mainActionType.EXPIRE, type);
        }
        removeItem_(key, type,1);
        removeExpireRecord_(key, type);
        return true;       
    }
    
    /**
     * Remove expired key entries
     * 
     * @param {cakeType} type
     * @returns {Boolean} status
     */
    function removeExpiredKeys_(type)
    {
        var keyList = Object.keys(getExpireValueByType_(type));
        for (var key in keyList) {
            if ((getExpireValueByType_(type)[key] - (new Date().getTime())) <= 0) {
                removeExpireRecord_(key, type);
            }
        }
        return true;
    }
    
    /**
     * Removes expire entry
     * 
     * @param {String} key
     * @param {cakeType} type
     * @returns {Boolean} status
     */
    function removeExpireRecord_(key, type)
    {
        delete getExpireValueByType_(type)[key];
        return reLoadExpireData_(type);
    }
    
    /**
     * Return remaining time of the key where expiration is set
     * 
     * @param {String} key
     * @param {cakeType} type
     * @returns {Object} remaining time or null
     */
    function getRemainingExpirationTime_(key, type)
    {
        if (getExpireValueByType_(type)[key] === "undefined") {
            return null;
        }
        else {
            return (getExpireValueByType_(type)[key]) - (new Date().getTime());
        }
    }
    
    /**
     * Checks the existance of a key
     * 
     * @param {String} key
     * @param {cakeType} type
     * @returns {Boolean} status
     */
    function keyExists_(key, type)
    {
        if (key in getCakeValueByType_(type)) {
            return true;
        }
        return false;
    }
    
    /**
     * Reload data to library
     * 
     * @param {cakeType} type
     * @returns {Boolean} status
     */
    function reLoadData_(type)
    {
        getCakeStoreByType_(type).setItem("cupcake", JSON.stringify(getCakeValueByType_(type)));
        return true;
    }
    
    /**
     * Reload hard monitoring data to library
     * 
     * @param {cakeType} type
     * @returns {Boolean} status
     */
    function reLoadHardMonitorData_(type)
    {
        getCakeStoreByType_(type).setItem("cupcake_mon", JSON.stringify(getHardMonitorListByType_(type)));
        return true;
    }
    
    /**
     * Reload expiration data to library
     * 
     * @param {cakeType} type
     * @returns {Boolean} status
     */
    function reLoadExpireData_(type)
    {
        getCakeStoreByType_(type).setItem("cupcake_exp", JSON.stringify(getExpireValueByType_(type)));
        return true;
    }
    
    /**
     * Return current storage size
     * 
     * @param {cakeType} type
     * @returns {Number} size
     */
    function getStorageSize_(type)
    {
        return unescape(encodeURIComponent(JSON.stringify(getCakeStoreByType_(type)))).length;
    }
    
    /**
     * Clear all values stored in local storage
     * 
     * @param {type} type
     * @returns {undefined}
     */
    function clearCupValue_(type)
    {
        getCakeStoreByType_(type).setItem("cupcake", "{}");
        getCakeStoreByType_(type).setItem("cupcake_exp", "{}");
        getCakeStoreByType_(type).setItem("cupcake_mon", "{}");
    }
//--------------------------End of Core Functions-----------------------------\\

//-------------------------Local Storage Functions----------------------------\\
    localcake = {
        
        /**
         * Action types for external access
         */
        action : {
            "update" :0,
            "delete" :1,
            "expire" :2,
            "keychange" :3
        },        
        
        /**
         * Put an item to the local storage
         * 
         * @param {String} key - key to be added
         * @param {String} value - value to be added
         * @param {Number} expire - time duration to expire the key (use milliseconds)
         * @returns {Boolean} status - status of the operation
         */
        put: function(key, value, expire)
        {
            return saveItem_(key,value,expire,cakeType.LOCAL); 
        },
        
        /**
         * Get an item from the local storage
         * 
         * @param {String} key - key of the required item
         * @returns {String} value - value of the requested item
         */
        get: function(key)
        {
            if(keyExists_(key,cakeType.LOCAL)){  
                return getItem_(key,cakeType.LOCAL);
            }
            else{
               return null;
            }
        },
        
        /**
         * Update value of the given item
         * 
         * @param {String} key - key of the required item
         * @param {String} newValue - new value to be added
         * @returns {Boolean} status - status of the operation
         */        
        update: function(key, newValue)
        {
            if(keyExists_(key,cakeType.LOCAL)){  
                return updateValue_(key,newValue,cakeType.LOCAL);
            }
            else{
                return false;
            }
        },
        
        /**
         * Chnage key of an exisitng item
         * 
         * @param {String} originalKey - original key
         * @param {String} newKey - new key to be added
         * @returns {Boolean} status - status of the operation
         */        
        changeKey: function(originalKey, newKey)
        {
             if(keyExists_(originalKey,cakeType.LOCAL)){  
                return updateKey_(originalKey, newKey,cakeType.LOCAL);
            }
            else{
                return false;
            }
        },
                
        /**
         * Get all keys in local storage
         * 
         * @returns {Array} keys - list of keys
         */        
        getKeys: function()
        {
            return getAllKeys_(cakeType.LOCAL);
        },

        /**
         * Delete item in the storage
         * 
         * @param {String} key - key of the item to be deleted
         * @returns {Boolean} status - status of the operation
         */        
        deleteItem: function(key)
        {
            removeItem_(key, cakeType.LOCAL,0);
        },
                
        /**
         * Set item to expire after time duration
         * 
         * @param {String} key - key of the item to set expiration
         * @param {Number} duration - time duration for the expiration
         * @returns {Boolean} status - status of the operation
         */        
        setExpire: function(key,duration)
        {
            addExpire_(key, duration, cakeType.LOCAL);
        },
                
        /**
         * Get remaining time of the item where expiration is set
         * 
         * @param {String} key - key of the item requested
         * @returns {Object} - Returns null if never expire, number otherwise
         */        
        getExpire: function(key) 
        {
            return getRemainingExpirationTime_(key, cakeType.LOCAL);
        },
                
        /**
         * Get current size of the local storage
         * 
         * @returns {Number} size - current size of the local storage in bytes
         */        
        getSize: function()
        {
            return getStorageSize_(cakeType.LOCAL);         
        },
                
        /**
         * Start hard monitoring of an item
         * 
         * @param {String} key - key of the item to be monitored
         * @param {String} func - callback function name only
         * @returns {Boolean} status - status of the operation
         */        
        startHardMonitoring: function(key, func) 
        {
            addHardMonitor_(key, func, cakeType.LOCAL);
        },
                
        /**
         * Stop hard monitoring of an item
         * 
         * @param {String} key - key of the item to be stopped monitoring
         * @returns {Boolean} status - status of the operation
         */        
        stopHardMonitoring: function(key) 
        {
            removeHardMonitor_(key, cakeType.LOCAL);
        },
                
        /**
         * Start soft monitoring of an item
         * 
         * @param {String} key - key of the item to be monitored
         * @param {Object} func - callback function
         * @returns {Boolean} status - status of the operation
         */        
        startSoftMonitoring:function(key, func)
        {
            addSoftMonitor_(key, func, cakeType.LOCAL);          
        },
                
        /**
         * Stop soft monitoring of an item
         * 
         * @param {String} key - key of the item to be stopped monitoring
         * @returns {Boolean} status - status of the operation
         */        
        stopSoftMonitoring:function(key)
        {
            removeSoftMonitor_(key, cakeType.LOCAL);
        },
                
        /**
         * Clear local storage values
         * 
         * @returns {Boolean} status - status of the operation
         */        
        clearCup: function()
        {
            clearCupValue_(cakeType.LOCAL);
        }
    };
//---------------------End of Local Storage Functions-------------------------\\

//-------------------------Session Storage Functions--------------------------\\
    sessioncake = {
        
        /**
         * Action types for external access
         */
        action : {
            "update" :0,
            "delete" :1,
            "expire" :2,
            "keychange" :3
        },
           
        /**
         * Put an item to the session storage
         * 
         * @param {String} key - key to be added
         * @param {String} value - value to be added
         * @param {Number} expire - time duration to expire the key (use milliseconds)
         * @returns {Boolean} status - status of the operation
         */
        put: function(key, value, expire)
        {
            return saveItem_(key,value,expire,cakeType.SESSION);
        },
        
        /**
         * Get an item from the session storage
         * 
         * @param {String} key - key of the required item
         * @returns {String} value - value of the requested item
         */        
        get: function(key)
        {
            if(keyExists_(key,cakeType.SESSION)){  
                return getItem_(key,cakeType.SESSION);
            }
            else{
               return null;
            }
        },
        
        /**
         * Update value of the given item
         * 
         * @param {String} key - key of the required item
         * @param {String} newValue - new value to be added
         * @returns {Boolean} status - status of the operation
         */        
        update: function(key, newValue)
        {
            if(keyExists_(key,cakeType.SESSION)){  
                return updateValue_(key,newValue,cakeType.SESSION);
            }
            else{
                return false;
            }
        },
        
        /**
         * Change key of an exisitng item
         * 
         * @param {String} originalKey - original key
         * @param {String} newKey - new key to be added
         * @returns {Boolean} status - status of the operation
         */        
        changeKey: function(originalKey, newKey)
        {
             if(keyExists_(originalKey,cakeType.SESSION)){  
                return updateKey_(originalKey, newKey,cakeType.SESSION);
            }
            else{
                return false;
            }
        },
                
        /**
         * Get all keys in session storage
         * 
         * @returns {Array} keys - list of keys
         */        
        getKeys: function()
        {
            return getAllKeys_(cakeType.SESSION);
        },

        /**
         * Delete item in the storage
         * 
         * @param {String} key - key of the item to be deleted
         * @returns {Boolean} status - status of the operation
         */        
        deleteItem: function(key)
        {
            removeItem_(key, cakeType.SESSION,0);
        },
                
        /**
         * Set item to expire after time duration
         * 
         * @param {String} key - key of the item to set expiration
         * @param {Number} duration - time duration for the expiration
         * @returns {Boolean} status - status of the operation
         */        
        setExpire: function(key,duration)
        {
            addExpire_(key, duration, cakeType.SESSION);
        },
                
        /**
         * Get remaining time of the item where expiration is set
         * 
         * @param {String} key - key of the item requested
         * @returns {Object} - Returns null if never expire, number otherwise
         */        
        getExpire: function(key) 
        {
            return getRemainingExpirationTime_(key, cakeType.SESSION);
        },
                
        /**
         * Get current size of the session storage
         * 
         * @returns {Number} size - current size of the session storage
         */        
        getSize: function()
        {
            return getStorageSize_(cakeType.SESSION);
        },
                
        /**
         * Start hard monitoring of an item
         * 
         * @param {String} key - key of the item to be monitored
         * @param {String} func - callback function name only
         * @returns {Boolean} status - status of the operation
         */        
        startHardMonitoring: function(key, func) 
        {
            addHardMonitor_(key, func, cakeType.SESSION);
        },
                
        /**
         * Stop hard monitoring of an item
         * 
         * @param {String} key - key of the item to be stopped monitoring
         * @returns {Boolean} status - status of the operation
         */        
        stopHardMonitoring: function(key) 
        {
            removeHardMonitor_(key, cakeType.SESSION);
        },
                
        /**
         * Start soft monitoring of an item
         * 
         * @param {String} key - key of the item to be monitored
         * @param {Object} func - callback function
         * @returns {Boolean} status - status of the operation
         */        
        startSoftMonitoring:function(key, func)
        {
            addSoftMonitor_(key, func, cakeType.SESSION);          
        },
                
        /**
         * Stop soft monitoring of an item
         * 
         * @param {String} key - key of the item to be stopped monitoring
         * @returns {Boolean} status - status of the operation
         */        
        stopSoftMonitoring:function(key)
        {
            removeSoftMonitor_(key, cakeType.SESSION);
        },
                
        /**
         * Clear session storage values
         * 
         * @returns {Boolean} status - status of the operation
         */        
        clearCup: function()
        {
            clearCupValue_(cakeType.SESSION);
        }              
    };
//---------------------End of Session Storage Functions-----------------------\\

    initialize_();
    
})();