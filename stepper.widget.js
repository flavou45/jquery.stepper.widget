;(function($){
    // Consts which can be ascertained by the update event.
    // Show whether the value is different from the original
    var CHANGE_TYPE_SAME = "same_value_entered";
    var CHANGE_TYPE_DIFFERENT = "different_value_entered";

    $.widget('llapgoch.stepper', {
        options: {
            // Used to store on the element's data attribute and event namespace
            upSelector: '.js-qty-up',
            downSelector: '.js-qty-down',
            inputSelector: '.js-qty-input',
            disabledClass:'disabled',

            maxQty: 999,
            minQty: 1,
            step: 1
        },

        originalValue: null,
        value: 0,

        _create: function(){
            this._super();
            this._addEvents();

            var val = this._validateValue(this._getInput().val());

            this._getInput().val(val);

            this.originalValue = val;
            this.value = val;
        },
        
        _destroy: function() {
            this._removeEvents();
        },

        disable: function(){
            this._super();
            this._getInput().prop('disabled', 'disabled').addClass(this.options.disabledClass);
            this._getDownElement().addClass(this.options.disabledClass);
            this._getUpElement().addClass(this.options.disabledClass)
        },

        enable: function(){
            this._super();
            this._getInput().removeProp('disabled').addClass(this.options.disabledClass);
            this._getDownElement().removeClass(this.options.disabledClass);
            this._getUpElement().removeClass(this.options.disabledClass);
        },

        _validateValue: function(val){
            val = parseFloat(val);
            val = isNaN(val) ? 1 : val;
            return Math.max(this.options.minQty, Math.min(val, this.options.maxQty));
        },

        _getEvents: function(){
            var self = this;
            var events = {};

            events["click " + this.options.upSelector] = function(ev){
                ev.preventDefault();
                self.stepQuantity(self.options.step);
            };

            events["click " + this.options.downSelector] = function(ev){
                ev.preventDefault();
                self.stepQuantity(-self.options.step);
            };

            events["input " + this.options.inputSelector] = function(ev){
                var val = self._getInput().val();

                if(val !== "" && !isNaN(parseFloat(val))) {
                   self.updateQuantity(val);
                }
            };

            events["blur " + this.options.inputSelector] = function(ev){
                self.updateQuantity(self.value);
            };
            
            return events;
        },

        _addEvents: function(){            
            this._on(this.element, this._getEvents());
        },
        
        _removeEvents: function(){ 
            var self = this;
            var aEventName = Object.keys(this._getEvents());
            $.each(aEventName, function(i, event){
               self._off(self.element, event); 
            });
        },

        _fireEvent: function(eventName, event, data){
            data = data || {};

            this._trigger(eventName, event, $.extend({}, data, {
                element: this.element
            }));
        },

        _fireUpdate: function(ev){
            var updateType = CHANGE_TYPE_SAME;

            if(this.value != this.originalValue){
                updateType = CHANGE_TYPE_DIFFERENT;
            }

            this._fireEvent('update', ev, {
                'value': this.value,
                'updateType': updateType
            });
        },

        _getInput: function(){
            return $(this.options.inputSelector, this.element);
        },

        _getUpElement: function(){
            return $(this.options.upSelector, this.element);
        },

        _getDownElement: function(){
            return $(this.options.downSelector, this.element);
        },

        _setOption(key, value){            
            this._super(key, value);
            if(key == 'minQty' || key == 'maxQty'){
                this.value = this._validateValue(this.value);
                this._getInput().val(this.value);
            }
        },
        
        _setOptions: function( options ) {
            var that = this;
            $.each(options, function(key, value) {
              that._setOption(key, value);
            });
        },
        
        updateQuantity: function(quantity, fireEvt = true) {
            this.value = this._validateValue(quantity);
            this._getInput().val(this.value);
            if(fireEvt){
                this._fireUpdate();
            }
        },

        stepQuantity: function(value) {
            this.updateQuantity(this.value + value);
        },

        getValue: function(){
            return this.value;
        }
    });
}(jQuery));