(function($) {
    $.LazyList = function () { this.init.apply(this, arguments) };
    $.LazyList.prototype = {
        // generator:
        //   receives previous lazy list
        //   returns new $.Deferred
        // prev:
        //   previous $.LazyList
        init: function (generator, prev) {
            if (!$.isFunction(generator)) {
                throw("generator must be a function (" + generator + ")");
            }
            this.generator = generator;

            if (prev) {
                if (!(prev instanceof $.LazyList)) {
                    throw("prev must be a instance of LazyList");
                }
                this._prev = prev;
            }
        },
        // calculate value
        // returns $.Deferred
        promise: function() {
            if (!this._promise) {
                var dfd = this.generator(this.prev());
                if (!$.isFunction(dfd.promise)) {
                    throw("generator must return a Deferred Object (" + dfd + ")");
                }
                this._promise = dfd.promise();
            }

            return this._promise;
        },
        // returns previous node
        prev: function() {
            return this._prev;
        },
        // returns next node
        next: function() {
            if (!this._next) {
                this._next = new $.LazyList(this.generator, this);
            }
            return this._next;
        },
        // returns the root node
        root: function() {
            if (this._prev) {
                return this._prev.root();
            } else {
                return this;
            }
        }
    };
})(jQuery);
