/// <reference path="./DelegateEvent.ts" />

class TypingEffect {
    private readonly element: HTMLElement;
    private readonly untypingFinishedEvent = new DelegateEvent<void>();
    private readonly typingFinishedEvent = new DelegateEvent<void>();

    private readonly waitBetweenCharacterUntyping = 60;
    private readonly waitBetweenCharacterTyping = 110;
    private readonly waitBeforeUntyping = 1800;
    private readonly waitBeforeTyping = 400;

    private typingIntervalId: number;
    private isTyping: boolean;

    constructor(
        element: HTMLElement,
        texts: string[]) {
        this.element = element;

        let i = -1;

        this.untypingFinished.add(
            () => setTimeout(
                function () {
                    if (this.isTyping)
                        this.typeText(
                            texts[++i % texts.length])
                }.bind(this),
                this.waitBeforeTyping));

        this.typingFinished.add(
            () => setTimeout(
                function () {
                    if (this.isTyping)
                        this.untypeText();
                }.bind(this),
                this.waitBeforeUntyping));
    }

    public start(): TypingEffect {
        if (!this.isTyping) {
            this.isTyping = true;
            this.untypeText();
        }

        return this;
    }
    public stop(
        timing: StopTiming = StopTiming.Immediate): TypingEffect {
        switch (timing) {
            case StopTiming.Immediate:
                this.isTyping = false;
                clearInterval(this.typingIntervalId);
                break;
            case StopTiming.AfterUntyping:
                this.untypingFinished.addOnce(
                    function () { this.isTyping = false; }.bind(this));
                break;
            case StopTiming.AfterTyping:
                this.typingFinished.addOnce(
                    function () { this.isTyping = false; }.bind(this));
                break;
        }
        return this;
    }

    public get untypingFinished(): IDelegateEvent<void> { return this.untypingFinishedEvent; }
    public get typingFinished(): IDelegateEvent<void> { return this.typingFinishedEvent; }

    private typeText(
        text: string): void {
        let i = 0;
        this.typingIntervalId = setInterval(
            function () {
                this.element.innerText += text[i];
                if (++i === text.length) {
                    clearInterval(this.typingIntervalId);
                    this.typingFinished.trigger();
                }
            }.bind(this),
            this.waitBetweenCharacterTyping);
    }
    private untypeText(): void {
        this.typingIntervalId = setInterval(
            function () {
                this.element.innerText = this.element.innerText.slice(0, -1);
                if (this.element.innerText.length === 0) {
                    clearInterval(this.typingIntervalId);
                    this.untypingFinished.trigger();
                }

            }.bind(this),
            this.waitBetweenCharacterUntyping);
    }
}

enum StopTiming {
    Immediate,
    AfterUntyping,
    AfterTyping
}
