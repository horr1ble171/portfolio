/**
 * GradualBlur - Vanilla JS implementation of the GradualBlur component.
 * Created by Antigravity based on React Bits version.
 */
class GradualBlur {
    constructor(options = {}) {
        this.DEFAULT_CONFIG = {
            position: 'bottom',
            strength: 2,
            height: '10rem', // Increased default height for better visual effect
            divCount: 6,
            exponential: true,
            zIndex: 1000,
            opacity: 1,
            curve: 'bezier',
            target: 'page', // Set to page by default as requested "for scrolling"
            container: document.body,
            className: '',
            style: {}
        };

        this.CURVE_FUNCTIONS = {
            linear: p => p,
            bezier: p => p * p * (3 - 2 * p),
            'ease-in': p => p * p,
            'ease-out': p => 1 - Math.pow(1 - p, 2),
            'ease-in-out': p => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2)
        };

        this.config = Object.assign({}, this.DEFAULT_CONFIG, options);
        this.element = null;
        this.init();
    }

    getGradientDirection(position) {
        const directions = {
            top: 'to top',
            bottom: 'to bottom',
            left: 'to left',
            right: 'to right'
        };
        return directions[position] || 'to bottom';
    }

    init() {
        const { position, height, zIndex, target, className, style, container } = this.config;

        this.element = document.createElement('div');
        this.element.className = `gradual-blur ${target === 'page' ? 'gradual-blur-page' : 'gradual-blur-parent'} ${className}`;
        
        const isVertical = ['top', 'bottom'].includes(position);
        const isHorizontal = ['left', 'right'].includes(position);
        const isPageTarget = target === 'page';

        // Base styles for the outer container
        Object.assign(this.element.style, {
            position: isPageTarget ? 'fixed' : 'absolute',
            pointerEvents: 'none',
            zIndex: isPageTarget ? zIndex : zIndex,
            ...style
        });

        if (isVertical) {
            this.element.style.height = height;
            this.element.style.width = '100%';
            this.element.style[position] = '0';
            this.element.style.left = '0';
            this.element.style.right = '0';
        } else if (isHorizontal) {
            this.element.style.width = height;
            this.element.style.height = '100%';
            this.element.style[position] = '0';
            this.element.style.top = '0';
            this.element.style.bottom = '0';
        }

        const inner = document.createElement('div');
        inner.className = 'gradual-blur-inner';
        Object.assign(inner.style, {
            position: 'relative',
            width: '100%',
            height: '100%',
            pointerEvents: 'none'
        });

        const blurDivs = this.createBlurDivs();
        blurDivs.forEach(div => inner.appendChild(div));

        this.element.appendChild(inner);
        container.appendChild(this.element);
    }

    createBlurDivs() {
        const { divCount, strength, curve, exponential, position, opacity } = this.config;
        const divs = [];
        const increment = 100 / divCount;
        const curveFunc = this.CURVE_FUNCTIONS[curve] || this.CURVE_FUNCTIONS.linear;

        for (let i = 1; i <= divCount; i++) {
            let progress = i / divCount;
            progress = curveFunc(progress);

            let blurValue;
            if (exponential) {
                blurValue = Math.pow(2, progress * 4) * 0.0625 * strength;
            } else {
                blurValue = 0.0625 * (progress * divCount + 1) * strength;
            }

            const p1 = Math.round((increment * i - increment) * 10) / 10;
            const p2 = Math.round(increment * i * 10) / 10;
            const p3 = Math.round((increment * i + increment) * 10) / 10;
            const p4 = Math.round((increment * i + increment * 2) * 10) / 10;

            let gradient = `transparent ${p1}%, black ${p2}%`;
            if (p3 <= 100) gradient += `, black ${p3}%`;
            if (p4 <= 100) gradient += `, transparent ${p4}%`;

            const direction = this.getGradientDirection(position);

            const div = document.createElement('div');
            Object.assign(div.style, {
                position: 'absolute',
                inset: '0',
                maskImage: `linear-gradient(${direction}, ${gradient})`,
                WebkitMaskImage: `linear-gradient(${direction}, ${gradient})`,
                backdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
                WebkitBackdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
                opacity: opacity
            });

            divs.push(div);
        }
        return divs;
    }
}

// Auto-initialize if requested or expose globally
window.GradualBlur = GradualBlur;
