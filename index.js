import Carousel from './components/Carousel/carousel.js';
import slides from './contents/slider/slides.js';

import RibbonMenu from './components/RibbonMenu/menu.js';
import categories from './contents/categories/categories.js';

import StepSlider from './components/StepSlider/slider.js';
import ProductsGrid from './components/ProductsGrid/products.js';

import CartIcon from './components/CartIcon/carticon.js';
import Cart from './components/Cart/cart.js';

export default class Main {

	constructor() {
	}

	async render() {
		this.renderCarousel();
		this.renderRibbonMenu();
		this.renderStepSlider();
		this.renderCartIcon();

		this.cart = new Cart(this.cartIcon);
		this.products = await this.fetchProducts();

		this.renderProductsGrid();

		this.productsGrid.updateFilter({
			noNuts: document.getElementById('nuts-checkbox').checked,
			vegeterianOnly: document.getElementById('vegeterian-checkbox').checked,
			maxSpiciness: this.stepSlider.value,
			category: this.ribbonMenu.value
		});

		document.body.addEventListener('product-add', ({ detail: productId }) => {
			let product = this.products.find(element => element.id == productId);
			this.cart.addProduct(product);
		});

		this.stepSlider.elem.addEventListener('slider-change', ({ detail: value }) => {
			this.productsGrid.updateFilter({
				maxSpiciness: value
			});
		});

		this.ribbonMenu.elem.addEventListener('ribbon-select', ({ detail: categoryId }) => {
			this.productsGrid.updateFilter({
				category: categoryId
			})
		});

		document.getElementById('nuts-checkbox').onchange = event => {
			this.productsGrid.updateFilter({
				noNuts: event.target.checked
			});
		};

		document.getElementById('vegeterian-checkbox').onchange = event => {
			this.productsGrid.updateFilter({
				vegeterianOnly: event.target.checked
			});
		};
	}

	renderCarousel() {
		this.carousel = new Carousel(slides);
		document.querySelector('[data-carousel-holder]').append(this.carousel.elem);
	}

	renderRibbonMenu() {
		this.ribbonMenu = new RibbonMenu(categories);
		document.querySelector('[data-ribbon-holder]').append(this.ribbonMenu.elem);
	}

	renderStepSlider() {
		this.stepSlider = new StepSlider({ steps: 5, value: 3 });
		document.querySelector('[data-slider-holder]').append(this.stepSlider.elem);
	}

	renderCartIcon() {
		this.cartIcon = new CartIcon();
		document.querySelector('[data-cart-icon-holder]').append(this.cartIcon.elem);
	}

	async fetchProducts() {
		const response = await fetch('products.json');
		const jsonProducts = await response.json();

		return jsonProducts;
	}

	renderProductsGrid() {
		this.productsGrid = new ProductsGrid(this.products);
		document.querySelector('[data-products-grid-holder]').innerHTML = '';
		document.querySelector('[data-products-grid-holder]').append(this.productsGrid.elem)
	}
}
