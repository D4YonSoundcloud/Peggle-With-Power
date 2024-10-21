export class UIControls {
    private gravitySlider: HTMLInputElement;
    private frictionSlider: HTMLInputElement;
    private bounceImpulseSlider: HTMLInputElement;
    private resetButton: HTMLButtonElement;

    constructor(
        private updateCallback: (gravity: number, friction: number, bounceImpulse: number) => void
    ) {
        this.createControls();
        this.addEventListeners();
    }

    private createControls(): void {
        const controlsDiv = document.createElement('div');
        controlsDiv.id = 'controls';
        controlsDiv.innerHTML = `
            <div>
                <label for="gravitySlider">Gravity: </label>
                <input type="range" id="gravitySlider" min="0" max="1" step="0.01" value="0.2">
                <span id="gravityValue">0.2</span>
            </div>
            <div>
                <label for="frictionSlider">Friction: </label>
                <input type="range" id="frictionSlider" min="0" max="1" step="0.01" value="0.99">
                <span id="frictionValue">0.99</span>
            </div>
            <div>
                <label for="bounceImpulseSlider">Bounce Impulse: </label>
                <input type="range" id="bounceImpulseSlider" min="0" max="2" step="0.01" value="0.8">
                <span id="bounceImpulseValue">0.8</span>
            </div>
            <button id="resetButton">Reset Default</button>
        `;
        document.body.appendChild(controlsDiv);

        this.gravitySlider = document.getElementById('gravitySlider') as HTMLInputElement;
        this.frictionSlider = document.getElementById('frictionSlider') as HTMLInputElement;
        this.bounceImpulseSlider = document.getElementById('bounceImpulseSlider') as HTMLInputElement;
        this.resetButton = document.getElementById('resetButton') as HTMLButtonElement;
    }

    private addEventListeners(): void {
        this.gravitySlider.addEventListener('input', this.updateValues.bind(this));
        this.frictionSlider.addEventListener('input', this.updateValues.bind(this));
        this.bounceImpulseSlider.addEventListener('input', this.updateValues.bind(this));
        this.resetButton.addEventListener('click', this.resetDefaults.bind(this));
    }

    private updateValues(): void {
        const gravity = parseFloat(this.gravitySlider.value);
        const friction = parseFloat(this.frictionSlider.value);
        const bounceImpulse = parseFloat(this.bounceImpulseSlider.value);

        document.getElementById('gravityValue')!.textContent = gravity.toFixed(2);
        document.getElementById('frictionValue')!.textContent = friction.toFixed(2);
        document.getElementById('bounceImpulseValue')!.textContent = bounceImpulse.toFixed(2);

        this.updateCallback(gravity, friction, bounceImpulse);
    }

    private resetDefaults(): void {
        this.gravitySlider.value = '0.2';
        this.frictionSlider.value = '0.99';
        this.bounceImpulseSlider.value = '0.8';
        this.updateValues();
    }
}