var DelegateEvent = /** @class */ (function () {
    function DelegateEvent() {
        this.handlers = [];
    }
    DelegateEvent.prototype.add = function (handler) {
        this.handlers.push(handler);
    };
    DelegateEvent.prototype.addOnce = function (handler) {
        var onceHandler = function (d) {
            this.remove(onceHandler);
            handler(d);
        }.bind(this);
        this.add(onceHandler);
    };
    DelegateEvent.prototype.remove = function (handler) {
        this.handlers = this.handlers.filter(function (h) { return h !== handler; });
    };
    DelegateEvent.prototype.trigger = function (data) {
        this.handlers.slice(0).forEach(function (h) { return h(data); });
    };
    return DelegateEvent;
}());
/// <reference path="./DelegateEvent.ts" />
var TypingEffect = /** @class */ (function () {
    function TypingEffect(element, texts) {
        var _this = this;
        this.untypingFinishedEvent = new DelegateEvent();
        this.typingFinishedEvent = new DelegateEvent();
        this.waitBetweenCharacterUntyping = 60;
        this.waitBetweenCharacterTyping = 110;
        this.waitBeforeUntyping = 1800;
        this.waitBeforeTyping = 400;
        this.element = element;
        var i = -1;
        this.untypingFinished.add(function () { return setTimeout(function () {
            if (this.isTyping)
                this.typeText(texts[++i % texts.length]);
        }.bind(_this), _this.waitBeforeTyping); });
        this.typingFinished.add(function () { return setTimeout(function () {
            if (this.isTyping)
                this.untypeText();
        }.bind(_this), _this.waitBeforeUntyping); });
    }
    TypingEffect.prototype.start = function () {
        if (!this.isTyping) {
            this.isTyping = true;
            this.untypeText();
        }
        return this;
    };
    TypingEffect.prototype.stop = function (timing) {
        if (timing === void 0) { timing = StopTiming.Immediate; }
        switch (timing) {
            case StopTiming.Immediate:
                this.isTyping = false;
                clearInterval(this.typingIntervalId);
                break;
            case StopTiming.AfterUntyping:
                this.untypingFinished.addOnce(function () { this.isTyping = false; }.bind(this));
                break;
            case StopTiming.AfterTyping:
                this.typingFinished.addOnce(function () { this.isTyping = false; }.bind(this));
                break;
        }
        return this;
    };
    Object.defineProperty(TypingEffect.prototype, "untypingFinished", {
        get: function () { return this.untypingFinishedEvent; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TypingEffect.prototype, "typingFinished", {
        get: function () { return this.typingFinishedEvent; },
        enumerable: true,
        configurable: true
    });
    TypingEffect.prototype.typeText = function (text) {
        var i = 0;
        this.typingIntervalId = setInterval(function () {
            this.element.innerText += text[i];
            if (++i === text.length) {
                clearInterval(this.typingIntervalId);
                this.typingFinished.trigger();
            }
        }.bind(this), this.waitBetweenCharacterTyping);
    };
    TypingEffect.prototype.untypeText = function () {
        this.typingIntervalId = setInterval(function () {
            this.element.innerText = this.element.innerText.slice(0, -1);
            if (this.element.innerText.length === 0) {
                clearInterval(this.typingIntervalId);
                this.untypingFinished.trigger();
            }
        }.bind(this), this.waitBetweenCharacterUntyping);
    };
    return TypingEffect;
}());
var StopTiming;
(function (StopTiming) {
    StopTiming[StopTiming["Immediate"] = 0] = "Immediate";
    StopTiming[StopTiming["AfterUntyping"] = 1] = "AfterUntyping";
    StopTiming[StopTiming["AfterTyping"] = 2] = "AfterTyping";
})(StopTiming || (StopTiming = {}));
//# sourceMappingURL=ts.js.map