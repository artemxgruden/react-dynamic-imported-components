const {useState, useEffect, createElement} = require('react');

const createDynamicImportedComponent = ({loader, placeHolder}) => {
	let WrappedComponent = null;

	const DynamicImportedComponent = (props) => {
		const [wrappedComponentIsLoaded, setWrappedComponentIsLoaded] = useState(false);

		if (WrappedComponent === null && wrappedComponentIsLoaded === false) {
			DynamicImportedComponent.load().then(() => {
				DynamicImportedComponent.wrappedComponentIsLoaded = true;
				setWrappedComponentIsLoaded(true);
			});
		}

		if (wrappedComponentIsLoaded === false && !WrappedComponent) {
			if (placeHolder) {
				return createElement(placeHolder, {...props});
			} else {
				return null;
			}
		}

		return createElement(WrappedComponent, {...props});
	};

	DynamicImportedComponent.load = async () => {
		const ResolvedComponent = await loader();
		WrappedComponent = ResolvedComponent.default || ResolvedComponent;

		const propertyNames = Object.getOwnPropertyNames(WrappedComponent);

		for (const propertyName of propertyNames) {
			if (
				propertyName !== 'length' &&
				propertyName !== 'prototype' &&
				propertyName !== 'name' &&
				propertyName !== 'getDerivedStateFromProps'
			) {
				DynamicImportedComponent[propertyName] = WrappedComponent[propertyName];
			}
		}

		for (const key of Object.keys(WrappedComponent)) {
			DynamicImportedComponent[key] = WrappedComponent[key];
		}
	};

	return DynamicImportedComponent;
};

module.exports = createDynamicImportedComponent;
