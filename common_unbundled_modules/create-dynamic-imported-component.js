const { useState, useEffect, createElement } = require("react");

const createDynamicImportedComponent = ({ loader, PlaceholderComponent }) => {
  let WrappedComponent = null;

  const DynamicImportedComponent = (props) => {
    const [wrappedComponentIsLoaded, setWrappedComponentIsLoaded] = useState(
      false
    );

    if (!WrappedComponent) {
      DynamicImportedComponent.load()
        .then((_WrappedComponent) => {
          DynamicImportedComponent.wrappedComponentIsLoaded = true;
          WrappedComponent = _WrappedComponent;
          DynamicImportedComponent.WrappedComponent = WrappedComponent;
          setWrappedComponentIsLoaded(true);
        })
        .catch((error) => console.log(error));
    }

    if (!WrappedComponent) {
      if (PlaceholderComponent) {
        return createElement(PlaceholderComponent, { ...props });
      }

      return null;
    }

    return createElement(WrappedComponent, { ...props });
  };

  DynamicImportedComponent.load = async () => {
    const ResolvedComponent = await loader();
    WrappedComponent = ResolvedComponent.default || ResolvedComponent;

    const propertyNames = Object.getOwnPropertyNames(WrappedComponent);

    for (const propertyName of propertyNames) {
      if (
        propertyName !== "length" &&
        propertyName !== "prototype" &&
        propertyName !== "name" &&
        propertyName !== "getDerivedStateFromProps"
      ) {
        DynamicImportedComponent[propertyName] = WrappedComponent[propertyName];
      }
    }

    for (const key of Object.keys(WrappedComponent)) {
      DynamicImportedComponent[key] = WrappedComponent[key];
    }

    return WrappedComponent;
  };

  return DynamicImportedComponent;
};

module.exports = createDynamicImportedComponent;
