import Quill from "quill";
import IconAlignLeft from 'quill/assets/icons/align-left.svg';
import IconAlignCenter from 'quill/assets/icons/align-center.svg';
import IconAlignRight from 'quill/assets/icons/align-right.svg';
import { BaseModule } from './BaseModule';

const Parchment = Quill.imports.parchment;
const FloatStyle = new Parchment.Attributor.Style('float', 'float');
const MarginStyle = new Parchment.Attributor.Style('margin', 'margin');
const MarginLeftStyle = new Parchment.Attributor.Style('margin-left', 'margin-left');
const MarginRightStyle = new Parchment.Attributor.Style('margin-right', 'margin-right');
const DisplayStyle = new Parchment.Attributor.Style('display', 'display');

const offsetAttributor = new Parchment.Attributor.Attribute('nameClass', 'class', {
	scope: Parchment.Scope.INLINE,
});

Quill.register(offsetAttributor);

export class Toolbar extends BaseModule {
    onCreate = () => {
		// Setup Toolbar
        this.toolbar = document.createElement('div');
        Object.assign(this.toolbar.style, this.options.toolbarStyles);
        this.overlay.appendChild(this.toolbar);

        // Setup Buttons
        this._defineAlignments();
        this._addToolbarButtons();
    };

	// The toolbar and its children will be destroyed when the overlay is removed
    onDestroy = () => {};

	// Nothing to update on drag because we are are positioned relative to the overlay
    onUpdate = () => {};

    _defineAlignments = () => {
        this.alignments = [
            {
                icon: IconAlignLeft,
                apply: () => {
					this._makeBlock()
					MarginRightStyle.add(this.img, "auto")
                },
                isApplied: () => (MarginRightStyle.value(this.img) == 'auto' && MarginLeftStyle.value(this.img) !== 'auto'),
            },
            {
                icon: IconAlignCenter,
                apply: () => {
					this._makeBlock()
					MarginRightStyle.add(this.img, "auto")
					MarginLeftStyle.add(this.img, "auto")
                },
                isApplied: () => (MarginLeftStyle.value(this.img) == 'auto' &&  MarginRightStyle.value(this.img) == 'auto'),
            },
            {
                icon: IconAlignRight,
                apply: () => {
					this._makeBlock()
					MarginLeftStyle.add(this.img, "auto")
                },
                isApplied: () => (MarginLeftStyle.value(this.img) == 'auto' && MarginRightStyle.value(this.img) !== 'auto'),
            },
        ];
    };

    _addToolbarButtons = () => {
		const buttons = [];
		this.alignments.forEach((alignment, idx) => {
			const button = document.createElement('span');
			buttons.push(button);
			button.innerHTML = alignment.icon;
			button.addEventListener('click', () => {
					// deselect all buttons
				buttons.forEach(button => button.style.filter = '');
				if (alignment.isApplied()) {
						// If applied, unapply
					this._unApplyStyles()
				}else {
					this._selectButton(button);
					this._unApplyStyles()
					alignment.apply();
				}
					// image may change position; redraw drag handles
				this.requestUpdate();
			});
			Object.assign(button.style, this.options.toolbarButtonStyles);
			if (idx > 0) {
				button.style.borderLeftWidth = '0';
			}
			Object.assign(button.children[0].style, this.options.toolbarButtonSvgStyles);
			if (alignment.isApplied()) {
					// select button if previously applied
				this._selectButton(button);
			}
			this.toolbar.appendChild(button);
		});
    };
	_unApplyStyles(){
		MarginLeftStyle.remove(this.img);
		MarginRightStyle.remove(this.img);
		DisplayStyle.remove(this.img);
	}
    _selectButton = (button) => {
		button.style.filter = 'invert(20%)';
    };
	_makeBlock(){
		DisplayStyle.add(this.img,"block")
	}
}
