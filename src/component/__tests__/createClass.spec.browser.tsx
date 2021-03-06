import {expect} from 'chai';
import {render} from '../../DOM/rendering';
import {innerHTML} from '../../tools/utils';
import createClass from '../createClass';

describe('Components createClass (non-JSX)', () => {
	let container;

	beforeEach(() => {
		container = document.createElement('div');
		container.style.display = 'none';
		document.body.appendChild(container);
	});

	afterEach(() => {
		document.body.removeChild(container);
		render(null, container);
	});

	/*
	describe("mixins", () => {
		describe("getDefaultProps", () => {
			it('should use a mixin', () => {
				const Foo = createClass({
					mixins: [
						{getDefaultProps: () => ({a: true})}
					],
					render() {
						return <div></div>;
					}
				});

				expect(Foo.defaultProps).to.eql({
					a: true
				});
			});

			it('should combine the results', () => {
				const Foo = createClass({
					mixins: [
						{getDefaultProps: () => ({a: true})},
						{getDefaultProps: () => ({b: true})}
					],
					getDefaultProps() {
						return {c: true};
					},
					render() {
						return <div />;
					}
				});

				expect(Foo.defaultProps).to.eql({
					a: true,
					b: true,
					c: true
				});
			});

			it('should throw an error for duplicate keys', () => {
				expect(() => {
					createClass({
						mixins: [
							{getDefaultProps: () => ({a: true})}
						],
						getDefaultProps() {
							return {a: true};
						},
						render() {
							return <div />;
						}
					});
				}).to.throw();
			});
		});

		describe("getInitialState", () => {
			it('should combine the results', () => {
				const Foo = createClass({
					mixins: [
						{getInitialState: () => ({a: true})},
						{getInitialState: () => ({b: true})}
					],
					getInitialState() {
						return {c: true};
					},
					render() {
						return <div />;
					}
				});

				let a;
				render(<Foo ref={function (i) {a = i}} />, container);

				expect(a.state).to.eql({
					a: true,
					b: true,
					c: true
				});
			});

			it('should throw an error for duplicate keys', () => {
				const Foo = createClass({
					mixins: [
						{getInitialState: () => ({a: true})}
					],
					getInitialState() {
						return {a: true};
					},
					render() {
						return <div />;
					}
				});

				expect(() => {
					render(<Foo />, container);
				}).to.throw();
			});
		});
	});
*/
	describe('Context', () => {
		it('It should have context defined when context moved to children', () => {
			const App = createClass({
				getDefaultProps() {
					return {
						wrapContext: false,
					};
				},

				getChildContext() {
					return {
						foo: 'bar baz',
					};
				},

				addPageContexts(children) {
					const newChildren = [];

					for (let i = 0; i < children.length; i++) {
						newChildren.push(<Page {...children[i].props} />);
					}

					return newChildren;
				},

				render() {
					let children;

					if (this.props.wrapContext) {
						children = this.addPageContexts(this.props.children);
					} else {
						children = this.props.children;
					}

					return (
						<div>
							{children}
						</div>
					);
				},
			});

			const Page = createClass({
				getInitialState() {
					return {
						foo: this.context.foo,
					};
				},
				render() {
					return <div>{this.props.greeting} {this.state.foo}</div>;
				},
			});

			render(
				(
					<App wrapContext={true}>
						<Page greeting="Hello" />
						<Page greeting="Hai" />
					</App>
				), container);

			expect(container.innerHTML).to.eql(innerHTML('<div><div>Hello bar baz</div><div>Hai bar baz</div></div>'));
		});
	});
});
